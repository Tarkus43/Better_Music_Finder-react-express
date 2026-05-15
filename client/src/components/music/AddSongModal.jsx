import { useEffect, useState } from "react"
import { createTrack } from "../../api/tracks.js"
import Modal from "./Modal.jsx"

export default function AddSongModal({ show, onClose, genres, onCreated }) {
  const [title, setTitle] = useState("")
  const [artist, setArtist] = useState("")
  const [genreId, setGenreId] = useState("")
  const [album, setAlbum] = useState("single")
  const [year, setYear] = useState("2020")
  const [duration, setDuration] = useState(200)
  const [language, setLanguage] = useState("english")
  const [mood, setMood] = useState("happy")
  const [tempo, setTempo] = useState(100)
  const [popularity, setPopularity] = useState(50)
  const [isExplicit, setIsExplicit] = useState(false)
  const [lyricsAvailable, setLyricsAvailable] = useState(true)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (show && genres.length && !genreId) {
      setGenreId(String(genres[0].id))
    }
  }, [show, genres, genreId])

  const handleClose = () => {
    setError("")
    onClose()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSaving(true)
    try {
      const y = String(year).trim()
      if (!/^(19|20)\d{2}$/.test(y)) {
        setError("Year must be a four-digit year (1900–2099).")
        setSaving(false)
        return
      }
      await createTrack({
        title: title.trim(),
        artist: artist.trim(),
        genre_id: Number.parseInt(genreId, 10),
        duration: Number(duration),
        release_date: y,
        album: album.trim(),
        language: language.trim(),
        is_lyrics_available: lyricsAvailable,
        popularity: Number(popularity),
        tempo: Number(tempo),
        is_explicit: isExplicit,
        mood: mood.trim(),
        is_favorite: false,
      })
      await onCreated?.()
      setTitle("")
      setArtist("")
      setAlbum("single")
      setYear("2020")
      setDuration(200)
      setLanguage("english")
      setMood("happy")
      setTempo(100)
      setPopularity(50)
      setIsExplicit(false)
      setLyricsAvailable(true)
      handleClose()
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
    <Modal show={show} onClose={handleClose} title="Add song" size="lg">
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
                onChange={(e) => setTitle(e.target.value)}
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
                onChange={(e) => setArtist(e.target.value)}
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
                onChange={(e) => setYear(e.target.value)}
                required
                maxLength={4}
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
                onChange={(e) => setAlbum(e.target.value)}
                required
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="song-duration" className="form-label">
                Duration (seconds)
              </label>
              <input
                id="song-duration"
                type="number"
                className="form-control"
                min={1}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="song-tempo" className="form-label">
                BPM
              </label>
              <input
                id="song-tempo"
                type="number"
                className="form-control"
                min={1}
                value={tempo}
                onChange={(e) => setTempo(e.target.value)}
                required
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="song-popularity" className="form-label">
                Popularity
              </label>
              <input
                id="song-popularity"
                type="number"
                className="form-control"
                min={1}
                value={popularity}
                onChange={(e) => setPopularity(e.target.value)}
                required
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
                onChange={(e) => setLanguage(e.target.value)}
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
                onChange={(e) => setMood(e.target.value)}
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
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleClose}
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
