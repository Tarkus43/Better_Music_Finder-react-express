import DB from "../connect.js";

async function getGenre(req, res) {
    try {
        const { id } = req.params;
        const genreId = Number(id);

        if (!Number.isInteger(genreId) || genreId <= 0) {
            return res.status(400).json({ error: "Invalid genre id." });
        }

        const sql = "SELECT id, name, description, parent_id FROM genres WHERE id = ?";
        DB.get(sql, [genreId], (err, row) => {
            if (err) {
                console.error("Error fetching genre:", err.message);
                return res.status(500).json({ error: "Failed to fetch genre." });
            }

            if (!row) {
                return res.status(404).json({ error: "Genre not found." });
            }

            return res.status(200).json(row);
        });
    } catch (error) {
        console.error("Error fetching genre:", error.message);
        return res.status(500).json({ error: "Failed to fetch genre." });
    }
}

export default getGenre;
