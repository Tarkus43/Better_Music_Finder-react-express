import router from "express";
import createTrack from "../orm/tracks/create.js";
import getTracks from "../orm/tracks/list.js";
import toggleTrack from "../orm/tracks/toggle.js";
import deleteTrack from "../orm/tracks/delete.js";

const trackRouter = router.Router();

trackRouter.post("/", createTrack);
trackRouter.get("/", getTracks);
trackRouter.post("/:id/favorite", toggleTrack);
trackRouter.delete("/:id", deleteTrack);
export default trackRouter;