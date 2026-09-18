const { json, getCookie, parseToken } = require("./_shared/auth");
const { db } = require("./_shared/supabase");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });

  try {
    const raw = getCookie(event, "akkomusic_user");
    const parsed = await parseToken(raw, "user");
    if (!parsed.ok || !parsed.extra) {
      return json(401, { ok: false, error: "Not signed in." });
    }

    const body = JSON.parse(event.body || "{}");
    const code = String(body.code || "")
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 16);

    if (!code || code.length < 4) {
      return json(400, { ok: false, error: "Enter a valid premium code." });
    }

    const supabase = db();

    const { data: account, error: accErr } = await supabase
      .from("accounts")
      .select("id, username, status, is_premium")
      .eq("id", parsed.extra)
      .maybeSingle();

    if (accErr || !account || account.status !== "approved") {
      return json(401, { ok: false, error: "Account not allowed." });
    }

    if (account.is_premium === true) {
      return json(200, { ok: true, is_premium: true, message: "You already have Premium." });
    }

    const { data: row, error: codeErr } = await supabase
      .from("premium_codes")
      .select("id, code, max_uses, use_count")
      .eq("code", code)
      .maybeSingle();

    if (codeErr) {
      console.error(codeErr);
      return json(500, { ok: false, error: "Server error checking code." });
    }

    if (!row) {
      return json(400, { ok: false, error: "Invalid premium code." });
    }

    if ((row.use_count || 0) >= (row.max_uses || 1)) {
      return json(400, { ok: false, error: "This premium code is used up." });
    }

    const { error: upCodeErr } = await supabase
      .from("premium_codes")
      .update({
        use_count: (row.use_count || 0) + 1,
        last_used_at: new Date().toISOString()
      })
      .eq("id", row.id)
      .eq("use_count", row.use_count);

    if (upCodeErr) {
      console.error(upCodeErr);
      return json(500, { ok: false, error: "Could not redeem code. Try again." });
    }

    const { error: upAccErr } = await supabase
      .from("accounts")
      .update({
        is_premium: true,
        premium_at: new Date().toISOString(),
        premium_code: code
      })
      .eq("id", account.id);

    if (upAccErr) {
      console.error(upAccErr);
      return json(500, {
        ok: false,
        error: "Code used but account update failed. Run supabase-premium.sql then contact admin."
      });
    }

    return json(200, {
      ok: true,
      is_premium: true,
      message: "Premium unlocked."
    });
  } catch (error) {
    console.error(error);
    return json(400, { ok: false, error: "Invalid request." });
  }
};
