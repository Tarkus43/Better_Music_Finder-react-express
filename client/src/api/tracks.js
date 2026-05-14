/**
 * Same-origin requests; Vite dev server proxies /tracks and /genres to Express.
 * Query keys must match server/utils/buildTrackFilterQuery.js
 */

async function parseJsonResponse(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/**
 * @param {Record<string, string | number | undefined | null>} query
 * @returns {Promise<any[]>}
 */
export async function fetchTracks(query = {}) {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue;
    qs.append(key, String(value));
  }
  const qstr = qs.toString();
  const suffix = qstr ? `?${qstr}` : "";
  const res = await fetch(`/tracks${suffix}`);
  const body = await parseJsonResponse(res);
  if (!res.ok) {
    const msg =
      (body && typeof body === "object" && (body.error || body.message)) ||
      res.statusText;
    const err = new Error(typeof msg === "string" ? msg : "Request failed");
    if (body && typeof body === "object" && Array.isArray(body.errors)) {
      err.errors = body.errors;
    }
    throw err;
  }
  return body;
}

/**
 * @returns {Promise<any[]>}
 */
export async function fetchGenres() {
  const res = await fetch("/genres");
  const body = await parseJsonResponse(res);
  if (!res.ok) {
    const msg =
      (body && typeof body === "object" && (body.error || body.message)) ||
      res.statusText;
    throw new Error(typeof msg === "string" ? msg : "Request failed");
  }
  return body;
}

/**
 * @param {string | number} id
 * @returns {Promise<any>}
 */
export async function toggleTrackFavorite(id) {
  const res = await fetch(`/tracks/${id}/favorite`, { method: "PATCH" });
  const body = await parseJsonResponse(res);
  if (!res.ok) {
    const msg =
      (body && typeof body === "object" && (body.error || body.message)) ||
      res.statusText;
    throw new Error(typeof msg === "string" ? msg : "Request failed");
  }
  return body;
}
