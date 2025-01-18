import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { LuEye } from "react-icons/lu";
import { BiLike } from "react-icons/bi";
import {
  FaRegCommentAlt,
  FaRegClock,
  FaClock,
  FaCalendar,
  FaPlay,
  FaPause,
} from "react-icons/fa";
import { GrChannel } from "react-icons/gr";
import { SlPeople } from "react-icons/sl";
import { LiaFileVideoSolid } from "react-icons/lia";
import { CiCalendarDate, CiPause1, CiPlay1 } from "react-icons/ci";
import { IoMdMore } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import { abbreviateNumber } from "../utils/abbreviateNumber";
import { AnimatePresence, motion } from "motion/react";
import { IoArrowBackSharp } from "react-icons/io5";
import { millisToMinutesAndSeconds } from "../utils/millisToMinutesAndSeconds";
import { LiaCompactDiscSolid } from "react-icons/lia";
import { TbChartBarPopular } from "react-icons/tb";
import AudioControls from "./AudioControls";
import { useAudio } from "../context/AudioContext";
import { ThemeContext } from "../context/ThemeContext";
import { MdCalendarToday } from "react-icons/md";
export default function ShowCard({ show, index }) {
  // Deconstruct data
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
  }, [show]);
  // Check if this video’s channel matches the loaded `channelInfo`
  const { isDark } = useContext(ThemeContext);
  return (
    <AnimatePresence>
      <motion.li
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { delay: index * 0.1, duration: 0.3 },
        }}
        exit={{ opacity: 0 }}
        className={`group rounded-md border-opacity-10 shadow-sm shadow-gray-600 overflow-hidden backdrop-blur-sm bg-gradient-to-l ${
          isDark
            ? "from-slate-500/20 to-red-900/80"
            : "from-slate-300/40 to-red-100/90"
        }`}
      >
        {/* --- Top Row: Thumbnail +  --- */}
        <div className="flex gap-2 ">
          {/* Thumbnail or song's album image */}
          <div
            className={`flex items-center  md:w-[45%] w-[55%] max-h-fit justify-center overflow-hidden transition-all `}
          >
            {isLoading && (
              <h1 className="absolute flex justify-center items-center animate-pulse">
                Cargando Imagen
              </h1>
            )}

            {/* Always render the image, but hide it until it's loaded */}
            <img
              className={`object-cover transition-all h-52 hover:scale-150 ${
                isLoading ? "opacity-0" : "opacity-100"
              }`}
              src={show.image}
              alt={`${show.name} image`}
              onLoad={() => setIsLoading(false)}
            />
          </div>

          {/* Song name and link to the spotify url */}
          <div className="flex flex-col justify-between flex-grow transition-all md:w-[55%] w-[45%] ">
            <a
              href={`https://www.google.com/search?q=${show.name + " netflix"}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <h1 className=" leading-6 hover:underline text-xl py-3">
                {show.name}
              </h1>
              <h2 className="opacity-60">{show.season_title}</h2>
            </a>

            {/* Channel name or fetch button */}
            <div className="flex justify-between items-center">
              <h1 className="font-semibold line-clamp-1 text-5xl ">
                {show.rank}
              </h1>

              {/* Toggle extra channel info */}
              <div className=" flex mr-2 ">
                <button
                  className=""
                  onClick={() => {
                    setIsOpen((prev) => !prev);
                  }}
                >
                  <FaPlus
                    className={`${isOpen ? "rotate-45" : ""} transition-all`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Tags list */}
        <div className="flex flex-wrap line-clamp-2  font-thin text-blue-200 w-full   items-center justify-start"></div>

        {/* --- Collapsible Panel for "More Channel Info" --- */}
        <div
          className={`text-sm transition-all  bg-gray-200 dark:bg-gray-800/50 rounded-md px-2 ${
            isOpen ? "max-h-32" : "max-h-0"
          }`}
        >
          <h1 className="flex justify-between p-1">
            Semanas seguidas en el top:{" "}
            <span className=" font-light">
              {show.cumulative_weeks_in_top_10}
            </span>
          </h1>
        </div>
      </motion.li>
    </AnimatePresence>
  );
}
