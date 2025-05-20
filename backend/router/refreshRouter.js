const Router = require("express");
const RefreshController = require("../middleware/jwtrefresh");
const refreshRoute = new Router();
refreshRoute.get("/", RefreshController.refresh);

module.exports = refreshRoute;
