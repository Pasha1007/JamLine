import { Router } from "express";
import RegistrationController from "../controller/authController.js";
const authRoute = new Router();
authRoute.post("/reg", RegistrationController.register);
authRoute.post("/login", RegistrationController.login);

authRoute.get("/users", RegistrationController.getUsers);

export default authRoute;
