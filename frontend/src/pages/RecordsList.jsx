import React, { useEffect, useState } from "react";
import { deleteEnvironment, getMyEnvs } from "../services/enviromentService";
import { AppButton } from "../components/atoms/AppButton";
import dayjs from "dayjs";
import CreateEnvModal from "../components/modals/CreateEnvModal";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "react-toastify";
import IntroModal from "../components/modals/IntroModal";
import iconDelete from "../assets/icon-delete.png";
import { useNavigate } from "react-router-dom";

const RecordList = () => {
  const [environments, setEnvironments] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isEnvironments, setIsEnvironments] = useState(false);
  const navigate = useNavigate();
  const fetchMyEnvironments = async () => {
    try {
      const response = await getMyEnvs();
      setEnvironments(response);
    } catch (error) {
      toast.error("Failed to fetch environments");
    }
  };

  const toggleModal = () => {
    setShowCreateModal(!showCreateModal);
  };

  const updateEnvList = (newEnv) => {
    setEnvironments((prevEnvs) => [...prevEnvs, newEnv]);
  };

  const removeEnvFromList = (oldEnv) => {
    setEnvironments((prevEnvs) => prevEnvs.filter((e) => e.id !== oldEnv.id));
  };

  const handleDeleteEnv = async (id) => {
    try {
      const response = await deleteEnvironment(id);
      removeEnvFromList(response);
      toast.success(`Environment: ${response.name} deleted`);
    } catch {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    fetchMyEnvironments();
  }, []);

  useEffect(() => {
    setIsEnvironments(environments && environments.length > 0);
  }, [environments]);

  return (
    <AnimatePresence key="motion-main">
      {isEnvironments ? (
        <div className="flex justify-center gap-8 items-center flex-col w-screen h-screen">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="tektur-xl"
          >
            Create <span className="text-[#FF4C02]">new</span> or use{" "}
            <span className="text-[#FF4C02]">existing</span> playing environment
          </motion.div>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-3/4 flex flex-col"
          >
            <div className="pb-2">
              <span className="ibm-lg">Your environments:</span>
            </div>
            <table className="w-full text-lg text-left">
              <thead className="text-md uppercase bg-[#FF4C02]">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Instrument
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Created At
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Updated At
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="">
                {environments.map((envir, index) => (
                  <AnimatePresence key={envir.id}>
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className={`text-white transition-all duration-200 ${
                        index % 2 === 0 ? "bg-[#2a2a2a]" : "bg-[#232323]"
                      } hover: hover:bg-[#2e2c2c]`}
                    >
                      <td className="px-6 py-4">{envir.name}</td>
                      <td className="px-6 py-4 capitalize">
                        {envir.instrument}
                      </td>
                      <td className="px-6 py-4">
                        {dayjs(envir.created_at).format("DD.MM.YYYY HH:mm")}
                      </td>
                      <td className="px-6 py-4">
                        {dayjs(envir.updated_at).format("DD.MM.YYYY HH:mm")}
                      </td>
                      <td className="py-4 px-4 flex gap-12 items-center justify-end">
                        <AppButton
                          className="py-1"
                          onClick={() => navigate(`/${envir.id}`)}
                        >
                          Jam!
                        </AppButton>

                        <div
                          className="text-[#f00] w-5 cursor-pointer"
                          onClick={() => handleDeleteEnv(envir.id)}
                        >
                          <img src={iconDelete}></img>
                        </div>
                      </td>
                    </motion.tr>
                  </AnimatePresence>
                ))}
              </tbody>
            </table>
            <div className="self-center mt-12">
              <AppButton onClick={toggleModal}>
                Create new environment
              </AppButton>
            </div>
          </motion.div>
        </div>
      ) : (
        <IntroModal toggleModal={toggleModal} />
      )}
      <AnimatePresence key="motion-modal">
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 w-screen h-screen bg-[#000000d0] z-50 flex items-center justify-center"
          >
            <CreateEnvModal
              toggleModal={toggleModal}
              updateEnvList={updateEnvList}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};
export default RecordList;
