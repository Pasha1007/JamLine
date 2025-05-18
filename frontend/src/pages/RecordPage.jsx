import { React, useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  initAudioContext,
  connectMIDI,
  startRecording,
  downloadRecording,
  pauseRecording,
  disconnectMIDI,
} from "../utils/audioContextHandler";
import DrumControlCard from "../components/drumControlCard";
import { IconArrow } from "../components/icons/IconArrow";
import { IconRecordCircle } from "../components/icons/IconRecordCircle";
import { AppButton } from "../components/atoms/AppButton";
import { toast } from "react-toastify";
import { getEnvById } from "../services/enviromentService";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { saveRecord } from "../services/audioService";

const RecordPage = () => {
  const [loading, setLoading] = useState(true);
  const [currentDrumKit, setCurrentDrumKit] = useState(0);
  const drumKits = ["DRUM KIT 1", "DRUM KIT 2"];
  const [isRecording, setIsRecording] = useState(false);
  const [currentEnv, setCurrentEnv] = useState([]);
  const [timer, setTimer] = useState(0);

  const navigate = useNavigate();
  const { id } = useParams();

  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    let interval = null;
    if (isRecording) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const createEnv = async () => {
    setLoading(true);
    try {
      await initAudioContext();
      connectMIDI();
    } catch (error) {
      console.error("Error creating environment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextKit = () => {
    setCurrentDrumKit((prev) => (prev + 1) % drumKits.length);
  };

  const handlePrevKit = () => {
    setCurrentDrumKit((prev) => (prev === 0 ? drumKits.length - 1 : prev - 1));
  };

  const handleStartRecording = () => {
    startRecording();
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    pauseRecording();
    setIsRecording(false);
  };

  const handleDownloadRecording = async (name) => {
    try {
      const file = await downloadRecording(name);
      console.log(file);
      await saveRecord(name, file.blob);
      setTimer(0);
      toast.success("Record downloaded and saved to storage!");
    } catch (err) {
      console.log("Error while downloading record", err);
      toast.error("You haven't recorded anything yet!");
    }
  };

  const fetchEnvironment = async (envId) => {
    try {
      const response = await getEnvById(id);
      setCurrentEnv(response);
      toast.success(`Environment ${response.name} is started`);
    } catch (err) {
      console.log("Cannot get environment", err);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    fetchEnvironment();
    createEnv();
    return () => {
      disconnectMIDI();
    };
  }, []);

  return (
    <div className="w-screen h-screen flex justify-center px-24 py-32">
      <div className="w-[90%] flex flex-col gap-12 justify-between">
        <div className="flex gap-12">
          <div className="app-card relative tektur-lg text-center flex items-center justify-center w-[300px] h-[300px]">
            <motion.div
              key={currentDrumKit}
              className="relative tektur-lg text-center flex items-center justify-center w-[300px] h-[300px]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.2 }}
              transition={{ duration: 0.5 }}
            >
              {drumKits[currentDrumKit]}
            </motion.div>
            <div className="absolute flex w-full justify-between bottom-0">
              <button
                className="h-12 w-24 flex items-center justify-center ibm-md cursor-pointer group hover:text-[#FF4C02]"
                onClick={handlePrevKit}
              >
                <div className="mr-2 group-hover:text-[#FF4C02] transition-all duration-200">
                  <IconArrow />
                </div>
                Prev
              </button>
              <button
                className="h-12 w-24 flex items-center justify-center ibm-md cursor-pointer group"
                onClick={handleNextKit}
              >
                Next
                <div className="ml-2 -scale-x-100 group-hover:text-[#FF4C02] transition-all duration-200">
                  <IconArrow />
                </div>
              </button>
            </div>
          </div>
          <div className="flex flex-col justify-between flex-grow">
            <div className="flex justify-between">
              <div className="ibm-md-secondary">
                Environment name:{" "}
                <span className="tektur-lg">{currentEnv.name}</span>
              </div>
              <div
                className="flex gap-2 items-center tektur-md cursor-pointer hover:text-[#FF4C02]! transition-all duration-200 uppercase"
                onClick={() => navigate("/")}
              >
                <span> exit </span>
                <div className="-scale-x-100 ">
                  <IconArrow />
                </div>
              </div>
            </div>
            <div className="flex justify-between gap-4">
              <div className="flex gap-4 items-center">
                {!isRecording ? (
                  <AppButton onClick={handleStartRecording}>
                    Start recording
                  </AppButton>
                ) : (
                  <AppButton onClick={handleStopRecording}>
                    Stop recording
                  </AppButton>
                )}

                <div className="text-[#565656] flex gap-2">
                  <div className={`${isRecording ? "animate-recording" : ""}`}>
                    <IconRecordCircle />
                  </div>
                  <div className={`${isRecording ? "text-[#ff4c02]" : ""}`}>
                    {formatTimer(timer)}
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <AppButton onClick={createEnv}>Save settings</AppButton>
                <AppButton
                  onClick={() => handleDownloadRecording(currentEnv.name)}
                >
                  Download my record
                </AppButton>
              </div>
            </div>
            <div className="app-card p-0! rounded-none! h-24 w-full flex items-center justify-center tektur-md text-[#FF4C02]!">
              <canvas id="audioCanvas"></canvas>
            </div>
          </div>
        </div>
        <div className="flex gap-4 w-full ">
          <DrumControlCard title={"snare"} />
          <DrumControlCard title={"kick"} />
          <DrumControlCard title={"tom 1"} />
          <DrumControlCard title={"tom 2"} />
          <DrumControlCard title={"tom 3"} />
          <DrumControlCard title={"hi-hat"} />
          <DrumControlCard title={"crash"} />
        </div>
      </div>
    </div>
  );
};

export default RecordPage;
