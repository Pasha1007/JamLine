import { Router } from "express";
import EnvController from "../controller/environmentController.js";
import jwtverify from "../middleware/jwtverify.js";

const environmentRoute = new Router();
environmentRoute.post("/environment", jwtverify, EnvController.createEnv);
environmentRoute.get("/environment", jwtverify, EnvController.getMyEnvs);
environmentRoute.delete(
  "/environment/:id?",
  jwtverify,
  EnvController.deleteEnv
);
environmentRoute.get("/environment/:id?", jwtverify, EnvController.getEnvById);

export default environmentRoute;
