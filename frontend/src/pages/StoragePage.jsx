import React, { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { getMyRecords } from "../services/audioService";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import WaveSurferPlayer from "../components/waveSurferPlayer";

const StoragePage = () => {
  const [records, setRecords] = useState([]);

  const fetchRecords = async () => {
    try {
      const response = await getMyRecords();
      setRecords(response);
    } catch (error) {
      console.log("Error while fetching records", error);
      toast.error("Error while fetching records");
    }
  };
  useEffect(() => {
    fetchRecords();
  }, []);
  return (
    <AnimatePresence key="motion-main">
      {records.length > 0 ? (
        <div className="flex justify-start pt-50 gap-12 items-center flex-col w-screen h-screen">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="tektur-xl"
          >
            Welcome to your <span className="text-[#FF4C02]">records</span>{" "}
            storage
          </motion.div>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-3/4 flex flex-col"
          >
            <div className="pb-2">
              <span className="ibm-lg">Your records:</span>
            </div>
            <table className="w-full text-lg text-left">
              <thead className="text-md uppercase bg-[#FF4C02]">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th className="w-full"></th>

                  <th scope="col" className="px-24 py-3">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody className="">
                {records.map((recs, index) => (
                  <AnimatePresence key={recs.id}>
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className={`text-white transition-all duration-200 ${
                        index % 2 === 0 ? "bg-[#2a2a2a]" : "bg-[#232323]"
                      } hover: hover:bg-[#2e2c2c]`}
                    >
                      <td className="px-6 w-full py-4">{recs.name} - record</td>
                      <td className="py-4 px-4 ">
                        <WaveSurferPlayer path={recs.path} height={20} />
                      </td>
                      <td className="px-24 w-full py-4">
                        {dayjs(recs.created_at).format("DD.MM.YYYY HH:mm")}
                      </td>
                    </motion.tr>
                  </AnimatePresence>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      ) : (
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
              You have no saved records.
              <p className="ibm-md-secondary">
                Start with recording your songs in environments.
              </p>
            </div>
          </motion.div>
          <motion.div
            className="absolute -right-10 bottom-0"
            initial={{ x: 150, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 150, opacity: 0 }}
            transition={{ duration: 1.5 }}
          ></motion.div>
          <motion.div
            className="absolute -left-14 bottom-0"
            initial={{ x: -150, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -150, opacity: 0 }}
            transition={{ duration: 1.5 }}
          ></motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StoragePage;
