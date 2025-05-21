import React, { useRef } from "react";
import { useWavesurfer } from "@wavesurfer/react";
import pauseIcon from "../assets/icon-pause.png";
import playIcon from "../assets/icon-play.png";

const WaveSurferPlayer = ({ path, height }) => {
  const containerRef = useRef(null);

  const { wavesurfer, isReady, isPlaying } = useWavesurfer({
    container: containerRef,
    url: path,
    waveColor: "#FF4C02",
    progressColor: "#fff",
    height: height,
  });

  const togglePlay = () => {
    if (wavesurfer) wavesurfer.playPause();
  };

  return (
    <div className="flex items-center gap-4 w-full">
      <div onClick={togglePlay} className="w-4 cursor-pointer">
        <img src={isPlaying ? pauseIcon : playIcon} />
      </div>
      <div ref={containerRef} className="min-w-100 w-full" />
    </div>
  );
};

export default WaveSurferPlayer;
