import router from "express";
import createGenre from "../dao/genre/create.js";
import deleteGenre from "../dao/genre/delete.js";
import updateGenre from "../dao/genre/update.js";
import listGenres from "../dao/genre/list.js";
import getGenre from "../dao/genre/get.js";

const genreRouter = router.Router();

genreRouter.post("/", createGenre);
genreRouter.get("/", listGenres);
genreRouter.get("/:id", getGenre);
genreRouter.put("/:id", updateGenre);
genreRouter.delete("/:id", deleteGenre);

export default genreRouter;