import { useEffect, useState } from "react"
import { createTrack } from "../../api/tracks.js"
import {
  isDigitsOnly,
  lowercaseTextInput,
  normalizeTextField,
  parseIntegerField,
  sanitizeDigitsOnly,
} from "../../utils/formInput.js"
import Modal from "./Modal.jsx"

export default function AddSongModal({
  show,
  onClose,
  onOpenChange,
  genres,
  onCreated,
}) {
  const [title, setTitle] = useState("")
  const [artist, setArtist] = useState("")
  const [genreId, setGenreId] = useState("")
  const [album, setAlbum] = useState("single")
  const [year, setYear] = useState("2020")
  const [duration, setDuration] = useState("200")
  const [language, setLanguage] = useState("english")
  const [mood, setMood] = useState("happy")
  const [tempo, setTempo] = useState("100")
  const [popularity, setPopularity] = useState("50")
  const [isExplicit, setIsExplicit] = useState(false)
  const [lyricsAvailable, setLyricsAvailable] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (show && genres.length && !genreId) {
      setGenreId(String(genres[0].id))
    }
  }, [show, genres, genreId])

  const closeModal = () => {
    setError("")
    if (typeof onClose === "function") {
      onClose()
    } else if (typeof onOpenChange === "function") {
      onOpenChange(false)
    }
  }

  const onTextChange = (setter) => (e) => {
    setter(lowercaseTextInput(e.target.value))
  }

  const onDigitsChange = (setter) => (e) => {
    setter(sanitizeDigitsOnly(e.target.value))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSaving(true)
    try {
      const normalizedTitle = normalizeTextField(title)
      const normalizedArtist = normalizeTextField(artist)
      const normalizedAlbum = normalizeTextField(album)
      const normalizedLanguage = normalizeTextField(language)
      const normalizedMood = normalizeTextField(mood)

      if (!normalizedTitle || !normalizedArtist || !normalizedAlbum) {
        setError("Title, artist, and album are required.")
        setSaving(false)
        return
      }

      const y = sanitizeDigitsOnly(year)
      if (!isDigitsOnly(y) || !/^(19|20)\d{2}$/.test(y)) {
        setError("Year must be a four-digit year (1900–2099), digits only.")
        setSaving(false)
        return
      }

      const durationResult = parseIntegerField(duration, {
        label: "Duration",
        min: 1,
      })
      if (!durationResult.ok) {
        setError(durationResult.error)
        setSaving(false)
        return
      }

      const tempoResult = parseIntegerField(tempo, { label: "BPM", min: 1 })
      if (!tempoResult.ok) {
        setError(tempoResult.error)
        setSaving(false)
        return
      }

      const popularityResult = parseIntegerField(popularity, {
        label: "Popularity",
        min: 1,
      })
      if (!popularityResult.ok) {
        setError(popularityResult.error)
        setSaving(false)
        return
      }

      await createTrack({
        title: normalizedTitle,
        artist: normalizedArtist,
        genre_id: Number.parseInt(genreId, 10),
        duration: durationResult.value,
        release_date: y,
        album: normalizedAlbum,
        language: normalizedLanguage,
        is_lyrics_available: lyricsAvailable,
        popularity: popularityResult.value,
        tempo: tempoResult.value,
        is_explicit: isExplicit,
        mood: normalizedMood,
        is_favorite: isFavorite,
      })
      await onCreated?.()
      setTitle("")
      setArtist("")
      setAlbum("single")
      setYear("2020")
      setDuration("200")
      setLanguage("english")
      setMood("happy")
      setTempo("100")
      setPopularity("50")
      setIsExplicit(false)
      setLyricsAvailable(true)
      setIsFavorite(false)
      closeModal()
    } catch (err) {
      const msg =
        err.errors?.map((x) => `${x.instancePath} ${x.message}`).join("; ") ||
        err.message ||
        "Failed"
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal show={show} onClose={closeModal} title="Add song" size="lg">
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          {!genres.length ? (
            <div className="alert alert-warning small py-2" role="alert">
              Add at least one genre before creating a track.
            </div>
          ) : null}
          {error ? (
            <div className="alert alert-danger py-2 small" role="alert">
              {error}
            </div>
          ) : null}
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="song-title" className="form-label">
                Title
              </label>
              <input
                id="song-title"
                type="text"
                className="form-control"
                value={title}
                onChange={onTextChange(setTitle)}
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="song-artist" className="form-label">
                Artist
              </label>
              <input
                id="song-artist"
                type="text"
                className="form-control"
                value={artist}
                onChange={onTextChange(setArtist)}
                required
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="song-genre" className="form-label">
                Genre
              </label>
              <select
                id="song-genre"
                className="form-select"
                value={genreId}
                onChange={(e) => setGenreId(e.target.value)}
                required
              >
                {genres.map((g) => (
                  <option key={g.id} value={String(g.id)}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label htmlFor="song-year" className="form-label">
                Release year
              </label>
              <input
                id="song-year"
                type="text"
                className="form-control"
                value={year}
                onChange={onDigitsChange(setYear)}
                required
                maxLength={4}
                inputMode="numeric"
                pattern="\d*"
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="song-album" className="form-label">
                Album
              </label>
              <input
                id="song-album"
                type="text"
                className="form-control"
                value={album}
                onChange={onTextChange(setAlbum)}
                required
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="song-duration" className="form-label">
                Duration (seconds)
              </label>
              <input
                id="song-duration"
                type="text"
                className="form-control"
                value={duration}
                onChange={onDigitsChange(setDuration)}
                required
                inputMode="numeric"
                pattern="\d*"
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="song-tempo" className="form-label">
                BPM
              </label>
              <input
                id="song-tempo"
                type="text"
                className="form-control"
                value={tempo}
                onChange={onDigitsChange(setTempo)}
                required
                inputMode="numeric"
                pattern="\d*"
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="song-popularity" className="form-label">
                Popularity
              </label>
              <input
                id="song-popularity"
                type="text"
                className="form-control"
                value={popularity}
                onChange={onDigitsChange(setPopularity)}
                required
                inputMode="numeric"
                pattern="\d*"
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="song-language" className="form-label">
                Language
              </label>
              <input
                id="song-language"
                type="text"
                className="form-control"
                value={language}
                onChange={onTextChange(setLanguage)}
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="song-mood" className="form-label">
                Mood
              </label>
              <input
                id="song-mood"
                type="text"
                className="form-control"
                value={mood}
                onChange={onTextChange(setMood)}
                required
              />
            </div>
            <div className="col-12">
              <div className="form-check">
                <input
                  id="song-explicit"
                  type="checkbox"
                  className="form-check-input"
                  checked={isExplicit}
                  onChange={(e) => setIsExplicit(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="song-explicit">
                  Explicit
                </label>
              </div>
              <div className="form-check">
                <input
                  id="song-lyrics"
                  type="checkbox"
                  className="form-check-input"
                  checked={lyricsAvailable}
                  onChange={(e) => setLyricsAvailable(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="song-lyrics">
                  Lyrics available
                </label>
              </div>
              <div className="form-check">
                <input
                  id="song-favorite"
                  type="checkbox"
                  className="form-check-input"
                  checked={isFavorite}
                  onChange={(e) => setIsFavorite(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="song-favorite">
                  Favorite
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving || !genres.length}
          >
            {saving ? "Saving…" : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  )
}
