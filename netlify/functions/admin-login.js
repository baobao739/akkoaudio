const { makeToken, cookie, json, ADMIN_SESSION_SECONDS } = require("./_shared/auth");

const attempts = new Map();
const WINDOW_MS = 15 * 60 * 1000;
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
    const expected = String(process.env.ADMIN_PASSWORD || "").trim();
    const sessionSecret = String(process.env.SESSION_SECRET || "").trim();

    if (!expected.length) {
      await sleep(FAIL_DELAY_MS);
      return json(500, {
        ok: false,
        error: "ADMIN_PASSWORD is not set on this Netlify site. Add it under Environment variables and redeploy."
      });
    }

    if (!sessionSecret.length) {
      await sleep(FAIL_DELAY_MS);
      return json(500, {
        ok: false,
        error: "SESSION_SECRET is not set on this Netlify site. Add a random string and redeploy."
      });
    }

    const ok = safeEqual(supplied, expected);

    if (!ok) {
      bucket.fails += 1;
      attempts.set(key, bucket);
      await sleep(FAIL_DELAY_MS + Math.floor(Math.random() * 200));
      return json(401, { ok: false, error: "Incorrect password." });
    }

    attempts.delete(key);

    const token = await makeToken("admin");
    return json(
      200,
      { ok: true },
      {
        "Set-Cookie": cookie("akkomusic_admin", token, ADMIN_SESSION_SECONDS),
        "Cache-Control": "no-store"
      }
    );
  } catch (error) {
    console.error(error);
    await sleep(FAIL_DELAY_MS);
    return json(400, { ok: false, error: "Invalid request." });
  }
};
