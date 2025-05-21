import { Router } from "express";
import multer from "multer";
import path from "path";
import jwtverify from "../middleware/jwtverify.js";
import { uploadAudio, getUserAudio } from "../controller/audioController.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "audio/");
  },
  filename: (req, file, cb) => {
    const uniqueFilename = Date.now() + path.extname(file.originalname);
    console.log("Uploaded File Name:", uniqueFilename);
    cb(null, uniqueFilename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "audio/wav",
    "audio/x-wav",
    "audio/wave",
    "audio/x-pn-wav",
    "audio/mpeg",
    "audio/mp3",
    "audio/webm",
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const audio = multer({
  storage: storage,
  fileFilter: fileFilter,
});

const audioRoute = new Router();
audioRoute.post("/upload", jwtverify, audio.single("audio"), uploadAudio);
audioRoute.get("/audio", jwtverify, getUserAudio);

export default audioRoute;
