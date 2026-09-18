const { requireAdmin, json } = require("./_shared/auth");
const { db } = require("./_shared/supabase");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });

  const auth = await requireAdmin(event);
  if (!auth.ok) return json(401, { error: "Unauthorized" });

  try {
    const body = JSON.parse(event.body || "{}");
    const id = String(body.id || "").trim();
    const action = String(body.action || "").trim().toLowerCase();
    const note = String(body.note || "").trim().slice(0, 300) || null;

    if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
      return json(400, { error: "Invalid account id." });
    }
    if (!["approve", "deny", "revoke", "delete", "grant_premium", "remove_premium"].includes(action)) {
      return json(400, {
        error: "action must be approve, deny, revoke, delete, grant_premium, or remove_premium."
      });
    }

    const supabase = db();

    let row = null;
    let findError = null;
    ({ data: row, error: findError } = await supabase
      .from("accounts")
      .select("id, username, status, is_premium")
      .eq("id", id)
      .maybeSingle());

    if (findError) {
      const fb = await supabase.from("accounts").select("id, username, status").eq("id", id).maybeSingle();
      if (fb.error) throw fb.error;
      row = fb.data;
      if (action === "grant_premium" || action === "remove_premium") {
        return json(500, { error: "Run supabase-premium.sql first (is_premium column missing)." });
      }
    }

    if (!row) return json(404, { error: "Account not found." });

    if (action === "delete") {
      const { error } = await supabase.from("accounts").delete().eq("id", id);
      if (error) throw error;
      return json(200, { ok: true, deleted: true, id });
    }

    if (action === "grant_premium") {
      const { data, error } = await supabase
        .from("accounts")
        .update({
          is_premium: true,
          premium_at: new Date().toISOString(),
          premium_code: note || "ADMIN"
        })
        .eq("id", id)
        .select("id, username, is_premium, premium_at")
        .maybeSingle();
      if (error) throw error;
      return json(200, { ok: true, account: data });
    }

    if (action === "remove_premium") {
      const { data, error } = await supabase
        .from("accounts")
        .update({ is_premium: false, premium_at: null, premium_code: null })
        .eq("id", id)
        .select("id, username, is_premium")
        .maybeSingle();
      if (error) throw error;
      return json(200, { ok: true, account: data });
    }

    if (action === "approve") {
      if (!["pending", "denied", "revoked"].includes(row.status)) {
        return json(400, { error: "Cannot approve account that is " + row.status + "." });
      }
      const { data, error } = await supabase
        .from("accounts")
        .update({ status: "approved", reviewed_at: new Date().toISOString(), review_note: note })
        .eq("id", id)
        .select("id, username, status, reviewed_at")
        .maybeSingle();
      if (error) throw error;
      return json(200, { ok: true, account: data });
    }

    if (action === "deny") {
      if (row.status !== "pending") {
        return json(400, { error: "Only pending accounts can be denied." });
      }
      const { data, error } = await supabase
        .from("accounts")
        .update({ status: "denied", reviewed_at: new Date().toISOString(), review_note: note })
        .eq("id", id)
        .eq("status", "pending")
        .select("id, username, status, reviewed_at")
        .maybeSingle();
      if (error) throw error;
      if (!data) return json(409, { error: "Account was already reviewed." });
      return json(200, { ok: true, account: data });
    }

    if (row.status !== "approved") {
      return json(400, { error: "Only approved accounts can be revoked." });
    }

    const { data, error } = await supabase
      .from("accounts")
      .update({
        status: "revoked",
        reviewed_at: new Date().toISOString(),
        review_note: note || "Revoked by admin"
      })
      .eq("id", id)
      .eq("status", "approved")
      .select("id, username, status, reviewed_at")
      .maybeSingle();

    if (error) throw error;
    if (!data) return json(409, { error: "Account was already changed." });
    return json(200, { ok: true, account: data });
  } catch (error) {
    console.error(error);
    return json(500, { error: error.message || "Server error." });
  }
};
