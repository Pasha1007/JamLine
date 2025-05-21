import { Router } from "express";
import RefreshController from "../middleware/jwtrefresh.js";
const refreshRoute = new Router();
refreshRoute.get("/", RefreshController.refresh);

export default refreshRoute;
