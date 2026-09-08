const { createClient } = require("@supabase/supabase-js");
const { getCookie, verifyToken, json } = require("./_shared/auth");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });
  if (!(await verifyToken(getCookie(event, "akkoflac_admin"), "admin"))) {
    return json(401, { error: "Unauthorized" });
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const id = String(body.id || "").trim();
    if (!id) return json(400, { error: "Missing code id." });

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false }
    });

    const { data, error } = await supabase
      .from("access_codes")
      .update({ revoked: true })
      .eq("id", id)
      .select("id, code, name, used, revoked")
      .maybeSingle();

    if (error) throw error;
    if (!data) return json(404, { error: "Code not found." });

    return json(200, { ok: true, code: data }, { "Cache-Control": "no-store" });
  } catch (error) {
    console.error(error);
    return json(500, { error: "Server error." });
  }
};
