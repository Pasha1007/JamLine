import { React, useState } from "react";
import { motion } from "motion/react";
import { AppButton } from "../atoms/AppButton";
import { AppInput } from "../atoms/AppInput";
import { AppSelect } from "../atoms/AppSelect";
import { createEnvironment } from "../../services/enviromentService";
import { toast } from "react-toastify";
import { IconClose } from "../icons/IconClose";
const CreateEnvModal = ({ toggleModal, updateEnvList }) => {
  const [name, setName] = useState("");
  const [instrument, setInstrument] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !instrument) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      const response = await createEnvironment(name, instrument.value);
      toast.success("New environment created!");
      updateEnvList(response);
      toggleModal();
    } catch (err) {
      console.log("Env error", err);
      toast.error("Failed to create new environment");
    }
  };

  const selectOptions = [{ value: "drums", label: "Drums" }];

  return (
    <motion.div
      className="w-[100vw] flex justify-center"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <form
        onSubmit={handleSubmit}
        className="app-card w-fit tektur-lg rounded-tr-none! text-center flex flex-col gap-4 max-w-[700px] "
      >
        <div
          className="absolute z-100 text-[#FF4C02] right-2 top-2 cursor-pointer"
          onClick={toggleModal}
        >
          {" "}
          <IconClose />
        </div>
        Create your environment
        <p className="ibm-md-secondary">
          Your music is being captured with JamLine.
        </p>
        <AppInput
          type="text"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div className="flex gap-2 tektur-md text-left items-center">
          <span className="w-full">Choose your instrument:</span>
          <AppSelect
            className="w-full"
            options={selectOptions}
            onChange={(selectedOption) => setInstrument(selectedOption)}
            required
          />
        </div>
        <AppButton
          type="submit"
          className="mt-2 hover:shadow-[0_0_10px_1px_rgba(255,255,255,0.34)] transition-all ease-in-out px-18"
        >
          <span className="text-lg font-semibold mx-2 transition-all ease-in-out">
            Start JAMMING
          </span>
        </AppButton>
      </form>
    </motion.div>
  );
};

export default CreateEnvModal;
