const DIGIT_NAV_KEYS = new Set([
  "Backspace",
  "Delete",
  "Tab",
  "Escape",
  "Enter",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Home",
  "End",
])

/** Strip separators and non-digits; e.g. "100,000" → "100000". */
export function sanitizeDigitsOnly(raw) {
  return String(raw ?? "").replace(/[^\d]/g, "")
}

/** Block letter/symbol keys; paste still sanitized via onChange. */
export function blockNonDigitKeys(e) {
  if (e.ctrlKey || e.metaKey || e.altKey) return
  if (DIGIT_NAV_KEYS.has(e.key)) return
  if (/^\d$/.test(e.key)) return
  e.preventDefault()
}

/** True when value is a non-empty string of digits only. */
export function isDigitsOnly(value) {
  const s = String(value ?? "")
  return s.length > 0 && /^\d+$/.test(s)
}

const RELEASE_YEAR_MIN = 1
const RELEASE_YEAR_MAX_DIGITS = 4

/**
 * @param {string|number} value
 * @param {{ label?: string }} [opts]
 * @returns {{ ok: true, value: string } | { ok: false, error: string }}
 */
export function validateReleaseYear(value, opts = {}) {
  const { label = "Release year" } = opts
  const digits = sanitizeDigitsOnly(value)
  const currentYear = new Date().getFullYear()

  if (!isDigitsOnly(digits) || digits.length > RELEASE_YEAR_MAX_DIGITS) {
    return {
      ok: false,
      error: `${label} must be 1–${RELEASE_YEAR_MAX_DIGITS} digits (${RELEASE_YEAR_MIN}–${currentYear}).`,
    }
  }

  const year = Number.parseInt(digits, 10)
  if (year < RELEASE_YEAR_MIN) {
    return { ok: false, error: `${label} must be at least ${RELEASE_YEAR_MIN}.` }
  }
  if (year > currentYear) {
    return {
      ok: false,
      error: `${label} cannot be in the future (max ${currentYear}).`,
    }
  }

  return { ok: true, value: String(year) }
}

/**
 * @param {string|number} value
 * @param {{ label?: string, min?: number, max?: number, allowEmpty?: boolean }} [opts]
 * @returns {{ ok: true, value: number } | { ok: false, error: string }}
 */
export function parseIntegerField(value, opts = {}) {
  const { label = "Value", min, max, allowEmpty = false } = opts
  const digits = sanitizeDigitsOnly(value)

  if (!digits) {
    if (allowEmpty) return { ok: true, value: NaN }
    return { ok: false, error: `${label} must be a whole number.` }
  }

  if (!/^\d+$/.test(digits)) {
    return { ok: false, error: `${label} must contain digits only (no letters or symbols).` }
  }

  const n = Number(digits)
  if (!Number.isFinite(n)) {
    return { ok: false, error: `${label} is not a valid number.` }
  }
  if (min != null && n < min) {
    return { ok: false, error: `${label} must be at least ${min}.` }
  }
  if (max != null && n > max) {
    return { ok: false, error: `${label} must be at most ${max}.` }
  }

  return { ok: true, value: n }
}

/** Lowercase only — keeps internal and trailing spaces while typing. */
export function lowercaseTextInput(raw) {
  return String(raw ?? "").toLowerCase()
}

/** Trim edges and lowercase — use on submit. */
export function normalizeTextField(raw) {
  return lowercaseTextInput(raw).trim()
}
