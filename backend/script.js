import "./loadEnv.js";
import express from "express";
import cors from "cors";
import authRoute from "./router/authRouter.js";
import audioRoute from "./router/audioRouter.js";
import refreshRoute from "./router/refreshRouter.js";
import separateRoute from "./router/separationRouter.js";

import environmentRoute from "./router/environmentRouter.js";
import fileUpload from "express-fileupload";
import path from "path";
import multer from "multer";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 5200;
const APP = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "audio/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
APP.use(cookieParser());
APP.use(express.json());
APP.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
APP.use("/api", authRoute);
APP.use("/api", audioRoute);
APP.use("/api", environmentRoute);
APP.use("/refresh", refreshRoute);
APP.use("/api", separateRoute);
APP.use(fileUpload());
APP.use(
  "/separation_results",
  express.static(path.join(__dirname, "separation_results"))
);
APP.use("/audio", express.static(path.join(__dirname, "audio")));
APP.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
