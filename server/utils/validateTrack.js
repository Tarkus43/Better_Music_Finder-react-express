import Ajv from "ajv";

const ajvInstance = new Ajv({ allErrors: true });

const trackSchema = {
    type: "object",
    properties: {
        title: { type: "string", minLength: 1 },
        artist: { type: "string", minLength: 1 },
        genre_id: { type: "integer" },
        duration: { type: "integer", minimum: 0 },
        release_date: { type: "string", pattern: "^[1-9]\\d{0,3}$" },
        album: { type: "string" },
        language: { type: ["string", "null"] },
        is_lyrics_available: { type: "boolean" },
        popularity: { type: "integer", minimum: 1 },
        tempo: { type: "integer", minimum: 1 },
        is_explicit: { type: "boolean" },
        mood: { type: "string" },
        is_favorite: { type: "boolean" }
    },
    required: ["title", "artist", "genre_id", "duration", "release_date", "album", "language", "is_lyrics_available", "popularity", "tempo", "is_explicit", "mood", "is_favorite"],
    additionalProperties: false
};

const validate = ajvInstance.compile(trackSchema);

function validateTrack(data) {
    const valid = validate(data);
    const errors = [];

    if (!valid) {
        errors.push(...(validate.errors || []).map(err => ({
            instancePath: err.instancePath,
            schemaPath: err.schemaPath,
            keyword: err.keyword,
            message: err.message,
            params: err.params
        })));
    }

    const releaseYear = Number.parseInt(String(data?.release_date ?? ""), 10);
    const currentYear = new Date().getFullYear();
    if (Number.isFinite(releaseYear) && releaseYear > currentYear) {
        errors.push({
            instancePath: "/release_date",
            schemaPath: "#/properties/release_date",
            keyword: "maximum",
            message: `must not be greater than ${currentYear}`,
            params: { comparison: "<=", limit: currentYear }
        });
    }

    if (errors.length === 0) return { valid: true, errors: null };

    return { valid: false, errors };
}

export default validateTrack;