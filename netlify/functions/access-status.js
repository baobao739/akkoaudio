const { createClient } = require("@supabase/supabase-js");
const { getCookie, parseToken, json } = require("./_shared/auth");

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") return json(405, { error: "Method not allowed" });

  try {
    const token = getCookie(event, "akkoflac_access");
    const parsed = await parseToken(token, "access");
    if (!parsed.ok) {
      return json(200, { valid: false, unlocked: false }, { "Cache-Control": "no-store" });
    }

    // Legacy tokens (no code id) stay valid
    if (!parsed.extra) {
      return json(200, { valid: true, unlocked: true }, { "Cache-Control": "no-store" });
    }

    // Newer tokens: check the code wasn't revoked
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false }
    });

    const { data, error } = await supabase
      .from("access_codes")
      .select("id, revoked")
      .eq("id", parsed.extra)
      .maybeSingle();

    if (error) {
      console.error(error);
      return json(200, { valid: false, unlocked: false }, { "Cache-Control": "no-store" });
    }

    const valid = !!(data && !data.revoked);
    return json(200, { valid, unlocked: valid }, { "Cache-Control": "no-store" });
  } catch (error) {
    console.error(error);
    return json(200, { valid: false, unlocked: false }, { "Cache-Control": "no-store" });
  }
};
