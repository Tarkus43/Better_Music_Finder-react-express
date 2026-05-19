export default function Modal({ show, onClose, title, size, children }) {
  if (!show) return null

  const requestClose =
    typeof onClose === "function" ? onClose : () => {}

  const dialogClass =
    size === "lg"
      ? "modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg"
      : "modal-dialog modal-dialog-centered"

  return (
    <>
      <div
        className="modal-backdrop fade show"
        aria-hidden="true"
        onClick={requestClose}
      />
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        onClick={requestClose}
      >
        <div className={dialogClass} onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={requestClose}
              />
            </div>
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
