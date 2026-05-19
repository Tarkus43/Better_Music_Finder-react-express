/** Strip separators and non-digits; e.g. "100,000" → "100000". */
export function sanitizeDigitsOnly(raw) {
  return String(raw ?? "").replace(/[^\d]/g, "")
}

/** True when value is a non-empty string of digits only. */
export function isDigitsOnly(value) {
  const s = String(value ?? "")
  return s.length > 0 && /^\d+$/.test(s)
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
