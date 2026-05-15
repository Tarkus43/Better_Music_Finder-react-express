import { useEffect, useState } from "react"
import Alert from "react-bootstrap/Alert"
import Button from "react-bootstrap/Button"
import Col from "react-bootstrap/Col"
import Form from "react-bootstrap/Form"
import Modal from "react-bootstrap/Modal"
import Row from "react-bootstrap/Row"
import { createTrack } from "../../api/tracks.js"

export default function AddSongModal({ show, onHide, genres, onCreated }) {
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
    onHide()
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
    <Modal show={show} onHide={handleClose} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Add song</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {!genres.length ? (
            <Alert variant="warning" className="small py-2">
              Add at least one genre before creating a track.
            </Alert>
          ) : null}
          {error ? (
            <Alert variant="danger" className="py-2 small">
              {error}
            </Alert>
          ) : null}
          <Row className="g-3">
            <Col md={6}>
              <Form.Group controlId="song-title">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="song-artist">
                <Form.Label>Artist</Form.Label>
                <Form.Control
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="song-genre">
                <Form.Label>Genre</Form.Label>
                <Form.Select
                  value={genreId}
                  onChange={(e) => setGenreId(e.target.value)}
                  required
                >
                  {genres.map((g) => (
                    <option key={g.id} value={String(g.id)}>
                      {g.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="song-year">
                <Form.Label>Release year</Form.Label>
                <Form.Control
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                  maxLength={4}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="song-album">
                <Form.Label>Album</Form.Label>
                <Form.Control
                  value={album}
                  onChange={(e) => setAlbum(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="song-duration">
                <Form.Label>Duration (seconds)</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="song-tempo">
                <Form.Label>BPM</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  value={tempo}
                  onChange={(e) => setTempo(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="song-popularity">
                <Form.Label>Popularity</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  value={popularity}
                  onChange={(e) => setPopularity(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="song-language">
                <Form.Label>Language</Form.Label>
                <Form.Control
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="song-mood">
                <Form.Label>Mood</Form.Label>
                <Form.Control
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Check
                type="checkbox"
                id="song-explicit"
                label="Explicit"
                checked={isExplicit}
                onChange={(e) => setIsExplicit(e.target.checked)}
              />
              <Form.Check
                type="checkbox"
                id="song-lyrics"
                label="Lyrics available"
                checked={lyricsAvailable}
                onChange={(e) => setLyricsAvailable(e.target.checked)}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={saving || !genres.length}
          >
            {saving ? "Saving…" : "Create"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
