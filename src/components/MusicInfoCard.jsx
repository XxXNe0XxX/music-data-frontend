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
export default function MusicInfoCard({ songInfo, index }) {
  // Deconstruct data
  const { isPlaying, currentAudioUrl } = useAudio();
  const [isOpen, setIsOpen] = useState(false);
  // Check if this video’s channel matches the loaded `channelInfo`
  const trackInfo = songInfo.track || {};
  const albumInfo = songInfo.track.album || {};
  const artistsInfo = songInfo.track.artists || {};
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
            ? "from-slate-500/20 to-green-900/80"
            : "from-slate-300/40 to-green-100/90"
        }`}
      >
        {/* --- Top Row: Thumbnail +  --- */}
        <div className="flex gap-2 ">
          {/* Thumbnail or song's album image */}
          <div
            className={`flex items-center  w-[45%] max-h-fit justify-center rounded-full   transition-all `}
          >
            <img
              className="object-cover transition-all h-28 w-full"
              src={albumInfo?.images[1]?.url || ""}
              alt={trackInfo?.name || "Album thumbnail"}
            />
          </div>

          {/* Song name and link to the spotify url */}
          <div className="flex flex-col justify-between flex-grow transition-all w-full ">
            <a
              href={trackInfo.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
            >
              <h3 className="hover:underline leading-6 line-clamp-2">
                {trackInfo.name}
              </h3>
            </a>

            {/* Channel name or fetch button */}
            <div className="flex justify-between items-center">
              <a
                href={albumInfo?.external_urls.spotify}
                className="flex items-center  text-md hover:underline w-full"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LiaCompactDiscSolid
                  className={`${
                    trackInfo.preview_url === currentAudioUrl && isPlaying
                      ? "animate-spin"
                      : ""
                  } text-2xl w-[10%]`}
                />
                <h1 className="font-semibold line-clamp-1 w-[80%]">
                  {albumInfo?.name}
                </h1>
                {/* <p>{albumInfo.album_type}</p> */}
              </a>

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
        <div className="flex flex-wrap line-clamp-2  font-thin text-blue-200 w-full p-1  items-center justify-start"></div>
        {/* --- Stats Row --- */}
        <div className="flex  items-center *:justify-center text-gray-400 *:w-full px-2 ">
          <div className="flex items-center space-x-2  w-full pl-4">
            <AudioControls
              audioUrl={trackInfo.preview_url}
              title={trackInfo.name}
            />
          </div>
          <p className="flex items-center gap-x-1 ">
            <TbChartBarPopular />
            <span title="Popularidad">
              {trackInfo.popularity + "/" + "100"}
            </span>
          </p>
          <p className="flex items-center gap-x-1 ">
            <FaRegClock />
            <span title="Duracion de la cancion">
              {millisToMinutesAndSeconds(trackInfo.duration_ms)}
            </span>
          </p>
          <p className="flex items-center gap-x-1 ">
            <MdCalendarToday />
            <span title="Fecha de lanzamiento">
              {new Date(trackInfo?.added_at).toLocaleDateString()}
            </span>
          </p>
        </div>

        {/* --- Collapsible Panel for "More Channel Info" --- */}
        <div
          className={`text-sm transition-all mt-2 bg-gray-200 dark:bg-gray-800/50 rounded-md px-2 ${
            isOpen ? "max-h-32" : "max-h-0"
          }`}
        >
          <h1>
            Fecha de lanzamiento del álbum:{" "}
            {new Date(
              albumInfo.release_date + "T00:00:00Z"
            ).toLocaleDateString()}
          </h1>

          <ul className="  list-disc space-x-2 space-y-1 flex flex-wrap items-center">
            <h1>Artistas:</h1>
            {/* <li>País: {channelSnippet?.country || "N/A"}</li> */}
            {artistsInfo?.map((artist, i) => {
              return (
                <li
                  className="flex text-gray-500 rounded-full border-[1px] border-gray-600"
                  key={artist.id || i}
                >
                  <a
                    href={artist.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 hover:bg-white hover:text-black rounded-full transition-all"
                  >
                    {artist.name}
                  </a>
                  {/* <img src={}></img> */}
                </li>
              );
            })}
          </ul>
        </div>
      </motion.li>
    </AnimatePresence>
  );
}
