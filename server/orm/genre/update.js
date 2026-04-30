import DB from "../connect.js";
import validateGenre from "../../utils/validateGenre.js";

async function updateGenre(req, res) {
    try {
        const { id } = req.params;
        const genreId = Number(id);

        if (!Number.isInteger(genreId) || genreId <= 0) {
            return res.status(400).json({ error: "Invalid genre id." });
        }

        const { name, description, parent_id } = req.body;
        const normalizedName = typeof name === "string" ? name.trim().toLowerCase() : name;
        const normalizedDescription = typeof description === "string" ? description.trim().toLowerCase() : description;
        const normalizedPayload = {
            ...req.body,
            name: normalizedName,
            description: normalizedDescription
        };

        const { valid, errors } = validateGenre(normalizedPayload);
        if (!valid) {
            return res.status(400).json({ errors });
        }

        if (!normalizedName || !normalizedDescription) {
            return res.status(400).json({ error: "Name and description are required fields." });
        }

        const duplicateCheckSql = "SELECT id FROM genres WHERE lower(name) = lower(?) AND id != ? LIMIT 1";
        DB.get(duplicateCheckSql, [normalizedName, genreId], (checkErr, existingGenre) => {
            if (checkErr) {
                console.error("Error checking duplicate genre:", checkErr.message);
                return res.status(500).json({ error: "Failed to update genre." });
            }

            if (existingGenre) {
                return res.status(409).json({ error: "Genre with this name already exists." });
            }

            const sql = "UPDATE genres SET name = ?, description = ?, parent_id = ? WHERE id = ?";
            const pid = parent_id ?? null;
            DB.run(sql, [normalizedName, normalizedDescription, pid, genreId], function(err) {
                if (err) {
                    console.error("Error updating genre:", err.message);
                    if (err.message?.includes("UNIQUE constraint failed")) {
                        return res.status(409).json({ error: "Genre with this name already exists." });
                    }
                    return res.status(500).json({ error: "Failed to update genre." });
                }

                if (this.changes === 0) {
                    return res.status(404).json({ error: "Genre not found." });
                }

                return res.status(200).json({
                    id: genreId,
                    name: normalizedName,
                    description: normalizedDescription,
                    parent_id: pid
                });
            });
        });
    } catch (error) {
        console.error("Error updating genre:", error.message);
        return res.status(500).json({ error: "Failed to update genre." });
    }
}

export default updateGenre;
