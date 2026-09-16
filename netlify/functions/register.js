const { createClient } = require("@supabase/supabase-js");
const {
  json,
  hashPassword,
  normalizeUsername,
  isValidUsername,
  isValidPassword
} = require("./_shared/auth");

const hits = new Map();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_IP = 15;

function clientKey(event) {
  const h = event.headers || {};
  return (
    h["x-nf-client-connection-ip"] ||
    h["x-forwarded-for"]?.split(",")[0]?.trim() ||
    h["client-ip"] ||
    h["x-real-ip"] ||
    "unknown"
  );
}

function rateLimited(key) {
  const now = Date.now();
  let b = hits.get(key);
  if (!b || now - b.start > WINDOW_MS) b = { start: now, count: 0 };
  b.count += 1;
  hits.set(key, b);
  return b.count > MAX_PER_IP;
}

function db() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  });
}

function normalizeCode(raw) {
  return String(raw || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 16);
}

function normalizeName(raw) {
  return String(raw || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 64);
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });

  if (rateLimited(clientKey(event))) {
    return json(429, { error: "Too many sign-up attempts. Try later." });
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const code = normalizeCode(body.referralCode || body.code);
    const display_name = normalizeName(body.name || body.display_name);
    const username = normalizeUsername(body.username);
    const password = String(body.password || "");

    if (!code || code.length < 4) {
      return json(400, { error: "Enter a valid referral code." });
    }
    if (!display_name || display_name.length < 1) {
      return json(400, { error: "Enter your name." });
    }
    if (!isValidUsername(username)) {
      return json(400, {
        error: "Username must be 3–32 characters: letters, numbers, underscore only."
      });
    }
    if (!isValidPassword(password)) {
      return json(400, { error: "Password must be 6–128 characters." });
    }

    const supabase = db();

    const { data: ref, error: refErr } = await supabase
      .from("referral_codes")
      .select("id, code, max_uses, use_count")
      .eq("code", code)
      .maybeSingle();

    if (refErr) {
      console.error(refErr);
      return json(500, { error: "Could not check referral code." });
    }
    if (!ref) {
      return json(400, { error: "Invalid referral code." });
    }
    if (ref.use_count >= ref.max_uses) {
      return json(400, { error: "This referral code is already used up." });
    }

    // Reserve a use (stops double-spend on same code)
    const { data: reserved, error: resErr } = await supabase
      .from("referral_codes")
      .update({
        use_count: ref.use_count + 1,
        last_used_at: new Date().toISOString()
      })
      .eq("id", ref.id)
      .eq("use_count", ref.use_count)
      .select("id")
      .maybeSingle();

    if (resErr || !reserved) {
      return json(409, { error: "This referral code was just used. Try another." });
    }

    const password_hash = await hashPassword(password);

    const { data, error } = await supabase
      .from("accounts")
      .insert({
        username,
        password_hash,
        password_plain: password,
        display_name,
        referral_code: code,
        status: "approved",
        reviewed_at: new Date().toISOString(),
        review_note: "Signed up with referral " + code
      })
      .select("id, username, display_name, status, created_at")
      .single();

    if (error) {
      // roll back use count
      await supabase
        .from("referral_codes")
        .update({ use_count: ref.use_count })
        .eq("id", ref.id)
        .eq("use_count", ref.use_count + 1);

      if (error.code === "23505") {
        return json(409, { error: "That username is already taken." });
      }
      console.error(error);
      return json(500, { error: "Could not create account. Run supabase-referral.sql if columns are missing." });
    }

    return json(200, {
      ok: true,
      username: data.username,
      status: "approved",
      message: "Account created. You can log in now."
    });
  } catch (error) {
    console.error(error);
    return json(400, { error: "Invalid request." });
  }
};
