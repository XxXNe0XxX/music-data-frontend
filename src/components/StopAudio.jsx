import React, { useContext } from "react";
import { useAudio } from "../context/AudioContext";
import { FaStop } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";
import { AnimatePresence, motion } from "motion/react";

const StopAudio = () => {
  const { isDark } = useContext(ThemeContext);
  const { isPlaying, togglePlayPause } = useAudio();
  return (
    <AnimatePresence>
      {isPlaying && (
        <motion.div
          initial={{ opacity: 0, width: 0, height: 0 }}
          animate={{ opacity: 1, width: 70, height: "30px" }}
          exit={{ opacity: 0, width: 0, height: 0 }}
          onClick={togglePlayPause}
          className=" cursor-pointer overflow-hidden ml-4  z-30 flex gap-x-1 justify-center items-center   rounded-md "
        >
          <button>
            <FaStop
              className={`text-red-600 shadow-sm drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] hover:text-red-400  transition-colors text-2xl`}
            />
          </button>
          <h1 className=" dark:text-white font-semibold text-[12px]">STOP</h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StopAudio;
