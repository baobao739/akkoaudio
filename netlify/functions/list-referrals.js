const { requireAdmin, json } = require("./_shared/auth");
const { db } = require("./_shared/supabase");

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") return json(405, { error: "Method not allowed" });

  const auth = await requireAdmin(event);
  if (!auth.ok) return json(401, { error: "Unauthorized" });

  try {
    const supabase = db();
    const { data, error } = await supabase
      .from("referral_codes")
      .select("id, code, label, max_uses, use_count, created_at, last_used_at")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) {
      console.error(error);
      const msg = String(error.message || "");
      if (/invalid api key/i.test(msg)) {
        return json(500, {
          error:
            "Invalid API key — set SUPABASE_SERVICE_ROLE_KEY to service_role secret (same project as SUPABASE_URL), then redeploy."
        });
      }
      return json(500, {
        error: "Could not list codes: " + msg
      });
    }

    return json(200, { ok: true, codes: data || [] });
  } catch (error) {
    console.error(error);
    return json(500, { error: error.message || "Server error." });
  }
};
