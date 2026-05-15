import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"
import Col from "react-bootstrap/Col"
import Form from "react-bootstrap/Form"
import Row from "react-bootstrap/Row"

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

export default function AdvancedFilters({
  draft,
  setDraft,
  onApply,
  onReset,
  genres,
  moodOptions,
  languageOptions,
}) {
  const patch = (partial) => setDraft((d) => ({ ...d, ...partial }))

  return (
    <Card className="mb-4 border-secondary-subtle shadow-sm">
      <Card.Header className="bg-white d-flex flex-wrap justify-content-between align-items-center gap-2 py-3 border-secondary-subtle">
        <span className="fw-bold">Advanced Filters</span>
        <div className="d-flex gap-2">
          <Button
            type="button"
            variant="primary"
            className="rounded-pill px-3"
            onClick={onApply}
          >
            Apply
          </Button>
          <Button
            type="button"
            variant="outline-secondary"
            className="rounded-pill px-3"
            onClick={onReset}
          >
            Reset
          </Button>
        </div>
      </Card.Header>
      <Card.Body className="pt-3">
        <Row className="g-3 mb-3">
          <Col xs={12} sm={6} lg={4} xl={2}>
            <Form.Select
              className="rounded-3 border-secondary-subtle"
              value={draft.genre}
              onChange={(e) => patch({ genre: e.target.value })}
            >
              <option value="">Any genre</option>
              {genres.map((g) => (
                <option key={g.id} value={String(g.id)}>
                  {g.name}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col xs={12} sm={6} lg={4} xl={2}>
            <Form.Control
              className="rounded-3 border-secondary-subtle"
              placeholder="Artist name"
              value={draft.artist}
              onChange={(e) => patch({ artist: e.target.value })}
            />
          </Col>
          <Col xs={6} sm={6} lg={4} xl={2}>
            <Form.Control
              className="rounded-3 border-secondary-subtle"
              type="number"
              placeholder="Year from"
              value={draft.yearFrom}
              onChange={(e) => patch({ yearFrom: e.target.value })}
            />
          </Col>
          <Col xs={6} sm={6} lg={4} xl={2}>
            <Form.Control
              className="rounded-3 border-secondary-subtle"
              type="number"
              placeholder="Year to"
              value={draft.yearTo}
              onChange={(e) => patch({ yearTo: e.target.value })}
            />
          </Col>
          <Col xs={6} sm={6} lg={4} xl={2}>
            <Form.Control
              className="rounded-3 border-secondary-subtle"
              type="number"
              placeholder="BPM from"
              value={draft.bpmFrom}
              onChange={(e) => patch({ bpmFrom: e.target.value })}
            />
          </Col>
          <Col xs={6} sm={6} lg={4} xl={2}>
            <Form.Control
              className="rounded-3 border-secondary-subtle"
              type="number"
              placeholder="BPM to"
              value={draft.bpmTo}
              onChange={(e) => patch({ bpmTo: e.target.value })}
            />
          </Col>
        </Row>
        <Row className="g-3">
          <Col xs={12} sm={6} md={3}>
            <Form.Select
              className="rounded-3 border-secondary-subtle"
              value={draft.mood}
              onChange={(e) => patch({ mood: e.target.value })}
            >
              <option value="">Any mood</option>
              {moodOptions.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col xs={12} sm={6} md={3}>
            <Form.Select
              className="rounded-3 border-secondary-subtle"
              value={draft.language}
              onChange={(e) => patch({ language: e.target.value })}
            >
              <option value="">Any language</option>
              {languageOptions.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col xs={12} sm={6} md={3}>
            <Form.Select
              className="rounded-3 border-secondary-subtle"
              value={draft.sort}
              onChange={(e) => patch({ sort: e.target.value })}
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col xs={12} sm={6} md={3}>
            <Form.Select
              className="rounded-3 border-secondary-subtle"
              value={draft.explicit}
              onChange={(e) => patch({ explicit: e.target.value })}
            >
              {explicitOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}
