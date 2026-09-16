const { createClient } = require("@supabase/supabase-js");
const {
  requireAdmin,
  json,
  hashPassword,
  normalizeUsername,
  isValidUsername,
  isValidPassword
} = require("./_shared/auth");

function db() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  });
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });

  const auth = await requireAdmin(event);
  if (!auth.ok) return json(401, { error: "Unauthorized" });

  try {
    const body = JSON.parse(event.body || "{}");
    const username = normalizeUsername(body.username);
    const password = String(body.password || "");
    const status =
      String(body.status || "approved").toLowerCase() === "pending" ? "pending" : "approved";

    if (!isValidUsername(username)) {
      return json(400, {
        error: "Username must be 3–32 characters: letters, numbers, underscore only."
      });
    }
    if (!isValidPassword(password)) {
      return json(400, { error: "Password must be 6–128 characters." });
    }

    const password_hash = await hashPassword(password);
    const supabase = db();

    const { data, error } = await supabase
      .from("accounts")
      .insert({
        username,
        password_hash,
        status,
        reviewed_at: status === "approved" ? new Date().toISOString() : null,
        review_note: status === "approved" ? "Created by admin" : null
      })
      .select("id, username, status, created_at")
      .single();

    if (error) {
      if (error.code === "23505") {
        return json(409, { error: "That username is already taken." });
      }
      console.error(error);
      return json(500, { error: "Could not create account." });
    }

    return json(200, {
      ok: true,
      account: data,
      message: "Account created. Give the user their username and password out-of-band."
    });
  } catch (error) {
    console.error(error);
    return json(400, { error: "Invalid request." });
  }
};
