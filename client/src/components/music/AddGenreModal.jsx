import { useState } from "react"
import Alert from "react-bootstrap/Alert"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Modal from "react-bootstrap/Modal"
import { createGenre } from "../../api/tracks.js"

export default function AddGenreModal({ show, onHide, onCreated }) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  const handleClose = () => {
    setError("")
    onHide()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSaving(true)
    try {
      await createGenre({
        name: name.trim().toLowerCase(),
        description: description.trim().toLowerCase(),
      })
      setName("")
      setDescription("")
      await onCreated?.()
      handleClose()
    } catch (err) {
      const msg =
        err.errors?.map((x) => x.message).join("; ") || err.message || "Failed"
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add genre</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error ? (
            <Alert variant="danger" className="py-2 small">
              {error}
            </Alert>
          ) : null}
          <Form.Group className="mb-3" controlId="genre-name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. indie_rock"
              required
              pattern="[a-z0-9\s_\-]+"
              title="Lowercase letters, numbers, spaces, hyphens, underscores"
            />
            <Form.Text className="text-muted">
              Server accepts lowercase letters, numbers, spaces, hyphens, underscores.
            </Form.Text>
          </Form.Group>
          <Form.Group controlId="genre-desc">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description"
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={saving}>
            {saving ? "Saving…" : "Create"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
