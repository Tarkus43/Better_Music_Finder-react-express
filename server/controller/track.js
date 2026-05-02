import router from "express";
import createTrack from "../dao/tracks/create.js";
import getTracks from "../dao/tracks/list.js";
import getTrack from "../dao/tracks/get.js";
import toggleTrack from "../dao/tracks/toggle.js";
import deleteTrack from "../dao/tracks/delete.js";

const trackRouter = router.Router();

trackRouter.post("/", createTrack);
trackRouter.get("/", getTracks);
trackRouter.get("/:id", getTrack);
trackRouter.post("/:id/favorite", toggleTrack);
trackRouter.delete("/:id", deleteTrack);
export default trackRouter;