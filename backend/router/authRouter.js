import { Router } from "express";
import RegistrationController from "../controller/authController.js";
const authRoute = new Router();
authRoute.post("/auth", RegistrationController.authorization);
authRoute.get("/users", RegistrationController.getUsers);

export default authRoute;
