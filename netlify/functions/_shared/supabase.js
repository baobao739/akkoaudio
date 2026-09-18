const { createClient } = require("@supabase/supabase-js");

function clean(v) {
  let s = String(v == null ? "" : v).trim();
  // Netlify paste sometimes wraps in quotes or adds newlines
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }
  s = s.replace(/\r|\n/g, "").trim();
  return s;
}

function getUrl() {
  return clean(
    process.env.SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.SUPABASE_PROJECT_URL ||
      ""
  ).replace(/\/$/, "");
}

function getServiceKey() {
  return clean(
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_KEY ||
      process.env.SUPABASE_SECRET_KEY ||
      process.env.SUPABASE_KEY ||
      process.env.SERVICE_ROLE_KEY ||
      ""
  );
}

function diagnose() {
  const url = getUrl();
  const key = getServiceKey();
  const issues = [];

  if (!url) {
    issues.push("SUPABASE_URL is missing in Netlify env");
  } else if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url)) {
    issues.push(
      "SUPABASE_URL should look like https://xxxx.supabase.co (no path, no quotes)"
    );
  }

  if (!key) {
    issues.push(
      "SUPABASE_SERVICE_ROLE_KEY is missing — paste the service_role secret from Supabase → Settings → API"
    );
  } else if (key.length < 40) {
    issues.push("API key is too short — you probably copied the wrong value");
  } else if (/^sb_publishable_/i.test(key) || /^sb_anon_/i.test(key)) {
    issues.push("That is a publishable/anon key — use service_role (secret) instead");
  } else if (!key.startsWith("eyJ") && !/^sb_secret_/i.test(key)) {
    issues.push(
      "Key does not look like a service_role JWT (usually starts with eyJ) — re-copy service_role from Supabase"
    );
  }

  return { url, key, issues, ok: issues.length === 0 };
}

function db() {
  const { url, key, issues } = diagnose();
  if (issues.length) {
    const err = new Error(issues.join(" | "));
    err.code = "SUPABASE_CONFIG";
    throw err;
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      headers: { "X-Client-Info": "akkomusic-netlify" }
    }
  });
}

module.exports = { db, diagnose, getUrl, getServiceKey, clean };
