import { useState } from "react"
import { createGenre } from "../../api/tracks.js"
import Modal from "./Modal.jsx"

export default function AddGenreModal({ show, onClose, onCreated }) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  const handleClose = () => {
    setError("")
    onClose()
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
    <Modal show={show} onClose={handleClose} title="Add genre">
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          {error ? (
            <div className="alert alert-danger py-2 small" role="alert">
              {error}
            </div>
          ) : null}
          <div className="mb-3">
            <label htmlFor="genre-name" className="form-label">
              Name
            </label>
            <input
              id="genre-name"
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. indie_rock"
              required
              pattern="[a-z0-9\s_\-]+"
              title="Lowercase letters, numbers, spaces, hyphens, underscores"
            />
            <div className="form-text text-muted">
              Lowercase letters, numbers, spaces, hyphens, underscores.
            </div>
          </div>
          <div>
            <label htmlFor="genre-desc" className="form-label">
              Description
            </label>
            <textarea
              id="genre-desc"
              className="form-control"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description"
              required
            />
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
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving…" : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  )
}
