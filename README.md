# Better Music Finder

> **This is a study project.** It was built for learning purposes to practice full-stack development with React and Express. It is not intended for production use.

Better Music Finder is a small web app for keeping a music library: you can add tracks and genres, search and filter them, sort the results, and mark favorites.

## Tech stack

- **Client:** React 19, Vite, Bootstrap 5
- **Server:** Node.js, Express 5, SQLite (`sqlite3`), Ajv for request validation

## Features

- Add tracks with details: title, artist, genre, album, release year, duration, tempo, popularity, language, mood, explicit/lyrics flags
- Add genres, with an optional parent genre
- Search, advanced filters and sorting
- Pagination
- Mark tracks as favorites
- Input validation on both the client and the server

## Project structure

```
client/   React app (Vite)
  src/api/          API calls to the server
  src/components/   UI components
  src/utils/        query building and form input helpers
server/   Express API
  controller/       routes
  dao/              database access (tracks, genres)
  utils/            validation and query helpers
  database.db       SQLite database
```

## Getting started

Requirements: Node.js 20+ and npm.

Start the server (runs on http://localhost:3000):

```bash
cd server
npm install
npm run server
```

In a second terminal, start the client:

```bash
cd client
npm install
npm run client
```

Open the URL Vite prints (usually http://localhost:5173). The Vite dev server proxies `/tracks` and `/genres` requests to the Express server.

## API

| Method | Path                    | Description            |
| ------ | ----------------------- | ---------------------- |
| GET    | `/tracks`               | List tracks (supports filters, sorting, pagination) |
| GET    | `/tracks/:id`           | Get one track          |
| POST   | `/tracks`               | Create a track         |
| PATCH  | `/tracks/:id`           | Update a track         |
| PATCH  | `/tracks/:id/favorite`  | Toggle favorite        |
| DELETE | `/tracks/:id`           | Delete a track         |
| GET    | `/genres`               | List genres            |
| GET    | `/genres/:id`           | Get one genre          |
| POST   | `/genres`               | Create a genre         |
| PATCH  | `/genres/:id`           | Update a genre         |
| DELETE | `/genres/:id`           | Delete a genre         |
