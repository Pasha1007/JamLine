import pool from "../db.js";
import multer from "multer";
import path from "path";

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

const uploadAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No audio file uploaded" });
    }
    const { filename } = req.file;
    const { name } = req.body;
    const user_id = req.user?.id;

    const result = await pool.query(
      "INSERT INTO audio (name, path, user_id) VALUES ($1, $2, $3) RETURNING *",
      [name, filepath, user_id]
    );
    res.status(201).send({
      message: "File uploaded and stored in the database successfully",
      file: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

const getUserAudio = async (req, res) => {
  const user_id = req.user?.id;
  if (!user_id) {
    return res.status(401).json({ error: "Unauthorized: User ID not found" });
  }
  try {
    const result = await pool.query("SELECT * FROM audio WHERE user_id = $1", [
      user_id,
    ]);
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to retrieve environments" });
  }
};

export { audio, uploadAudio, getUserAudio };
