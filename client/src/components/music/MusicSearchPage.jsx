import { useCallback, useEffect, useMemo, useState } from "react"
import Alert from "react-bootstrap/Alert"
import Button from "react-bootstrap/Button"
import Collapse from "react-bootstrap/Collapse"
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
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
  const [searchInput, setSearchInput] = useState("beatles")
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters)
  const [draftFilters, setDraftFilters] = useState(defaultFilters)
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

  const fetchTrackList = useCallback(async (searchStr, applied) => {
    setLoading(true)
    setListError("")
    setFilterErrors([])
    try {
      const query = buildTracksQuery(searchStr, applied)
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
    let cancelled = false

    const boot = async () => {
      try {
        const g = await fetchGenres()
        if (!cancelled) {
          setGenres(Array.isArray(g) ? g : [])
          setMetaError("")
        }
      } catch {
        if (!cancelled) {
          setGenres([])
          setMetaError("Could not load genres.")
        }
      }

      try {
        const all = await fetchTracks({})
        if (!cancelled) {
          const moods = [...new Set(all.map((t) => t.mood).filter(Boolean))].sort()
          const langs = [...new Set(all.map((t) => t.language).filter(Boolean))].sort()
          setMoodOptions(moods)
          setLanguageOptions(langs)
        }
      } catch {
        if (!cancelled) {
          setMoodOptions([])
          setLanguageOptions([])
        }
      }

      if (!cancelled) {
        await fetchTrackList("beatles", defaultFilters)
      }
    }

    void boot()
    return () => {
      cancelled = true
    }
  }, [fetchTrackList])

  const handleSearchClick = () => {
    const q = searchInput.trim()
    void fetchTrackList(q, appliedFilters)
  }

  const handleApply = () => {
    const next = { ...draftFilters }
    setAppliedFilters(next)
    void fetchTrackList(searchInput.trim(), next)
  }

  const handleReset = () => {
    setDraftFilters({ ...defaultFilters })
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
      <Container>
        <div className="border border-secondary-subtle rounded-4 bg-white p-3 p-md-4 shadow-sm">
          {metaError ? (
            <Alert variant="warning" className="py-2 small">
              {metaError}
            </Alert>
          ) : null}
          {listError ? (
            <Alert variant="danger" className="py-2 small">
              {listError}
            </Alert>
          ) : null}
          {filterErrors.length ? (
            <Alert variant="danger" className="py-2 small">
              <ul className="mb-0 ps-3">
                {filterErrors.map((err, i) => (
                  <li key={`${i}-${err}`}>{err}</li>
                ))}
              </ul>
            </Alert>
          ) : null}

          <div className="d-flex flex-column flex-md-row gap-2 mb-3">
            <div className="position-relative flex-grow-1">
              <span
                className="position-absolute top-50 start-0 translate-middle-y ps-3 d-flex align-items-center"
                style={{ zIndex: 1 }}
              >
                <SearchStarIcon />
              </span>
              <Form.Control
                className="rounded-pill border-secondary-subtle py-2 ps-5"
                placeholder="Search songs"
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
            <Button
              type="button"
              variant="primary"
              className="rounded-pill px-4 align-self-stretch"
              disabled={loading}
              onClick={handleSearchClick}
            >
              Search
            </Button>
          </div>

          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <div className="d-flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline-secondary"
                className="rounded-pill"
                onClick={() => setShowSongModal(true)}
              >
                Add song
              </Button>
              <Button
                type="button"
                variant="outline-secondary"
                className="rounded-pill"
                onClick={() => setShowGenreModal(true)}
              >
                Add genre
              </Button>
            </div>
            <Button
              type="button"
              variant="primary"
              className="rounded-pill"
              aria-expanded={showAdvanced}
              aria-controls="advanced-filters-panel"
              onClick={() => setShowAdvanced((v) => !v)}
            >
              Filters
            </Button>
          </div>

          <Collapse in={showAdvanced}>
            <div id="advanced-filters-panel">
              <AdvancedFilters
                draft={draftFilters}
                setDraft={setDraftFilters}
                onApply={handleApply}
                onReset={handleReset}
                genres={genres}
                moodOptions={moodOptions}
                languageOptions={languageOptions}
              />
            </div>
          </Collapse>

          <div className="d-flex flex-wrap justify-content-between align-items-baseline gap-2 mb-3">
            <h2 className="h5 fw-bold mb-0">Search Results</h2>
            <span className="text-muted small">
              {loading ? "…" : `${tracks.length} results`}
            </span>
          </div>

          {loading && !tracks.length ? (
            <p className="text-muted small">Loading…</p>
          ) : null}

          {!loading && tracks.length === 0 ? (
            <p className="text-muted small">No tracks match your search.</p>
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
      </Container>

      <AddGenreModal
        show={showGenreModal}
        onHide={() => setShowGenreModal(false)}
        onCreated={reloadGenresAndMeta}
      />
      <AddSongModal
        show={showSongModal}
        onHide={() => setShowSongModal(false)}
        genres={genres}
        onCreated={async () => {
          await reloadGenresAndMeta()
          await fetchTrackList(searchInput.trim(), appliedFilters)
        }}
      />
    </div>
  )
}
