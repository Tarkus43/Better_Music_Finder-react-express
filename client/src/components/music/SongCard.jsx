function StarIcon({ filled }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 7.1-1.01L12 2z" />
    </svg>
  )
}

function formatYear(releaseDate) {
  if (releaseDate == null || releaseDate === "") return "—"
  const s = String(releaseDate)
  const y = Number.parseInt(s.slice(0, 4), 10)
  return Number.isFinite(y) ? y : s
}

function formatBpm(tempo) {
  if (tempo == null || tempo === "") return "— BPM"
  const n = Number(tempo)
  return Number.isFinite(n) ? `${n} BPM` : "— BPM"
}

export default function SongCard({
  track,
  genreName,
  favoriteBusy,
  onToggleFavorite,
}) {
  const { title, artist, release_date, tempo, mood, language, is_favorite } =
    track
  const year = formatYear(release_date)
  const bpmLabel = formatBpm(tempo)
  const genreLabel = genreName || "—"
  const moodLabel = mood || "—"
  const langLabel = language || "—"
  const fav = Boolean(is_favorite)

  return (
    <div className="card mb-3 border-secondary-subtle shadow-sm">
      <div className="card-body d-flex justify-content-between align-items-start gap-3">
        <div className="min-w-0">
          <h3 className="h5 card-title mb-2">{title}</h3>
          <p className="text-muted small mb-2">
            {artist} &middot; {year} &middot; {bpmLabel}
          </p>
          <div className="d-flex flex-wrap gap-2">
            <span className="badge rounded-pill border border-secondary-subtle text-secondary fw-normal text-capitalize">
              {genreLabel}
            </span>
            <span className="badge rounded-pill border border-secondary-subtle text-secondary fw-normal text-capitalize">
              {moodLabel}
            </span>
            <span className="badge rounded-pill border border-secondary-subtle text-secondary fw-normal text-capitalize">
              {langLabel}
            </span>
          </div>
        </div>
        <button
          type="button"
          className={`btn rounded-3 flex-shrink-0 px-2 py-2 ${
            fav
              ? "btn-outline-warning text-warning border-warning"
              : "btn-outline-secondary"
          }`}
          aria-pressed={fav}
          aria-label={fav ? "Remove from favorites" : "Add to favorites"}
          disabled={favoriteBusy}
          onClick={onToggleFavorite}
        >
          <StarIcon filled={fav} />
        </button>
      </div>
    </div>
  )
}
