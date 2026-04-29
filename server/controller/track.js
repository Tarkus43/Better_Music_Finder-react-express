import router from "express";
import createTrack from "../orm/tracks/create.js";
import getTracks from "../orm/tracks/get.js";
import toggleTrack from "../orm/tracks/toggle.js";

const trackRouter = router.Router();

trackRouter.post("/", createTrack);
trackRouter.get("/", getTracks);
trackRouter.post("/:id/favorite", toggleTrack);
export default trackRouter;