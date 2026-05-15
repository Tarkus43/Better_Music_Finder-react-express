// Same-origin requests; Vite dev server proxies /tracks and /genres to Express.

async function parseJsonResponse(res) {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export async function fetchTracks(query = {}) {
  const qs = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue
    qs.append(key, String(value))
  }
  const qstr = qs.toString()
  const suffix = qstr ? `?${qstr}` : ""
  const res = await fetch(`/tracks${suffix}`)
  const body = await parseJsonResponse(res)
  if (!res.ok) {
    const msg =
      (body && typeof body === "object" && (body.error || body.message)) ||
      res.statusText
    const err = new Error(typeof msg === "string" ? msg : "Request failed")
    if (body && typeof body === "object" && Array.isArray(body.errors)) {
      err.errors = body.errors
    }
    throw err
  }
  return body
}

export async function fetchGenres() {
  const res = await fetch("/genres")
  const body = await parseJsonResponse(res)
  if (!res.ok) {
    const msg =
      (body && typeof body === "object" && (body.error || body.message)) ||
      res.statusText
    throw new Error(typeof msg === "string" ? msg : "Request failed")
  }
  return body
}

export async function toggleTrackFavorite(id) {
  const res = await fetch(`/tracks/${id}/favorite`, { method: "PATCH" })
  const body = await parseJsonResponse(res)
  if (!res.ok) {
    const msg =
      (body && typeof body === "object" && (body.error || body.message)) ||
      res.statusText
    throw new Error(typeof msg === "string" ? msg : "Request failed")
  }
  return body
}

export async function createTrack(payload) {
  const res = await fetch("/tracks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  const body = await parseJsonResponse(res)
  if (!res.ok) {
    const err = new Error(
      (body && typeof body === "object" && (body.error || body.message)) ||
        res.statusText,
    )
    if (body && typeof body === "object" && Array.isArray(body.errors)) {
      err.errors = body.errors
    }
    throw err
  }
  return body
}

export async function createGenre(payload) {
  const res = await fetch("/genres", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  const body = await parseJsonResponse(res)
  if (!res.ok) {
    const err = new Error(
      (body && typeof body === "object" && (body.error || body.message)) ||
        res.statusText,
    )
    if (body && typeof body === "object" && Array.isArray(body.errors)) {
      err.errors = body.errors
    }
    throw err
  }
  return body
}
