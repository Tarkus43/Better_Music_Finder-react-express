import DB from "../connect.js";
import validateTrack from "../../utils/validateTrack.js";

async function createTrack(req, res){
    try {
        const { title, artist, genre_id, duration, release_date, album, language, is_lyrics_available, popularity, tempo, is_explicit, mood } = req.body;

        const { valid, errors } = validateTrack(req.body);
        if (!valid) {
            return res.status(400).json({ errors });
        }

        // Coerce/normalize values for DB
        const lang = language ?? null;
        const lyricsFlag = is_lyrics_available ? 1 : 0;
        const pop = popularity ?? 1;
        const t = tempo ?? 120;
        const explicitFlag = is_explicit ? 1 : 0;
        const moodVal = mood ?? null;

        const sql = `INSERT INTO tracks (title, artist, genre_id, duration, release_date, album, language, is_lyrics_available, popularity, tempo, is_explicit, mood) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const params = [title, artist, genre_id, duration, release_date, album, lang, lyricsFlag, pop, t, explicitFlag, moodVal];

        DB.run(sql, params, function(err) {
            if (err) {
                console.error('Error creating track:', err.message);
                return res.status(500).json({ error: 'Failed to create track.', dbError: err.message });
            }
            console.log(`Track created with ID: ${this.lastID}`);
            return res.status(201).json({
                id: this.lastID,
                title,
                artist,
                genre_id,
                duration,
                release_date,
                album,
                language: lang,
                is_lyrics_available: Boolean(lyricsFlag),
                popularity: pop,
                tempo: t,
                is_explicit: Boolean(explicitFlag),
                mood: moodVal
            });
        });
    } catch (error) {
        console.error('Error creating track:', error.message);
        res.status(500).json({ error: 'Failed to create track.' });
    }
}

export default createTrack;