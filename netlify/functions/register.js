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
const MAX_PER_IP = 2;
const MAX_PENDING_GLOBAL = 25;

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

function publicRegisterAllowed() {
  const v = String(process.env.ALLOW_PUBLIC_REGISTER || "false").toLowerCase().trim();
  return v === "true" || v === "1" || v === "yes";
}

function db() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  });
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });

  if (!publicRegisterAllowed()) {
    return json(403, {
      error: "Public registration is closed. Access is whitelist-only. Ask the admin for an account."
    });
  }

  if (rateLimited(clientKey(event))) {
    return json(429, { error: "Too many sign-up attempts from this network. Try later." });
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const username = normalizeUsername(body.username);
    const password = String(body.password || "");

    if (!isValidUsername(username)) {
      return json(400, {
        error: "Username must be 3–32 characters: letters, numbers, underscore only."
      });
    }
    if (!isValidPassword(password)) {
      return json(400, { error: "Password must be 6–128 characters." });
    }

    const supabase = db();

    const { count, error: countErr } = await supabase
      .from("accounts")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending");

    if (countErr) {
      console.error(countErr);
      return json(500, { error: "Could not create account." });
    }
    if ((count || 0) >= MAX_PENDING_GLOBAL) {
      return json(429, {
        error: "Too many pending requests. Wait for admin review."
      });
    }

    const password_hash = await hashPassword(password);

    const { data, error } = await supabase
      .from("accounts")
      .insert({
        username,
        password_hash,
        status: "pending"
      })
      .select("id, username, status, created_at")
      .single();

    if (error) {
      if (error.code === "23505") {
        return json(409, { error: "That username is already taken." });
      }
      console.error(error);
      return json(500, { error: "Could not create account." });
    }

    return json(200, {
      ok: true,
      username: data.username,
      status: data.status,
      message: "Request submitted. An admin must approve you before login works."
    });
  } catch (error) {
    console.error(error);
    return json(400, { error: "Invalid request." });
  }
};
