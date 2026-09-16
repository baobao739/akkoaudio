const { createClient } = require("@supabase/supabase-js");
const { requireAdmin, json } = require("./_shared/auth");

function db() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  });
}

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
      return json(500, {
        error: "Could not list codes. Run supabase-referral.sql if table is missing."
      });
    }

    return json(200, { ok: true, codes: data || [] });
  } catch (error) {
    console.error(error);
    return json(500, { error: "Server error." });
  }
};
