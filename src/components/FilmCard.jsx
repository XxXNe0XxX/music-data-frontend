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
import * as motion from "motion/react-client";
import { abbreviateNumber } from "../utils/abbreviateNumber";
import { AnimatePresence } from "motion/react";
import { IoArrowBackSharp } from "react-icons/io5";
import { millisToMinutesAndSeconds } from "../utils/millisToMinutesAndSeconds";
import { LiaCompactDiscSolid } from "react-icons/lia";
import { TbChartBarPopular } from "react-icons/tb";
import AudioControls from "./AudioControls";
import { useAudio } from "../context/AudioContext";
import { ThemeContext } from "../context/ThemeContext";
import { MdCalendarToday } from "react-icons/md";
export default function FilmCard({ film, index }) {
  // Deconstruct data
  const [isOpen, setIsOpen] = useState(false);
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
        className={`group rounded-md border-opacity-10 shadow-sm shadow-black dark:shadow-white overflow-hidden backdrop-blur-sm bg-gradient-to-l ${
          isDark
            ? "from-slate-500/20 to-red-900/80"
            : "from-slate-300/40 to-red-100/90"
        }`}
      >
        {/* --- Top Row: Thumbnail +  --- */}
        <div className="flex gap-2 ">
          {/* Thumbnail or song's album image */}
          <div
            className={`flex items-center  w-[45%] max-h-fit justify-center transition-all overflow-hidden `}
          >
            <img
              loading="lazy"
              className="object-cover transition-all h-52 hover:scale-150"
              src={film.image}
              alt={`${film.name} image`}
            />
          </div>

          {/* Song name and link to the spotify url */}
          <div className="flex flex-col justify-between flex-grow transition-all w-[55%] ">
            <a
              href={`https://www.google.com/search?q=${film.name + " netflix"}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <h3 className=" leading-6 hover:underline text-xl p-3">
                {film.name}
              </h3>
            </a>

            {/* Channel name or fetch button */}
            <div className="flex justify-between items-center">
              <h1 className="font-semibold line-clamp-1 text-5xl ">
                {film.rank}
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
              {film.cumulative_weeks_in_top_10}
            </span>
          </h1>
        </div>
      </motion.li>
    </AnimatePresence>
  );
}
