const { createClient } = require("@supabase/supabase-js");
const { requireAdmin, json } = require("./_shared/auth");

function db() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  });
}

function randomCode(len = 8) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  let out = "";
  for (let i = 0; i < len; i++) out += alphabet[bytes[i] % alphabet.length];
  return out;
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });

  const auth = await requireAdmin(event);
  if (!auth.ok) return json(401, { error: "Unauthorized" });

  try {
    const body = JSON.parse(event.body || "{}");
    const label = String(body.label || "").trim().slice(0, 64) || null;
    let max_uses = Number(body.max_uses || 1);
    if (!Number.isFinite(max_uses) || max_uses < 1) max_uses = 1;
    if (max_uses > 500) max_uses = 500;

    let count = Number(body.count || 1);
    if (!Number.isFinite(count) || count < 1) count = 1;
    if (count > 50) count = 50;

    const supabase = db();
    const created = [];

    for (let i = 0; i < count; i++) {
      let code = randomCode(8);
      for (let attempt = 0; attempt < 5; attempt++) {
        const { data, error } = await supabase
          .from("referral_codes")
          .insert({
            code,
            label: label ? (count > 1 ? `${label} #${i + 1}` : label) : null,
            max_uses
          })
          .select("id, code, label, max_uses, use_count, created_at")
          .single();

        if (!error && data) {
          created.push(data);
          break;
        }
        if (error && error.code === "23505") {
          code = randomCode(8);
          continue;
        }
        if (error) {
          console.error(error);
          return json(500, {
            error: "Could not create code. Run supabase-referral.sql in Supabase first."
          });
        }
      }
    }

    return json(200, { ok: true, codes: created });
  } catch (error) {
    console.error(error);
    return json(400, { error: "Invalid request." });
  }
};
