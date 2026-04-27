import DB from "../connect.js";

const createGenre = (genreData, callback) => {
    const { name, description, parent_id } = genreData;

    if (!name || !description) {
        return callback(new Error('Name and description are required fields.'));
    }

    const sql = `INSERT INTO genres (name, description, parent_id) VALUES (?, ?, ?)`;
    DB.run(sql, [name, description, parent_id], function(err) {
        if (err) {
            console.error('Error creating genre:', err.message);
            return callback(err);
        }
        console.log(`Genre created with ID: ${this.lastID}`);
        callback(null, { id: this.lastID, name, description, parent_id });
    });
};

export default createGenre;