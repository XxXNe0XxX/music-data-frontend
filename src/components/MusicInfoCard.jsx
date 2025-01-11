import PropTypes from "prop-types";
import { useEffect, useState } from "react";
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

export default function MusicInfoCard({ songInfo, setAudio, audio }) {
  // Deconstruct data

  // Check if this video’s channel matches the loaded `channelInfo`
  const trackInfo = songInfo.track || {};
  const albumInfo = songInfo.track.album || {};
  const artistsInfo = songInfo.track.artists || {};
  return (
    <AnimatePresence>
      <motion.li
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="group rounded-md p-1 border-opacity-10 shadow-sm shadow-white overflow-hidden backdrop-blur-sm bg-gradient-to-l from-slate-500/20 to-slate-900/80"
      >
        {/* --- Top Row: Thumbnail +  --- */}
        <div className="flex gap-2 ">
          {/* Thumbnail or song's album image */}
          <div
            className={`flex items-center  w-[45%] max-h-fit justify-center rounded-full   transition-all `}
          >
            <img
              className="object-cover transition-all h-20 w-full"
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
                className="flex items-center gap-x-1 text-md hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LiaCompactDiscSolid
                  className={`${
                    trackInfo.preview_url === audio ? "animate-spin" : ""
                  } text-2xl   w-[30px]`}
                />
                <h1 className="font-semibold line-clamp-1">{albumInfo.name}</h1>
                {/* <p>{albumInfo.album_type}</p> */}
              </a>

              {/* Toggle extra channel info */}
              <div className=" flex mr-2 ">
                <button className="text-white">
                  <FaPlus />
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Tags list */}
        <div className="flex flex-wrap line-clamp-2  font-thin text-blue-200 w-full p-1  items-center justify-start"></div>
        {/* --- Stats Row --- */}
        <div className="flex  items-center *:justify-center text-gray-400  *:w-full  mt-1 ">
          <div className="flex items-center space-x-2  w-full text-left">
            <FaPlay
              className=" text-xl"
              onClick={() => {
                setAudio(trackInfo.preview_url);
              }}
            ></FaPlay>
            <FaPause
              className=" text-xl"
              onClick={() => setAudio("")}
            ></FaPause>
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
            <CiCalendarDate />
            <span title="Fecha de lanzamiento">
              {new Date(trackInfo?.added_at).toLocaleDateString()}
            </span>
          </p>
        </div>

        {/* --- Collapsible Panel for "More Channel Info" --- */}
        <div
          className={`overflow-hidden transition-all duration-300 mt-2 
            
            bg-gray-800/50 rounded-md px-2`}
        >
          <h4 className="font-semibold text-lg mb-1">
            Informacion del artista:
          </h4>
          <ul className="text-gray-200 text-sm pl-4 list-disc space-y-1 flex flex-wrap">
            <h1>Artistas</h1>
            {/* <li>País: {channelSnippet?.country || "N/A"}</li> */}
            {artistsInfo?.map((artist, i) => {
              return (
                <li className="flex">
                  <a
                    href={artist.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline ml-1"
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

MusicInfoCard.propTypes = {
  videoInfo: PropTypes.object.isRequired,
  channelInfo: PropTypes.object,
  handleFetchChannelInfo: PropTypes.func.isRequired,
  isOpenChannelInfo: PropTypes.bool,
  setIsOpenChannelInfo: PropTypes.func.isRequired,
};

MusicInfoCard.defaultProps = {
  channelInfo: null,
  isOpenChannelInfo: false,
};
