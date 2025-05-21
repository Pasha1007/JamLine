import MusicAi from "@music.ai/sdk";

const musicAi = new MusicAi({ apiKey: process.env.MUSIC_AI_API_KEY });
const customSlug = "custom-workflow-slug-jamline";

const separateAudio = async (req, res) => {
  try {
    const { filePath } = req.body;
    if (!filePath) {
      return res.status(400).json({ error: "No file path provided" });
    }
    const result = await separateAudioCore(filePath);
    if (result) {
      res.status(200).json({ result });
    } else {
      res.status(500).json({ error: "Separation job failed" });
    }
  } catch (err) {
    console.error("Separation error:", err);
    res.status(500).json({ error: err.message, details: err.stack || err });
  }
};

const separateAudioCore = async (filePath) => {
  const songUrl = await musicAi.uploadFile(filePath);

  const jobId = await musicAi.addJob(
    "My first job",
    customSlug,
    {
      inputUrl: songUrl,
    }
    // {
    //   copyResultsTo: {
    //     Vocals: "./audio",
    //     Drums: "./audio",
    //     Guitar: "./audio",
    //     Bass: "./audio",
    //   },
    // }
  );

  const job = await musicAi.waitForJobCompletion(jobId);

  let result;
  if (job.status === "SUCCEEDED") {
    const files = await musicAi.downloadJobResults(job, "./chords");
    console.log("Result:", files);
    result = files;
  } else {
    console.log("Job failed!");
    result = null;
  }

  // await musicAi.deleteJob(jobId);
  return result;
};

export default { separateAudio };
