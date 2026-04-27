import router from "express";
import createGenre from "../orm/genre/create.js";

const genreRouter = router.Router();

genreRouter.post("/", createGenre);

export default genreRouter;