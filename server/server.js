import express from 'express';
import chalk from 'chalk';

const app = express();
const port = 3000;

app.listen(port, () => {
    console.log(`Server is running on ${chalk.blue.underline(`http://localhost:${port}`)}`);
});

