import { React } from "react";
import { motion } from "motion/react";
import { AppButton } from "../atoms/AppButton";
import { IconNote3 } from "../icons/IconNote3";
import { IconNote4 } from "../icons/IconNote4";
const IntroModal = ({ toggleModal }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="w-[100vw] flex justify-center"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="app-card w-fit tektur-lg text-center flex flex-col gap-4 max-w-[600px]">
          Start recording your music with JamLine.
          <p className="ibm-md-secondary">
            Click the button below to create a new record.
          </p>
          <AppButton
            className="group hover:shadow-[0_0_10px_1px_rgba(255,255,255,0.34)] transition-all ease-in-out px-18"
            onClick={toggleModal}
          >
            <span className="text-lg font-semibold mx-2 group-hover:mx-4 transition-all ease-in-out">
              Create
            </span>
          </AppButton>
        </div>
      </motion.div>
      <motion.div
        className="absolute -right-10 bottom-0"
        initial={{ x: 150, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 150, opacity: 0 }}
        transition={{ duration: 1.5 }}
      >
        <div className="text-[#FF4C02] animate-[bounce_1.4s_ease-in_infinite]">
          <IconNote3 />
        </div>
      </motion.div>
      <motion.div
        className="absolute -left-14 bottom-0"
        initial={{ x: -150, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -150, opacity: 0 }}
        transition={{ duration: 1.5 }}
      >
        <div className="text-[#FF4C02] animate-[bounce_1.5s_ease-in_infinite] -scale-x-100">
          <IconNote4 />
        </div>
      </motion.div>
    </motion.div>
  );
};
export default IntroModal;
