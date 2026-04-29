import DB from "../connect";
import validateTrack from "../../utils/validateTrack";

async function createSong(req, res){
    try {
        const { title, artist, genre_id, duration, release_date, album, language, is_lyrics_available, popularity, tempo, is_explicit, mood } = req.body;
        const isValid = validateTrack(req.body);
        if (!isValid) {
            return res.status(400).json({ error: 'Invalid track data.' });
        }

        if (!title || !artist || !genre_id || !duration || !release_date || !album || !language || !is_lyrics_available || !popularity || !tempo || !is_explicit || !mood) {
            return res.status(400).json({ error: 'Title, artist, genre_id, duration, release_date, album, language, is_lyrics_available, popularity, tempo, is_explicit, and mood are required fields.' });
        }

        const sql = `INSERT INTO tracks (title, artist, genre_id, duration, release_date, album, language, is_lyrics_available, popularity, tempo, is_explicit, mood) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        DB.run(sql, [title, artist, genre_id, duration, release_date, album, language || null, is_lyrics_available || 0, popularity || 1, tempo || 120, is_explicit || 0, mood || null], function(err) {
            if (err) {
                console.error('Error creating track:', err.message);
                res.status(500).json({ error: 'Failed to create track.' });
                return;
            }
            console.log(`Track created with ID: ${this.lastID}`);
            res.status(201).json({ id: this.lastID, title, artist, genre_id, duration, release_date, album, language, is_lyrics_available, popularity, tempo, is_explicit, mood });
        });
    } catch (error) {
        console.error('Error creating track:', error.message);
        res.status(500).json({ error: 'Failed to create track.' });
    }
}

export default createSong