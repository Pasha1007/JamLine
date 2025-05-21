import { Router } from "express";
import SeparationController from "../controller/separationController.js";
const separationRoute = new Router();
separationRoute.post("/separate", SeparationController.separateAudio);

export default separationRoute;
