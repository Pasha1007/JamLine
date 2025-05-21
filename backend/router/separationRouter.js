import { Router } from "express";
import SeparationController, {
  upload,
} from "../controller/separationController.js";
import jwtverify from "../middleware/jwtverify.js";

const separationRoute = new Router();
separationRoute.post(
  "/separate",
  jwtverify,
  upload.single("audio"),
  SeparationController.separateAudio
);
separationRoute.get(
  "/separate",
  jwtverify,
  SeparationController.getSeparatedFiles
);

export default separationRoute;
