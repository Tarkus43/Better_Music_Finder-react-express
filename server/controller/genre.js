import router from "express";
import createGenre from "../orm/genre/create.js";
import listGenres from "../orm/genre/list.js";

const genreRouter = router.Router();

genreRouter.post("/", createGenre);
genreRouter.get("/", listGenres);

export default genreRouter;