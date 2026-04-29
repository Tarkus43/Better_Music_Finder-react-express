import DB from "../connect.js";
import validateGenre from "../../utils/validateGenre.js";

async function createGenre(req, res) {
    try {
        const { name, description, parent_id } = req.body;
        const normalizedName = typeof name === "string" ? name.trim() : name;

        const { valid, errors } = validateGenre(req.body);
        if (!valid) {
            return res.status(400).json({ errors });
        }

        if (!normalizedName || !description) {
            return res.status(400).json({ error: 'Name and description are required fields.' });
        }

        const duplicateCheckSql = `SELECT id FROM genres WHERE lower(name) = lower(?) LIMIT 1`;
        DB.get(duplicateCheckSql, [normalizedName], (checkErr, existingGenre) => {
            if (checkErr) {
                console.error("Error checking duplicate genre:", checkErr.message);
                return res.status(500).json({ error: "Failed to create genre." });
            }

            if (existingGenre) {
                return res.status(409).json({ error: "Genre with this name already exists." });
            }

            const sql = `INSERT INTO genres (name, description, parent_id) VALUES (?, ?, ?)`;
            const pid = parent_id ?? null;
            DB.run(sql, [normalizedName, description, pid], function(err) {
            if (err) {
                console.error('Error creating genre:', err.message);
                if (err.message?.includes("UNIQUE constraint failed")) {
                    return res.status(409).json({ error: "Genre with this name already exists." });
                }
                return res.status(500).json({ error: 'Failed to create genre.', dbError: err.message });
            }
            console.log(`Genre created with ID: ${this.lastID}`);
            return res.status(201).json({ id: this.lastID, name: normalizedName, description, parent_id: pid });
        });
        });
    } catch (error) {
        console.error('Error creating genre:', error.message);
        res.status(500).json({ error: 'Failed to create genre.' });
    }
}

export default createGenre;