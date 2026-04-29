import DB from "../connect.js";

async function toggleTrack(req, res) {
    try {
        const { id } = req.params;
        const { is_favorite } = req.body ?? {};

        if (!id || Number.isNaN(Number(id))) {
            return res.status(400).json({
                error: "Invalid track id.",
                details: { provided_id: id },
                hint: "Use a numeric track id in the URL, e.g. /tracks/1/favorite."
            });
        }

        if (is_favorite !== undefined && typeof is_favorite !== "boolean") {
            return res.status(400).json({
                error: "Invalid is_favorite value.",
                details: { provided_is_favorite: is_favorite, expected_type: "boolean" },
                hint: "Send { \"is_favorite\": true } or { \"is_favorite\": false }, or omit it to auto-toggle."
            });
        }

        const findSql = `SELECT id, is_favorite FROM tracks WHERE id = ?`;
        DB.get(findSql, [id], (findErr, track) => {
            if (findErr) {
                console.error("Error finding track:", findErr.message);
                return res.status(500).json({
                    error: "Database error while reading track.",
                    operation: "find_track_for_favorite_toggle",
                    details: findErr.message
                });
            }

            if (!track) {
                return res.status(404).json({
                    error: "Track not found.",
                    details: { id: Number(id) }
                });
            }

            const nextFavorite = typeof is_favorite === "boolean" ? is_favorite : !Boolean(track.is_favorite);
            const updateSql = `UPDATE tracks SET is_favorite = ? WHERE id = ?`;
            DB.run(updateSql, [nextFavorite ? 1 : 0, id], function(updateErr) {
                if (updateErr) {
                    console.error("Error updating favorite status:", updateErr.message);
                    return res.status(500).json({
                        error: "Database error while updating favorite status.",
                        operation: "update_track_favorite_status",
                        details: updateErr.message
                    });
                }

                return res.status(200).json({ id: Number(id), is_favorite: nextFavorite });
            });
        });
    } catch (error) {
        console.error('Error toggling track:', error.message);
        res.status(500).json({
            error: "Unexpected server error while toggling favorite.",
            details: error.message
        });
    }
}

export default toggleTrack;