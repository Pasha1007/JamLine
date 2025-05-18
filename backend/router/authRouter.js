const Router = require("express");
const RegistrationController = require("../controller/authController");
const RefreshController = require("../middleware/jwtrefresh");
const authRoute = new Router();
authRoute.post("/auth", RegistrationController.authorization);
authRoute.get("/users", RegistrationController.getUsers);
authRoute.post("/refresh-token", RefreshController.refresh);

module.exports = authRoute;
