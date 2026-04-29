import Ajv from "ajv";

const ajvInstance = new Ajv({ allErrors: true });

const trackSchema = {
    type: "object",
    properties: {
        title: { type: "string", minLength: 1 },
        artist: { type: "string", minLength: 1 },
        genre_id: { type: "integer" },
        duration: { type: "integer", minimum: 0 },
        release_date: { type: "string", pattern: "(19|20)\\d{2}$"},
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
    if (valid) return { valid: true, errors: null };

    const errors = (validate.errors || []).map(err => ({
        instancePath: err.instancePath,
        schemaPath: err.schemaPath,
        keyword: err.keyword,
        message: err.message,
        params: err.params
    }));

    return { valid: false, errors };
}

export default validateTrack;