import router from "express";
import createGenre from "../orm/genre/create.js";
import deleteGenre from "../orm/genre/delete.js";
import updateGenre from "../orm/genre/update.js";
import listGenres from "../orm/genre/list.js";
import getGenre from "../orm/genre/get.js";

const genreRouter = router.Router();

genreRouter.post("/", createGenre);
genreRouter.get("/", listGenres);
genreRouter.get("/:id", getGenre);
genreRouter.put("/:id", updateGenre);
genreRouter.delete("/:id", deleteGenre);

export default genreRouter;