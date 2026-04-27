import Ajv from "ajv";

const ajvInstance = new Ajv({ allErrors: true });

const genreSchema = {
    type: "object",
    properties: {
        name: { type: "string", pattern: "^[a-z0-9\\s_\\-]+$", minLength: 1 },
        description: { type: "string" },
        parent_id: { type: ["integer", "null"] }
    },
    required: ["name", "description"],
    additionalProperties: false
};

const validateGenre = ajvInstance.compile(genreSchema);

export default validateGenre;