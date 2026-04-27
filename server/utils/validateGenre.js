import ajv from "ajv";

const ajvInstance = new ajv();

const genreSchema = {
    type: "object",
    properties: {
        name: { type: "string" },
        description: { type: "string" },
        parent_id: { type: ["integer", "null"] }
    },
    required: ["name", "description"],
    additionalProperties: false
};

const validateGenre = ajvInstance.compile(genreSchema);

export default validateGenre;