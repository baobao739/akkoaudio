const { makeToken, cookie, json } = require("./_shared/auth");

// In-memory rate limit (per function instance). Best-effort on Netlify;
// still blocks casual brute force and slows automated guessing.
const attempts = new Map();
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_FAILS = 5;
const FAIL_DELAY_MS = 600;

function clientKey(event) {
  const h = event.headers || {};
  return (
    h["x-nf-client-connection-ip"] ||
    h["x-forwarded-for"]?.split(",")[0]?.trim() ||
    h["client-ip"] ||
    h["x-real-ip"] ||
    "unknown"
  );
}

function getBucket(key) {
  const now = Date.now();
  let b = attempts.get(key);
  if (!b || now - b.start > WINDOW_MS) {
    b = { start: now, fails: 0 };
    attempts.set(key, b);
  }
  return b;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/** Constant-time string compare (avoids timing leaks on password length/content). */
function safeEqual(a, b) {
  const aa = String(a || "");
  const bb = String(b || "");
  const len = Math.max(aa.length, bb.length);
  let diff = aa.length ^ bb.length;
  for (let i = 0; i < len; i++) {
    const ca = i < aa.length ? aa.charCodeAt(i) : 0;
    const cb = i < bb.length ? bb.charCodeAt(i) : 0;
    diff |= ca ^ cb;
  }
  return diff === 0;
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });

  const key = clientKey(event);
  const bucket = getBucket(key);

  if (bucket.fails >= MAX_FAILS) {
    return json(429, {
      ok: false,
      error: "Too many attempts. Try again in a few minutes."
    });
  }

  try {
    const { password } = JSON.parse(event.body || "{}");
    const supplied = String(password || "");
    const expected = String(process.env.ADMIN_PASSWORD || "");

    // Always take a minimum amount of time on failure path
    const ok = expected.length > 0 && safeEqual(supplied, expected);

    if (!ok) {
      bucket.fails += 1;
      attempts.set(key, bucket);
      await sleep(FAIL_DELAY_MS + Math.floor(Math.random() * 200));
      return json(401, { ok: false, error: "Incorrect password." });
    }

    // Success — reset failures for this IP
    attempts.delete(key);

    const token = await makeToken("admin");
    return json(
      200,
      { ok: true },
      {
        "Set-Cookie": cookie("akkoflac_admin", token, 60 * 60 * 12),
        "Cache-Control": "no-store"
      }
    );
  } catch (error) {
    await sleep(FAIL_DELAY_MS);
    return json(400, { ok: false, error: "Invalid request." });
  }
};
