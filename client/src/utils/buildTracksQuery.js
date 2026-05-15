/**
 * Build query object for GET /tracks (server/utils/buildTrackFilterQuery.js).
 */
export function buildTracksQuery(mainSearch, filters) {
  const q = {}

  const search = String(mainSearch ?? "").trim()
  if (search) q.search = search

  const genreId = String(filters.genre ?? "").trim()
  if (genreId) q.genre_id = genreId

  const artist = String(filters.artist ?? "").trim()
  if (artist) q.artist_name = artist

  const yf = String(filters.yearFrom ?? "").trim()
  if (yf) q.year_from = yf
  const yt = String(filters.yearTo ?? "").trim()
  if (yt) q.year_to = yt

  const bf = String(filters.bpmFrom ?? "").trim()
  if (bf) q.bpm_from = bf
  const bt = String(filters.bpmTo ?? "").trim()
  if (bt) q.bpm_to = bt

  const mood = String(filters.mood ?? "").trim()
  if (mood) q.mood = mood

  const language = String(filters.language ?? "").trim()
  if (language) q.language = language

  const ex = String(filters.explicit ?? "any").toLowerCase()
  if (ex && ex !== "any") q.explicit = ex === "true" ? "true" : "false"

  const sort = String(filters.sort ?? "popularity").trim()
  if (sort) q.sort = sort

  const ascSorts = new Set(["title", "artist", "release_date", "album", "language", "mood"])
  q.sort_order = ascSorts.has(sort) ? "asc" : "desc"

  return q
}
