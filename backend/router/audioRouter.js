import { Router } from "express";
import jwtverify from "../middleware/jwtverify.js";
import {
  audio,
  uploadAudio,
  getUserAudio,
} from "../controller/audioController.js";

const audioRoute = new Router();
audioRoute.post("/upload", jwtverify, audio.single("audio"), uploadAudio);
audioRoute.get("/audio", jwtverify, getUserAudio);

export default audioRoute;
