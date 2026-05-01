import DB from "../connect.js";

async function deleteGenre(req, res) {
    try {
        const { id } = req.params;
        const genreId = Number(id);

        if (!Number.isInteger(genreId) || genreId <= 0) {
            return res.status(400).json({ error: "Invalid genre id." });
        }

        const sql = "DELETE FROM genres WHERE id = ?";
        DB.run(sql, [genreId], function(err) {
            if (err) {
                console.error("Error deleting genre:", err.message);
                return res.status(500).json({ error: "Failed to delete genre." });
            }

            if (this.changes === 0) {
                return res.status(404).json({ error: "Genre not found." });
            }

            return res.status(200).json({ message: "Genre deleted successfully." });
        });
    } catch (error) {
        console.error("Error deleting genre:", error.message);
        return res.status(500).json({ error: "Failed to delete genre." });
    }
}

export default deleteGenre;
