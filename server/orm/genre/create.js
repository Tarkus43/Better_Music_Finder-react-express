import DB from "../connect.js";

async function createGenre(req, res) {
    const { name, description, parent_id } = req.body;

    if (!name || !description) {
        return res.status(400).json({ error: 'Name and description are required fields.' });
    }

    const sql = `INSERT INTO genres (name, description, parent_id) VALUES (?, ?, ?)`;
    DB.run(sql, [name, description, parent_id], function(err) {
        if (err) {
            console.error('Error creating genre:', err.message);
            return callback(err);
        }
        console.log(`Genre created with ID: ${this.lastID}`);
        callback(null, { id: this.lastID, name, description, parent_id });
    });
};

export default createGenre;