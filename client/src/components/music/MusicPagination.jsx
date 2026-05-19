function ChevronIcon({ direction }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {direction === "left" ? (
        <path d="M15 18l-6-6 6-6" />
      ) : (
        <path d="M9 18l6-6-6-6" />
      )}
    </svg>
  )
}

export default function MusicPagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav
      aria-label="Search results pages"
      className="music-pagination mt-4 pt-3 border-top border-secondary-subtle"
    >
      <p className="text-muted small text-center mb-3">
        Page {currentPage} of {totalPages}
      </p>
      <ul className="music-pagination__list list-unstyled d-flex flex-wrap align-items-center justify-content-center gap-2 mb-0">
        <li>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm rounded-pill d-inline-flex align-items-center gap-1 px-3"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <ChevronIcon direction="left" />
            <span className="d-none d-sm-inline">Previous</span>
          </button>
        </li>
        {pages.map((page) => {
          const isActive = page === currentPage
          return (
            <li key={page}>
              <button
                type="button"
                className={`btn btn-sm rounded-pill music-pagination__page ${
                  isActive
                    ? "btn-primary"
                    : "btn-outline-secondary"
                }`}
                onClick={() => onPageChange(page)}
                aria-current={isActive ? "page" : undefined}
                aria-label={`Page ${page}`}
              >
                {page}
              </button>
            </li>
          )
        })}
        <li>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm rounded-pill d-inline-flex align-items-center gap-1 px-3"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <span className="d-none d-sm-inline">Next</span>
            <ChevronIcon direction="right" />
          </button>
        </li>
      </ul>
    </nav>
  )
}
