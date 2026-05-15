import { useCallback, useEffect, useMemo, useState } from "react"
import {
  fetchGenres,
  fetchTracks,
  toggleTrackFavorite,
} from "../../api/tracks.js"
import { buildTracksQuery } from "../../utils/buildTracksQuery.js"
import AddGenreModal from "./AddGenreModal.jsx"
import AddSongModal from "./AddSongModal.jsx"
import AdvancedFilters from "./AdvancedFilters.jsx"
import SongCard from "./SongCard.jsx"

const defaultFilters = {
  genre: "",
  artist: "",
  yearFrom: "",
  yearTo: "",
  bpmFrom: "",
  bpmTo: "",
  mood: "",
  language: "",
  sort: "popularity",
  explicit: "any",
}

function SearchStarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className="text-secondary"
      aria-hidden
    >
      <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 7.1-1.01L12 2z" />
    </svg>
  )
}

export default function MusicSearchPage() {
  const [searchInput, setSearchInput] = useState("")
  const [committedSearch, setCommittedSearch] = useState("")
  const [filters, setFilters] = useState(defaultFilters)
  const [committedFilters, setCommittedFilters] = useState(defaultFilters)
  const [showAdvanced, setShowAdvanced] = useState(true)
  const [genres, setGenres] = useState([])
  const [moodOptions, setMoodOptions] = useState([])
  const [languageOptions, setLanguageOptions] = useState([])
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(false)
  const [listError, setListError] = useState("")
  const [filterErrors, setFilterErrors] = useState([])
  const [metaError, setMetaError] = useState("")
  const [favoriteBusyId, setFavoriteBusyId] = useState(null)
  const [showGenreModal, setShowGenreModal] = useState(false)
  const [showSongModal, setShowSongModal] = useState(false)

  const genreNameById = useMemo(() => {
    const m = {}
    for (const g of genres) {
      m[String(g.id)] = g.name
    }
    return m
  }, [genres])

  const fetchTrackList = useCallback(async (searchStr, filterState) => {
    setLoading(true)
    setListError("")
    setFilterErrors([])
    try {
      const query = buildTracksQuery(searchStr, filterState)
      const list = await fetchTracks(query)
      setTracks(Array.isArray(list) ? list : [])
    } catch (e) {
      setTracks([])
      if (e.errors) setFilterErrors(e.errors)
      else setListError(e.message || "Failed to load tracks.")
    } finally {
      setLoading(false)
    }
  }, [])

  const reloadGenresAndMeta = useCallback(async () => {
    try {
      const g = await fetchGenres()
      setGenres(Array.isArray(g) ? g : [])
      setMetaError("")
    } catch {
      setGenres([])
      setMetaError("Could not refresh genres.")
    }
    try {
      const all = await fetchTracks({})
      const moods = [...new Set(all.map((t) => t.mood).filter(Boolean))].sort()
      const langs = [...new Set(all.map((t) => t.language).filter(Boolean))].sort()
      setMoodOptions(moods)
      setLanguageOptions(langs)
    } catch {
      setMoodOptions([])
      setLanguageOptions([])
    }
  }, [])

  useEffect(() => {
    void reloadGenresAndMeta()
  }, [reloadGenresAndMeta])

  useEffect(() => {
    void fetchTrackList(committedSearch, committedFilters)
  }, [committedSearch, committedFilters, fetchTrackList])

  const handleSearchClick = () => {
    setCommittedSearch(searchInput.trim())
    setCommittedFilters({ ...filters })
  }

  const handleResetFilters = () => {
    setFilters({ ...defaultFilters })
  }

  const handleToggleFavorite = async (id) => {
    setFavoriteBusyId(id)
    setListError("")
    try {
      const res = await toggleTrackFavorite(id)
      setTracks((prev) =>
        prev.map((t) =>
          String(t.id) === String(res.id)
            ? { ...t, is_favorite: res.is_favorite }
            : t,
        ),
      )
    } catch (e) {
      setListError(e.message || "Could not update favorite.")
    } finally {
      setFavoriteBusyId(null)
    }
  }

  return (
    <div className="bg-body-secondary min-vh-100 py-4">
      <div className="container">
        <div className="border border-secondary-subtle rounded-4 bg-white p-3 p-md-4 shadow-sm">
          {metaError ? (
            <div className="alert alert-warning py-2 small" role="alert">
              {metaError}
            </div>
          ) : null}
          {listError ? (
            <div className="alert alert-danger py-2 small" role="alert">
              {listError}
            </div>
          ) : null}
          {filterErrors.length ? (
            <div className="alert alert-danger py-2 small" role="alert">
              <ul className="mb-0 ps-3">
                {filterErrors.map((err, i) => (
                  <li key={`${i}-${err}`}>{err}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="d-flex flex-column flex-md-row gap-2 mb-3">
            <div className="position-relative flex-grow-1">
              <span
                className="position-absolute top-50 start-0 translate-middle-y ps-3 d-flex align-items-center"
                style={{ zIndex: 1 }}
              >
                <SearchStarIcon />
              </span>
              <input
                type="text"
                className="form-control rounded-pill border-secondary-subtle py-2 ps-5"
                placeholder="Search by title (e.g. giant steps)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleSearchClick()
                  }
                }}
                aria-label="Search songs"
              />
            </div>
            <button
              type="button"
              className="btn btn-primary rounded-pill px-4 align-self-stretch"
              disabled={loading}
              onClick={handleSearchClick}
            >
              Search
            </button>
          </div>

          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <div className="d-flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary rounded-pill"
                onClick={() => setShowSongModal(true)}
              >
                Add song
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary rounded-pill"
                onClick={() => setShowGenreModal(true)}
              >
                Add genre
              </button>
            </div>
            <button
              type="button"
              className="btn btn-primary rounded-pill"
              aria-expanded={showAdvanced}
              aria-controls="advanced-filters-panel"
              onClick={() => setShowAdvanced((v) => !v)}
            >
              Filters
            </button>
          </div>

          {showAdvanced ? (
            <div id="advanced-filters-panel">
              <AdvancedFilters
                filters={filters}
                setFilters={setFilters}
                onReset={handleResetFilters}
                genres={genres}
                moodOptions={moodOptions}
                languageOptions={languageOptions}
              />
            </div>
          ) : null}

          <div className="d-flex flex-wrap justify-content-between align-items-baseline gap-2 mb-3">
            <h2 className="h5 fw-bold mb-0">Search Results</h2>
            <span className="text-muted small">
              {loading ? "…" : `${tracks.length} results`}
            </span>
          </div>

          {loading && !tracks.length ? (
            <p className="text-muted small">Loading…</p>
          ) : null}

          {!loading && !listError && tracks.length === 0 ? (
            <p className="text-muted small">
              {committedSearch.trim()
                ? "No tracks match your search. Try another title or clear the search box and click Search."
                : "No tracks in the database yet. Add a genre, then add a song."}
            </p>
          ) : null}

          {tracks.map((track) => (
            <SongCard
              key={track.id}
              track={track}
              genreName={genreNameById[String(track.genre_id)]}
              favoriteBusy={
                favoriteBusyId != null &&
                String(favoriteBusyId) === String(track.id)
              }
              onToggleFavorite={() => handleToggleFavorite(track.id)}
            />
          ))}
        </div>
      </div>

      <AddGenreModal
        show={showGenreModal}
        onOpenChange={setShowGenreModal}
        onCreated={reloadGenresAndMeta}
      />
      <AddSongModal
        show={showSongModal}
        onOpenChange={setShowSongModal}
        genres={genres}
        onCreated={async () => {
          await reloadGenresAndMeta()
          await fetchTrackList(committedSearch, committedFilters)
        }}
      />
    </div>
  )
}
