import sqlite3 from 'sqlite3';
const sql3 = sqlite3.verbose();
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

// Resolve __dirname for ESM and point to the server/database.db file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '..', 'database.db');

const connected = (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log(chalk.green('Connected to the SQLite database.'));
    }
};

const DB = new sql3.Database(dbPath, sql3.OPEN_READWRITE | sql3.OPEN_CREATE, connected);

DB.run("PRAGMA foreign_keys = ON" , (err) => {
    if (err) {
        console.error('Error enabling foreign keys:', err.message);
    } else {
        console.log(chalk.green('Foreign key support enabled.'));
    }
});

let sql = `CREATE TABLE IF NOT EXISTS genres (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    parent_id INTEGER,
    CHECK (parent_id IS NULL OR parent_id <> id),
    FOREIGN KEY (parent_id) REFERENCES genres (id) ON DELETE SET NULL
)`;

DB.run(sql, (err) => {
    if (err) {
        console.error('Error creating genres table:', err.message);
    } else {
        console.log('Genres table created or already exists.');
    }
});

sql = `CREATE TABLE IF NOT EXISTS tracks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    genre_id INTEGER,
    duration INTEGER NOT NULL CHECK(duration > 0),
    release_date TEXT NOT NULL,
    album TEXT NOT NULL,
    language TEXT,
    is_lyrics_available INTEGER NOT NULL DEFAULT 0 CHECK(is_lyrics_available IN (0,1)),
    popularity INTEGER NOT NULL DEFAULT 1 CHECK(popularity >= 1),
    tempo INTEGER NOT NULL CHECK(tempo > 0),
    is_explicit INTEGER NOT NULL DEFAULT 0 CHECK(is_explicit IN (0,1)),
    mood TEXT,
    is_favorite INTEGER NOT NULL DEFAULT 0 CHECK(is_favorite IN (0,1)),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (genre_id) REFERENCES genres (id) ON DELETE SET NULL
)`;

DB.run(sql, (err) => {
    if (err) {
        console.error('Error creating tracks table:', err.message);
    } else {
        console.log('Tracks table created or already exists.');
    }
});

export default DB;