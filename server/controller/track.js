import router from "express";
import createTrack from "../orm/tracks/create.js";
import getTracks from "../orm/tracks/get.js";

const trackRouter = router.Router();

trackRouter.post("/", createTrack);
trackRouter.get("/", getTracks);

export default trackRouter;