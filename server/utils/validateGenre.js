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

const validate = ajvInstance.compile(genreSchema);

function validateGenre(data) {
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

export default validateGenre;