import React, { useEffect, useState } from "react";
import WaveSurferPlayer from "../components/waveSurferPlayer";
import { FileUploader } from "react-drag-drop-files";
import { AppButton } from "../components/atoms/AppButton";
import { separateFile, getSeparatedFiles } from "../services/separatorService";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "motion/react";
import { IconLogout } from "../components/icons/IconLogout";

const SeparatePage = () => {
  const fileTypes = ["WAV", "MP3"];
  const [separatedFiles, setSeparatedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const handleChange = (file) => {
    startFileSeparation(file);
  };

  const handleDemoFile = async () => {
    const demoFile = await fetch("/demoAudio.wav").then((res) => res.blob());
    startFileSeparation(
      new File([demoFile], "demoAudio.wav", { type: demoFile.type })
    );
  };

  const startFileSeparation = async (file) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("audio", file);
      await separateFile(formData);
      toast.success("File separated successfully!");
      await getSeparations();
    } catch (error) {
      toast.error("Error while separating file");
    } finally {
      setLoading(false);
    }
  };

  const getSeparations = async () => {
    try {
      const response = await getSeparatedFiles();
      setSeparatedFiles(response);
    } catch (error) {
      toast.error("Error while fetching separated files");
    }
  };

  const handleTrackChange = (e) => {
    setCurrentTrackIndex(Number(e.target.value));
  };

  useEffect(() => {
    getSeparations();
  }, []);

  return (
    <div className="w-screen">
      <div className="w-screen px-8">
        {separatedFiles.length > 0 && (
          <div>
            <div className="flex items-center gap-4 mb-6 mt-20">
              <span className="ibm-lg">Select track:</span>
              <select
                className="border px-2 py-1 text-white focus:outline-none "
                value={currentTrackIndex}
                onChange={handleTrackChange}
              >
                {separatedFiles.map((item, idx) => (
                  <option key={item.job_id} value={idx}>
                    {item.name}
                  </option>
                ))}
              </select>
              <div className="ml-4">
                <FileUploader
                  handleChange={handleChange}
                  name="file"
                  types={fileTypes}
                  children={<AppButton>Upload new file</AppButton>}
                />
              </div>
              {loading && (
                <div className="ibm-md-secondary ml-4 flex items-center gap-4">
                  Separating file, please wait...
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-red-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
            <div className="app-card flex-row! items-center gap-8 justify-between mt-8 mb-12">
              <div className="tektur-lg ">Uploaded track:</div>
              <div className="flex-grow">
                <WaveSurferPlayer
                  path={separatedFiles[currentTrackIndex].track_path}
                  height={50}
                />
              </div>
            </div>
            <div className="pb-2">
              <span className="ibm-lg">Your stems:</span>
            </div>
            <div className="app-card mb-8">
              <div className="flex flex-col gap-12">
                {Object.entries(separatedFiles[currentTrackIndex].result).map(
                  ([stemName, stemUrl]) => (
                    <div
                      key={stemName}
                      className="flex flex-row items-center gap-8 justify-between "
                    >
                      <div className="tektur-lg w-24">{stemName}:</div>
                      <div className="flex-grow flex gap-4">
                        <WaveSurferPlayer path={stemUrl} height={50} />
                        <AppButton
                          onClick={() => {
                            const link = document.createElement("a");
                            link.href = stemUrl;
                            link.download = `${stemName}.wav`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                        >
                          <div className="-rotate-90">
                            <IconLogout />
                          </div>
                        </AppButton>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}
        {separatedFiles.length === 0 && !loading ? (
          <AnimatePresence key="motion-dnd">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-screen flex justify-center"
            >
              <div className="app-card w-1/3 h-fit items-center gap-12 ">
                <div className="tektur-xl text-center px-12">
                  Upload your favorite{" "}
                  <span className="text-[#FF4C02]">song</span> to create a
                  backing <span className="text-[#FF4C02]">track</span>
                </div>
                <FileUploader
                  handleChange={handleChange}
                  name="file"
                  types={fileTypes}
                  children={
                    <div className="flex flex-col items-center gap-2 border-dashed border-2 border-[#FF4C02] rounded-md p-8">
                      <div className="ibm-lg">
                        Drag and drop your .wav or .mp3 file here
                      </div>
                      {/* <AppButton>Select a file</AppButton> */}
                    </div>
                  }
                />
                <AppButton onClick={handleDemoFile}>
                  Request a demo file
                </AppButton>
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="w-screen flex justify-center">
            {" "}
            {separatedFiles.length === 0 && loading && (
              <div className="tektur-lg flex items-center gap-4">
                Separating file, please wait...
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-red-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SeparatePage;
