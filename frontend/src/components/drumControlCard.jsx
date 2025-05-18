import React from "react";
import { drumSettings } from "../global/drumSettings";
const DrumControlCard = ({ title, children }) => {
  const noteMap = {
    kick: 36,
    snare: 38,
    "hi-hat": 46,
    "tom 1": 48,
    "tom 2": 45,
    "tom 3": 43,
    crash: 49,
  };

  const note = noteMap[title.toLowerCase()];

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    drumSettings[note].volume = val;
  };
  const handlePanChange = (e) => {
    const val = parseFloat(e.target.value);
    drumSettings[note].pan = val;
  };
  return (
    <div className="tektur-lg text-center flex flex-col bg-[#141415] border border-[#272828] rounded-[15px] p-2 py-4 gap-10 items-center justify-center w-[200px]">
      <h2 className="ibm-md-secondary uppercase text-[#FF4C02]!">{title}</h2>
      {children}
      <div className="flex justify-around w-full">
        <div className="flex flex-col items-center">
          <input
            type="range"
            min="0"
            max="2"
            step="0.01"
            defaultValue="1"
            onChange={handleVolumeChange}
          ></input>
          <span className="ibm-md-secondary">Vol</span>
        </div>
        <div className="flex flex-col items-center">
          <input
            type="range"
            min="-1"
            max="1"
            step="0.01"
            defaultValue="0"
            onChange={handlePanChange}
          ></input>
          <span className="ibm-md-secondary">Pan</span>
        </div>
      </div>
    </div>
  );
};

export default DrumControlCard;
