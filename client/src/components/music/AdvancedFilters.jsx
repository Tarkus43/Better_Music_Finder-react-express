const sortOptions = [
  { value: "popularity", label: "Sort: popularity" },
  { value: "title", label: "Sort: title" },
  { value: "release_date", label: "Sort: year" },
  { value: "tempo", label: "Sort: BPM" },
]

const explicitOptions = [
  { value: "any", label: "Explicit: any" },
  { value: "true", label: "Explicit: yes" },
  { value: "false", label: "Explicit: no" },
]

const inputClass = "form-control rounded-3 border-secondary-subtle"
const selectClass = "form-select rounded-3 border-secondary-subtle"

export default function AdvancedFilters({
  filters,
  setFilters,
  onReset,
  genres,
  moodOptions,
  languageOptions,
}) {
  const patch = (partial) => setFilters((d) => ({ ...d, ...partial }))

  return (
    <div className="card mb-4 border-secondary-subtle shadow-sm">
      <div className="card-header bg-white d-flex flex-wrap justify-content-between align-items-center gap-2 py-3 border-secondary-subtle">
        <span className="fw-bold">Advanced Filters</span>
        <button
          type="button"
          className="btn btn-outline-secondary rounded-pill px-3"
          onClick={onReset}
        >
          Reset
        </button>
      </div>
      <div className="card-body pt-3">
        <div className="row g-3 mb-3">
          <div className="col-12 col-sm-6 col-lg-4 col-xl-2">
            <select
              className={selectClass}
              value={filters.genre}
              onChange={(e) => patch({ genre: e.target.value })}
            >
              <option value="">Any genre</option>
              {genres.map((g) => (
                <option key={g.id} value={String(g.id)}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12 col-sm-6 col-lg-4 col-xl-2">
            <input
              type="text"
              className={inputClass}
              placeholder="Artist name"
              value={filters.artist}
              onChange={(e) => patch({ artist: e.target.value })}
            />
          </div>
          <div className="col-6 col-sm-6 col-lg-4 col-xl-2">
            <input
              type="number"
              className={inputClass}
              placeholder="Year from"
              value={filters.yearFrom}
              onChange={(e) => patch({ yearFrom: e.target.value })}
            />
          </div>
          <div className="col-6 col-sm-6 col-lg-4 col-xl-2">
            <input
              type="number"
              className={inputClass}
              placeholder="Year to"
              value={filters.yearTo}
              onChange={(e) => patch({ yearTo: e.target.value })}
            />
          </div>
          <div className="col-6 col-sm-6 col-lg-4 col-xl-2">
            <input
              type="number"
              className={inputClass}
              placeholder="BPM from"
              value={filters.bpmFrom}
              onChange={(e) => patch({ bpmFrom: e.target.value })}
            />
          </div>
          <div className="col-6 col-sm-6 col-lg-4 col-xl-2">
            <input
              type="number"
              className={inputClass}
              placeholder="BPM to"
              value={filters.bpmTo}
              onChange={(e) => patch({ bpmTo: e.target.value })}
            />
          </div>
        </div>
        <div className="row g-3">
          <div className="col-12 col-sm-6 col-md-3">
            <select
              className={selectClass}
              value={filters.mood}
              onChange={(e) => patch({ mood: e.target.value })}
            >
              <option value="">Any mood</option>
              {moodOptions.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <select
              className={selectClass}
              value={filters.language}
              onChange={(e) => patch({ language: e.target.value })}
            >
              <option value="">Any language</option>
              {languageOptions.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <select
              className={selectClass}
              value={filters.sort}
              onChange={(e) => patch({ sort: e.target.value })}
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <select
              className={selectClass}
              value={filters.explicit}
              onChange={(e) => patch({ explicit: e.target.value })}
            >
              {explicitOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
