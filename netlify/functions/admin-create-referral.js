const crypto = require("crypto");
const { requireAdmin, json } = require("./_shared/auth");
const { db, diagnose } = require("./_shared/supabase");

function randomCode(len) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.randomBytes(len || 8);
  let out = "";
  for (let i = 0; i < bytes.length; i++) {
    out += alphabet[bytes[i] % alphabet.length];
  }
  return out;
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });

  const auth = await requireAdmin(event);
  if (!auth.ok) return json(401, { error: "Unauthorized — log in to admin again" });

  try {
    const body = JSON.parse(event.body || "{}");
    const label = String(body.label || "").trim().slice(0, 64) || null;
    let max_uses = Number(body.max_uses || 1);
    if (!Number.isFinite(max_uses) || max_uses < 1) max_uses = 1;
    if (max_uses > 500) max_uses = 500;

    let count = Number(body.count || 1);
    if (!Number.isFinite(count) || count < 1) count = 1;
    if (count > 50) count = 50;

    let supabase;
    try {
      supabase = db();
    } catch (e) {
      console.error(e);
      return json(500, {
        error: e.message || "Supabase not configured",
        hint: diagnose().issues
      });
    }

    const created = [];

    for (let i = 0; i < count; i++) {
      let inserted = false;
      for (let attempt = 0; attempt < 8; attempt++) {
        const code = randomCode(8);
        const row = {
          code,
          label: label ? (count > 1 ? label + " #" + (i + 1) : label) : null,
          max_uses,
          use_count: 0
        };

        const { data, error } = await supabase
          .from("referral_codes")
          .insert(row)
          .select("id, code, label, max_uses, use_count, created_at")
          .single();

        if (!error && data) {
          created.push(data);
          inserted = true;
          break;
        }

        if (error && (error.code === "23505" || /duplicate/i.test(String(error.message || "")))) {
          continue;
        }

        console.error("referral insert error", error);
        const msg = error && error.message ? String(error.message) : "unknown";

        if (/invalid api key|invalidjwt|jwt/i.test(msg)) {
          return json(500, {
            error:
              "Invalid API key — in Netlify use SUPABASE_SERVICE_ROLE_KEY = Supabase service_role secret (starts with eyJ). Must match the same project as SUPABASE_URL. Delete the var, re-paste, redeploy."
          });
        }
        if (/relation .* does not exist/i.test(msg) || error.code === "42P01") {
          return json(500, {
            error: "Table referral_codes missing. Run the SQL in Supabase SQL Editor."
          });
        }
        if (/permission denied|rls/i.test(msg)) {
          return json(500, {
            error: "Permission denied — use service_role key, not anon."
          });
        }
        return json(500, { error: "Could not create code: " + msg });
      }

      if (!inserted) {
        return json(500, { error: "Could not create unique code after retries." });
      }
    }

    return json(200, { ok: true, codes: created });
  } catch (error) {
    console.error(error);
    return json(400, {
      error: "Invalid request: " + (error && error.message ? error.message : "")
    });
  }
};
