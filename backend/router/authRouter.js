const Router = require("express");
const RegistrationController = require("../controller/authController");
const RefreshController = require("../middleware/jwtrefresh");
const authRoute = new Router();
authRoute.post("/auth", RegistrationController.authorization);
authRoute.get("/users", RegistrationController.getUsers);

module.exports = authRoute;
