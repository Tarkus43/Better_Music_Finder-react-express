import DB from "../connect.js";
import validateGenre from "../../utils/validateGenre.js";

async function createGenre(req, res) {
    try {
        const { name, description, parent_id } = req.body;

        const { valid, errors } = validateGenre(req.body);
        if (!valid) {
            return res.status(400).json({ errors });
        }

        if (!name || !description) {
            return res.status(400).json({ error: 'Name and description are required fields.' });
        }

        const sql = `INSERT INTO genres (name, description, parent_id) VALUES (?, ?, ?)`;
        const pid = parent_id ?? null;
        DB.run(sql, [name, description, pid], function(err) {
            if (err) {
                console.error('Error creating genre:', err.message);
                return res.status(500).json({ error: 'Failed to create genre.', dbError: err.message });
            }
            console.log(`Genre created with ID: ${this.lastID}`);
            return res.status(201).json({ id: this.lastID, name, description, parent_id: pid });
        });
    } catch (error) {
        console.error('Error creating genre:', error.message);
        res.status(500).json({ error: 'Failed to create genre.' });
    }
}

export default createGenre;