const Router = require("express");
const EnvController = require("../controller/environmentController");
const jwtverify = require("../middleware/jwtverify");

const environmentRoute = new Router();
environmentRoute.post("/environment", jwtverify, EnvController.createEnv);
environmentRoute.get("/environment", jwtverify, EnvController.getMyEnvs);
environmentRoute.delete(
  "/environment/:id?",
  jwtverify,
  EnvController.deleteEnv
);
environmentRoute.get("/environment/:id?", jwtverify, EnvController.getEnvById);

module.exports = environmentRoute;
