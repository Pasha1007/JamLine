const express = require("express");
const cors = require("cors");
const authRouter = require("./router/authRouter");
const audioRouter = require("./router/audioRouter");
const environmentRouter = require("./router/environmentRouter");
const fileUpload = require("express-fileupload");
const path = require("path");
const multer = require("multer");
const cookieParser = require("cookie-parser");
require("dotenv").config();

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
APP.use(cors());
APP.use("/api", authRouter);
APP.use("/api", audioRouter);
APP.use("/api", environmentRouter);
APP.use(fileUpload());
APP.use("/audio", express.static(path.join(__dirname, "audio")));
APP.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
