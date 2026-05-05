import DB from "../connect.js";
import validateTrack from "../../utils/validateTrack.js";

async function updateTrack(req, res) {
    try {
        const { id } = req.params;
        const trackId = Number(id);

        if (!Number.isInteger(trackId) || trackId <= 0) {
            return res.status(400).json({ error: "Invalid track id." });
        }

        const {
            title,
            artist,
            genre_id,
            duration,
            release_date,
            album,
            language,
            is_lyrics_available,
            popularity,
            tempo,
            is_explicit,
            mood,
            is_favorite
        } = req.body ?? {};

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

        const findSql = "SELECT id FROM tracks WHERE id = ?";
        DB.get(findSql, [trackId], (findErr, existingTrack) => {
            if (findErr) {
                console.error("Error finding track:", findErr.message);
                return res.status(500).json({ error: "Failed to update track." });
            }

            if (!existingTrack) {
                return res.status(404).json({ error: "Track not found." });
            }

            const duplicateCheckSql = `
                SELECT id
                FROM tracks
                WHERE lower(title) = lower(?)
                  AND lower(artist) = lower(?)
                  AND lower(album) = lower(?)
                  AND id != ?
                LIMIT 1
            `;

            DB.get(
                duplicateCheckSql,
                [normalizedTitle, normalizedArtist, normalizedAlbum, trackId],
                (checkErr, duplicateTrack) => {
                    if (checkErr) {
                        console.error("Error checking duplicate track:", checkErr.message);
                        return res.status(500).json({ error: "Failed to update track." });
                    }

                    if (duplicateTrack) {
                        return res.status(409).json({ error: "Track with this title, artist, and album already exists." });
                    }

                    const lang = normalizedLanguage ?? null;
                    const lyricsFlag = is_lyrics_available ? 1 : 0;
                    const pop = popularity ?? 1;
                    const t = tempo ?? 120;
                    const explicitFlag = is_explicit ? 1 : 0;
                    const moodVal = normalizedMood ?? null;
                    const favoriteFlag = is_favorite ? 1 : 0;

                    const updateSql = `
                        UPDATE tracks
                        SET title = ?,
                            artist = ?,
                            genre_id = ?,
                            duration = ?,
                            release_date = ?,
                            album = ?,
                            language = ?,
                            is_lyrics_available = ?,
                            popularity = ?,
                            tempo = ?,
                            is_explicit = ?,
                            mood = ?,
                            is_favorite = ?
                        WHERE id = ?
                    `;

                    const params = [
                        normalizedTitle,
                        normalizedArtist,
                        genre_id,
                        duration,
                        normalizedReleaseDate,
                        normalizedAlbum,
                        lang,
                        lyricsFlag,
                        pop,
                        t,
                        explicitFlag,
                        moodVal,
                        favoriteFlag,
                        trackId
                    ];

                    DB.run(updateSql, params, function(updateErr) {
                        if (updateErr) {
                            console.error("Error updating track:", updateErr.message);
                            return res.status(500).json({ error: "Failed to update track.", dbError: updateErr.message });
                        }

                        return res.status(200).json({
                            id: trackId,
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
                            mood: moodVal,
                            is_favorite: Boolean(favoriteFlag)
                        });
                    });
                }
            );
        });
    } catch (error) {
        console.error("Error updating track:", error.message);
        return res.status(500).json({ error: "Failed to update track." });
    }
}

export default updateTrack;
