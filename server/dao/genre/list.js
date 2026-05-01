import DB from "../connect.js";

async function listGenres(req, res) {
    try {
        const sql = `SELECT id, name, description, parent_id FROM genres`;
        DB.all(sql, [], (err, rows) => {
            if (err) {
                console.error('Error fetching genres:', err.message);
                res.status(500).json({ error: 'Failed to fetch genres.' });
                return;
            }
            res.json(rows);
        });
    } catch (error) {
        console.error('Error fetching genres:', error.message);
        res.status(500).json({ error: 'Failed to fetch genres.' });
    }
}

export default listGenres;