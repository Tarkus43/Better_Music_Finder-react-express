import DB from "../connect.js";
import buildTrackFilterQuery from "../../utils/buildTrackFilterQuery.js";

async function getTracks(req, res) {
    try {
        const { whereSql, params, sortBy, sortOrder, errors } = buildTrackFilterQuery(req.query);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        const sql = `
            SELECT id, title, artist, genre_id, duration, release_date, album, language, is_lyrics_available, popularity, tempo, is_explicit, mood, is_favorite, created_at
            FROM tracks
            ${whereSql}
            ORDER BY ${sortBy} ${sortOrder}
        `;

        DB.all(sql, params, (err, rows) => {
            if (err) {
                console.error("Error fetching tracks:", err.message);
                return res.status(500).json({ error: "Failed to fetch tracks." });
            }

            const tracks = rows.map((track) => ({
                ...track,
                is_lyrics_available: Boolean(track.is_lyrics_available),
                is_explicit: Boolean(track.is_explicit),
                is_favorite: Boolean(track.is_favorite)
            }));

            return res.json(tracks);
        });
    } catch (error) {
        console.error("Error fetching tracks:", error.message);
        return res.status(500).json({ error: "Failed to fetch tracks." });
    }
}

export default getTracks;
