import DB from "../connect.js";

async function getTrack(req, res) {
    try {
        const { id } = req.params;
        const trackId = Number(id);

        if (!Number.isInteger(trackId) || trackId <= 0) {
            return res.status(400).json({ error: "Invalid track id." });
        }

        const sql = `
            SELECT id, title, artist, genre_id, duration, release_date, album, language, is_lyrics_available, popularity, tempo, is_explicit, mood, is_favorite, created_at
            FROM tracks
            WHERE id = ?
        `;

        DB.get(sql, [trackId], (err, row) => {
            if (err) {
                console.error("Error fetching track:", err.message);
                return res.status(500).json({ error: "Failed to fetch track." });
            }

            if (!row) {
                return res.status(404).json({ error: "Track not found." });
            }

            const track = {
                ...row,
                is_lyrics_available: Boolean(row.is_lyrics_available),
                is_explicit: Boolean(row.is_explicit),
                is_favorite: Boolean(row.is_favorite)
            };

            return res.status(200).json(track);
        });
    } catch (error) {
        console.error("Error fetching track:", error.message);
        return res.status(500).json({ error: "Failed to fetch track." });
    }
}

export default getTrack;
