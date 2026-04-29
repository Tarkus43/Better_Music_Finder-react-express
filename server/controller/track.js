import router from "express";
import createTrack from "../orm/tracks/create.js";

const trackRouter = router.Router();

trackRouter.post("/", createTrack);

export default trackRouter;