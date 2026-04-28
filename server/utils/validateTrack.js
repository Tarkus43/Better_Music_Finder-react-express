import Ajv from "ajv";

const ajvInstance = new Ajv({ allErrors: true });

const trackSchema = {
    type: "object",
    properties: {
        title: { type: "string", minLength: 1 },
        artist: { type: "string", minLength: 1 },
        genre_id: { type: "integer" },
        duration: { type: "integer", minimum: 0 },
        release_date: { type: "string", format: "date" },
        album: { type: "string" },
        language: { type: "string" },
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

const validateTrack = ajvInstance.compile(trackSchema);

export default validateTrack;