import DB from "../connect.js";

async function deleteTrack(req, res) {
    try {
        const { id } = req.params;
        const trackId = Number(id);

        if (!Number.isInteger(trackId) || trackId <= 0) {
            return res.status(400).json({ error: "Invalid track id." });
        }

        const sql = "DELETE FROM tracks WHERE id = ?";
        DB.run(sql, [trackId], function(err) {
            if (err) {
                console.error("Error deleting track:", err.message);
                return res.status(500).json({ error: "Failed to delete track." });
            }

            if (this.changes === 0) {
                return res.status(404).json({ error: "Track not found." });
            }

            return res.status(200).json({ message: "Track deleted successfully." });
        });
    } catch (error) {
        console.error("Error deleting track:", error.message);
        return res.status(500).json({ error: "Failed to delete track." });
    }
}

export default deleteTrack;
