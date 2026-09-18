const { json, getCookie, parseToken, clearCookie } = require("./_shared/auth");
const { db } = require("./_shared/supabase");

exports.handler = async (event) => {
  if (event.httpMethod !== "GET" && event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  try {
    const raw = getCookie(event, "akkomusic_user");
    const parsed = await parseToken(raw, "user");
    if (!parsed.ok || !parsed.extra) {
      return json(200, { valid: false, unlocked: false, reason: "missing", is_premium: false });
    }

    const supabase = db();
    let data = null;
    let error = null;

    ({ data, error } = await supabase
      .from("accounts")
      .select("id, username, status, is_premium")
      .eq("id", parsed.extra)
      .maybeSingle());

    if (error) {
      ({ data, error } = await supabase
        .from("accounts")
        .select("id, username, status")
        .eq("id", parsed.extra)
        .maybeSingle());
    }

    if (error) {
      console.error(error);
      return json(200, { valid: false, unlocked: false, reason: "error", is_premium: false });
    }

    if (!data) {
      return json(
        200,
        { valid: false, unlocked: false, reason: "invalid", is_premium: false },
        { "Set-Cookie": clearCookie("akkomusic_user") }
      );
    }

    if (data.status !== "approved") {
      return json(
        200,
        {
          valid: false,
          unlocked: false,
          reason: data.status,
          status: data.status,
          is_premium: false
        },
        { "Set-Cookie": clearCookie("akkomusic_user") }
      );
    }

    return json(200, {
      valid: true,
      unlocked: true,
      username: data.username,
      status: "approved",
      is_premium: data.is_premium === true
    });
  } catch (error) {
    console.error(error);
    return json(200, { valid: false, unlocked: false, reason: "error", is_premium: false });
  }
};
