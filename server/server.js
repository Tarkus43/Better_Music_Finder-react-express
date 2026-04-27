import express from 'express';
import chalk from 'chalk';
import genreRouter from "./controller/genre.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use("/genres", genreRouter);

app.listen(port, () => {
    console.log(`Server is running on ${chalk.blue.underline(`http://localhost:${port}`)}`);
});

