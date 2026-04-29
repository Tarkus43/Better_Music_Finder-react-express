import express from 'express';
import chalk from 'chalk';
import genreRouter from "./controller/genre.js";
import trackRouter from "./controller/track.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use("/tracks", trackRouter);
app.use("/genres", genreRouter);

app.listen(port, () => {
    console.log(`Server is running on ${chalk.blue.underline(`http://localhost:${port}`)}`);
});

