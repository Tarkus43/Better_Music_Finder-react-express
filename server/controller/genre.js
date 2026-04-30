import router from "express";
import createGenre from "../orm/genre/create.js";
import deleteGenre from "../orm/genre/delete.js";
import listGenres from "../orm/genre/list.js";

const genreRouter = router.Router();

genreRouter.post("/", createGenre);
genreRouter.get("/", listGenres);
genreRouter.delete("/:id", deleteGenre);

export default genreRouter;