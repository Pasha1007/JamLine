import MusicAi from "@music.ai/sdk";
import multer from "multer";
import path from "path";
import fs from "fs";

import pool from "../db.js";

const musicAi = new MusicAi({ apiKey: process.env.MUSIC_AI_API_KEY });
const customSlug = "custom-workflow-slug-jamline";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "audio/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "audio/wav",
    "audio/x-wav",
    "audio/wave",
    "audio/x-pn-wav",
    "audio/mpeg",
    "audio/mp3",
  ];
  const allowedExtensions = [".wav", ".mp3"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only .wav and .mp3 files are allowed!"), false);
  }
};
const upload = multer({ storage, fileFilter });

const separateAudio = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "No audio file uploaded" });

    const { path: filePath, originalname } = req.file;
    const track_path = `http://localhost:5200/${filePath}`;

    const user_id = req.user?.id;
    if (!user_id)
      return res.status(401).json({ error: "Unauthorized: User ID not found" });

    const result = await separateAudioCore(filePath, originalname);
    console.log("Separation result:", result);

    if (!result.success) {
      return res.status(500).json({ error: "Separation job failed" });
    }

    const { jobId, cleanedResult } = result;

    await pool.query(
      `INSERT INTO separate_results (job_id, user_id, name, result, track_path) 
       VALUES ($1, $2, $3, $4, $5)`,
      [jobId, user_id, originalname, JSON.stringify(cleanedResult), track_path]
    );

    res.status(200).json({ result: cleanedResult });
  } catch (err) {
    console.error("Separation error:", err);
    res.status(500).json({ error: err.message, details: err.stack || err });
  }
};

const separateAudioCore = async (filePath, originalname) => {
  const songUrl = await musicAi.uploadFile(filePath);

  const jobId = await musicAi.addJob(
    `${originalname} separation job`,
    customSlug,
    { inputUrl: songUrl }
  );

  const job = await musicAi.waitForJobCompletion(jobId);

  if (job.status !== "SUCCEEDED") {
    console.log("Job failed!");
    await musicAi.deleteJob(jobId);
    return { success: false };
  }

  const jobOutputDir = `./separation_results/${jobId}`;
  const files = await musicAi.downloadJobResults(job, jobOutputDir);
  console.log("Result:", files);
  const baseUrl = "http://localhost:5200";
  const jobOutputUrl = `${baseUrl}/separation_results/${jobId}`;

  const cleanedResult = {
    Bass: `${jobOutputUrl}/Bass.wav`,
    Drums: `${jobOutputUrl}/Drums.wav`,
    Guitar: `${jobOutputUrl}/Guitar.wav`,
    Vocals: `${jobOutputUrl}/Vocals.wav`,
  };

  return {
    success: true,
    jobId,
    cleanedResult,
  };
};

const getSeparatedFiles = async (req, res) => {
  const user_id = req.user?.id;
  if (!user_id)
    return res.status(401).json({ error: "Unauthorized: User ID not found" });

  try {
    const result = await pool.query(
      "SELECT * FROM separate_results WHERE user_id = $1",
      [user_id]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching separated files:", err);
    res.status(500).json({ error: err.message });
  }
};

export { upload };
export default { separateAudio, getSeparatedFiles };
