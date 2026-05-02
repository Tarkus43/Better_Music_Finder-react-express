const ALLOWED_SORT_COLUMNS = new Set([
    "id",
    "title",
    "artist",
    "genre_id",
    "duration",
    "release_date",
    "album",
    "language",
    "is_lyrics_available",
    "popularity",
    "tempo",
    "is_explicit",
    "mood",
    "is_favorite",
    "created_at"
]);

function toInteger(value) {
    if (value === undefined || value === null || value === "") return null;
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? null : parsed;
}

function normalizeText(value) {
    if (value === undefined || value === null) return null;
    const normalized = String(value).trim();
    return normalized.length ? normalized : null;
}

function parseBooleanFilter(value) {
    if (value === undefined || value === null || value === "" || String(value).toLowerCase() === "any") {
        return { value: null, error: null };
    }

    const normalized = String(value).toLowerCase();
    if (normalized === "1" || normalized === "true") return { value: 1, error: null };
    if (normalized === "0" || normalized === "false") return { value: 0, error: null };
    return { value: null, error: "explicit must be one of: any, true, false, 1, 0." };
}

function buildTrackFilterQuery(query) {
    const whereClauses = [];
    const params = [];
    const errors = [];

    // Search bar: only by track name/title.
    const searchValue = normalizeText(query.search ?? query.q ?? query.name ?? query.title);
    if (searchValue) {
        whereClauses.push("title LIKE ?");
        params.push(`%${searchValue}%`);
    }

    // Advanced filters panel.
    const genreId = toInteger(query.genre_id ?? query.genre);
    if (query.genre_id !== undefined || query.genre !== undefined) {
        if (genreId === null) errors.push("genre_id must be an integer.");
        else {
            whereClauses.push("genre_id = ?");
            params.push(genreId);
        }
    }

    const artistName = normalizeText(query.artist_name ?? query.artist);
    if (artistName) {
        whereClauses.push("artist LIKE ?");
        params.push(`%${artistName}%`);
    }

    const language = normalizeText(query.language);
    if (language) {
        whereClauses.push("language = ?");
        params.push(language);
    }

    const mood = normalizeText(query.mood);
    if (mood) {
        whereClauses.push("mood = ?");
        params.push(mood);
    }

    const { value: explicitValue, error: explicitError } = parseBooleanFilter(query.explicit ?? query.is_explicit);
    if (explicitError) errors.push(explicitError);
    if (explicitValue !== null) {
        whereClauses.push("is_explicit = ?");
        params.push(explicitValue);
    }

    const yearFrom = toInteger(query.year_from ?? query.min_year);
    if (query.year_from !== undefined || query.min_year !== undefined) {
        if (yearFrom === null) errors.push("year_from must be an integer.");
        else {
            whereClauses.push("CAST(release_date AS INTEGER) >= ?");
            params.push(yearFrom);
        }
    }

    const yearTo = toInteger(query.year_to ?? query.max_year);
    if (query.year_to !== undefined || query.max_year !== undefined) {
        if (yearTo === null) errors.push("year_to must be an integer.");
        else {
            whereClauses.push("CAST(release_date AS INTEGER) <= ?");
            params.push(yearTo);
        }
    }

    const bpmFrom = toInteger(query.bpm_from ?? query.min_tempo);
    if (query.bpm_from !== undefined || query.min_tempo !== undefined) {
        if (bpmFrom === null) errors.push("bpm_from must be an integer.");
        else {
            whereClauses.push("tempo >= ?");
            params.push(bpmFrom);
        }
    }

    const bpmTo = toInteger(query.bpm_to ?? query.max_tempo);
    if (query.bpm_to !== undefined || query.max_tempo !== undefined) {
        if (bpmTo === null) errors.push("bpm_to must be an integer.");
        else {
            whereClauses.push("tempo <= ?");
            params.push(bpmTo);
        }
    }

    if (yearFrom !== null && yearTo !== null && yearFrom > yearTo) {
        errors.push("year_from cannot be greater than year_to.");
    }
    if (bpmFrom !== null && bpmTo !== null && bpmFrom > bpmTo) {
        errors.push("bpm_from cannot be greater than bpm_to.");
    }

    const requestedSort = query.sort ?? query.sorted_by;
    const sortBy = requestedSort && ALLOWED_SORT_COLUMNS.has(requestedSort)
        ? requestedSort
        : "popularity";
    const sortOrder = String(query.sort_order || "asc").toLowerCase() === "desc" ? "DESC" : "ASC";

    return {
        whereSql: whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "",
        params,
        sortBy,
        sortOrder,/