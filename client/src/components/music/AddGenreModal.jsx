import { useState } from "react"
import { createGenre } from "../../api/tracks.js"
import {
  lowercaseTextInput,
  normalizeTextField,
} from "../../utils/formInput.js"
import Modal from "./Modal.jsx"

export default function AddGenreModal({
  show,
  onClose,
  onOpenChange,
  onCreated,
  genres = [],
}) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [parentId, setParentId] = useState("")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSaving(true)
    try {
      const normalizedName = normalizeTextField(name)
      const normalizedDescription = normalizeTextField(description)

      if (!normalizedName || !normalizedDescription) {
        setError("Name and description are required.")
        setSaving(false)
        return
      }

      await createGenre({
        name: normalizedName,
        description: normalizedDescription,
        parent_id: parentId ? Number.parseInt(parentId, 10) : null,
      })
      setName("")
      setDescription("")
      setParentId("")
      await onCreated?.()
      closeModal()
    } catch (err) {
      const msg =
        err.errors?.map((x) => x.message).join("; ") || err.message || "Failed"
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal show={show} onClose={closeModal} title="Add genre">
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
              onChange={onTextChange(setName)}
              placeholder="e.g. indie_rock"
              required
              pattern="[a-z0-9\s_\-]+"
              title="Lowercase letters, numbers, spaces, hyphens, underscores"
            />
            <div className="form-text text-muted">
              Lowercase letters, numbers, spaces, hyphens, underscores.
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="genre-parent" className="form-label">
              Parent genre
            </label>
            <select
              id="genre-parent"
              className="form-select"
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
            >
              <option value="">None (top-level)</option>
              {genres.map((g) => (
                <option key={g.id} value={String(g.id)}>
                  {g.name}
                </option>
              ))}
            </select>
            <div className="form-text text-muted">
              Optional. Choose a parent to nest this genre under it.
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
              onChange={onTextChange(setDescription)}
              placeholder="Short description"
              required
            />
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
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving…" : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  )
}
