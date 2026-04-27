import DB from "../connect.js";
import validateGenre from "../../utils/validateGenre.js";

async function createGenre(req, res) {
    try {
        const { name, description, parent_id } = req.body;

        const isValid = validateGenre(req.body);
        if (!isValid) {
            return res.status(400).json({ error: 'Invalid genre data.' });
        }

    if (!name || !description) {
        return res.status(400).json({ error: 'Name and description are required fields.' });
    }

    const sql = `INSERT INTO genres (name, description, parent_id) VALUES (?, ?, ?)`;
    DB.run(sql, [name, description, parent_id], function(err) {
        if (err) {
            console.error('Error creating genre:', err.message);
            res.status(500).json({ error: 'Failed to create genre.' });
            return;
        }
        console.log(`Genre created with ID: ${this.lastID}`);
        res.status(201).json({ id: this.lastID, name, description, parent_id });
    });
    } catch (error) {
        console.error('Error creating genre:', error.message);
        res.status(500).json({ error: 'Failed to create genre.' });
    }
}

export default createGenre;