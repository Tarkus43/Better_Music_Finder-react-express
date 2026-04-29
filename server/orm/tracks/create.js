import DB from "../connect.js";
import validateTrack from "../../utils/validateTrack.js";

async function createTrack(req, res){
    try {
        const { title, artist, genre_id, duration, release_date, album, language, is_lyrics_available, popularity, tempo, is_explicit, mood } = req.body;
        const normalizeText = (value) => (typeof value === "string" ? value.trim().toLowerCase() : value);
        const normalizedTitle = normalizeText(title);
        const normalizedArtist = normalizeText(artist);
        const normalizedAlbum = normalizeText(album);
        const normalizedReleaseDate = normalizeText(release_date);
        const normalizedLanguage = normalizeText(language);
        const normalizedMood = normalizeText(mood);
        const normalizedPayload = {
            ...req.body,
            title: normalizedTitle,
            artist: normalizedArtist,
            album: normalizedAlbum,
            release_date: normalizedReleaseDate,
            language: normalizedLanguage,
            mood: normalizedMood
        };

        const { valid, errors } = validateTrack(normalizedPayload);
        if (!valid) {
            return res.status(400).json({ errors });
        }

        // Coerce/normalize values for DB
        const lang = normalizedLanguage ?? null;
        const lyricsFlag = is_lyrics_available ? 1 : 0;
        const pop = popularity ?? 1;
        const t = tempo ?? 120;
        const explicitFlag = is_explicit ? 1 : 0;
        const moodVal = normalizedMood ?? null;

        const duplicateCheckSql = `
            SELECT id
            FROM tracks
            WHERE lower(title) = lower(?)
              AND lower(artist) = lower(?)
              AND lower(album) = lower(?)
            LIMIT 1
        `;
        DB.get(duplicateCheckSql, [normalizedTitle, normalizedArtist, normalizedAlbum], (checkErr, existingTrack) => {
            if (checkErr) {
                console.error("Error checking duplicate track:", checkErr.message);
                return res.status(500).json({ error: "Failed to create track." });
            }

            if (existingTrack) {
                return res.status(409).json({ error: "Track with this title, artist, and album already exists." });
            }

            const sql = `INSERT INTO tracks (title, artist, genre_id, duration, release_date, album, language, is_lyrics_available, popularity, tempo, is_explicit, mood) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const params = [normalizedTitle, normalizedArtist, genre_id, duration, normalizedReleaseDate, normalizedAlbum, lang, lyricsFlag, pop, t, explicitFlag, moodVal];

            DB.run(sql, params, function(err) {
                if (err) {
                    console.error('Error creating track:', err.message);
                    return res.status(500).json({ error: 'Failed to create track.', dbError: err.message });
                }
                console.log(`Track created with ID: ${this.lastID}`);
                return res.status(201).json({
                    id: this.lastID,
                    title: normalizedTitle,
                    artist: normalizedArtist,
                    genre_id,
                    duration,
                    release_date: normalizedReleaseDate,
                    album: normalizedAlbum,
                    language: lang,
                    is_lyrics_available: Boolean(lyricsFlag),
                    popularity: pop,
                    tempo: t,
                    is_explicit: Boolean(explicitFlag),
                    mood: moodVal
                });
            });
        });
    } catch (error) {
        console.error('Error creating track:', error.message);
        res.status(500).json({ error: 'Failed to create track.' });
    }
}

export default createTrack;