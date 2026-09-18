const { requireAdmin, json } = require("./_shared/auth");
const { db } = require("./_shared/supabase");

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") return json(405, { error: "Method not allowed" });

  const auth = await requireAdmin(event);
  if (!auth.ok) return json(401, { error: "Unauthorized" });

  try {
    const supabase = db();
    const { data, error } = await supabase
      .from("premium_codes")
      .select("id, code, label, max_uses, use_count, created_at, last_used_at")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) {
      console.error(error);
      return json(500, {
        error: error.message || "Could not list premium codes. Run supabase-premium.sql if missing."
      });
    }

    return json(200, { ok: true, codes: data || [] });
  } catch (error) {
    console.error(error);
    return json(500, { error: error.message || "Server error." });
  }
};
