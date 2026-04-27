import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { LuCalendar, LuEye, LuWatch } from "react-icons/lu";
import { BiHeadphone, BiLike } from "react-icons/bi";
import { FaPlus, FaUser, FaUserFriends } from "react-icons/fa";
import * as motion from "motion/react-client";
import { abbreviateNumber } from "../utils/abbreviateNumber";
import { AnimatePresence } from "motion/react";
import { ThemeContext } from "../context/ThemeContext";
import {
  MdArrowCircleUp,
  MdArrowCircleDown,
  MdOutlineHeadphones,
} from "react-icons/md";
import { IoStatsChartOutline } from "react-icons/io5";

export default function MusicInfoCard({ songInfo, index }) {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark } = useContext(ThemeContext);

  // Normalise to flat new format
  const trackName = songInfo.trackName || songInfo.track?.name || "";
  const trackUrl =
    songInfo.trackUrl || songInfo.track?.external_urls?.spotify || "#";
  const imageUrl =
    songInfo.trackImageUrl ||
    songInfo.track?.album?.images?.[1]?.url ||
    songInfo.imageUrl ||
    "";
  const artists = songInfo.artists || songInfo.track?.artists || [];
  const streams = songInfo.streams;
  const peakPos = songInfo.peakPosition;
  const weeksOnChart = songInfo.weeksOnChart;
  const position = songInfo.rank;
  const posChange = songInfo.positionChange;
  const relaseDate = songInfo.releaseDate;

  // Format a rough "date added" from today minus weeksOnChart, or omit
  const dateLabel =
    weeksOnChart != null
      ? (() => {
          const d = new Date();
          d.setDate(d.getDate() - weeksOnChart * 7);
          return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
        })()
      : null;

  return (
    <AnimatePresence>
      <motion.li
        initial={{ opacity: 0, y: 8 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { delay: index * 0.07, duration: 0.3 },
        }}
        exit={{ opacity: 0 }}
        className={`rounded-lg overflow-hidden shadow-md bg-gradient-to-br  ${
          isDark
            ? "bg-zinc-900 border border-white/5 from-green-600 to-black"
            : "bg-white border border-black/8 from-green-300 to-white"
        }`}
      >
        {/* ── Top row: thumbnail + info ── */}
        <div className="flex gap-0">
          {/* Thumbnail */}
          <div className="relative flex-shrink-0 w-fit h-28">
            <img
              className="w-full h-full object-cover"
              src={imageUrl}
              alt={trackName}
            />
            {/* Position badge */}
            {position !== undefined && (
              <div className="absolute top-1.5 left-1.5 bg-green-500 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center leading-none">
                #{position}
              </div>
            )}
            {/* Position change arrow overlay */}
            {posChange && posChange !== "none" && (
              <div className="absolute bottom-1.5 left-1.5">
                {posChange === "up" ? (
                  <MdArrowCircleUp className="text-green-400 text-lg drop-shadow" />
                ) : (
                  <MdArrowCircleDown className="text-red-400 text-lg drop-shadow" />
                )}
              </div>
            )}
          </div>

          {/* Right: track name + artist line + expand */}
          <div
            className={`flex flex-col justify-between flex-grow px-3 py-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            <div className="h-full flex flex-col justify-between">
              <a href={trackUrl} target="_blank" rel="noopener noreferrer">
                <h3
                  className={`font-semibold text-sm leading-snug line-clamp-2 hover:underline ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {trackName}
                </h3>
              </a>

              {/* Artist name(s) — like the " Artist - Topic" line in the screenshot */}
              {artists.length > 0 && (
                <div className="flex justify-start items-end gap-x-2">
                  <div>
                    {artists.length == 1 ? (
                      <FaUser className="text-md" />
                    ) : (
                      <FaUserFriends className="text-lg" />
                    )}
                  </div>

                  <p
                    className={`text-xs mt-1 flex items-center gap-1 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <span className="line-clamp-1">
                      {artists.map((a) => a.name).join(", ")}
                      {artists.length === 1 ? " - Topic" : ""}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Expand button */}
            <div className="flex justify-end">
              <button
                onClick={() => setIsOpen((p) => !p)}
                className={`p-1 rounded-full transition-colors ${
                  isDark ? "hover:bg-white/10" : "hover:bg-black/8"
                }`}
                aria-label="Toggle artist details"
              >
                <FaPlus
                  className={`text-xs transition-transform duration-200 ${
                    isOpen ? "rotate-45" : ""
                  } ${isDark ? "text-gray-400" : "text-gray-500"}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* ── Hashtag artist tags ── */}
        {artists.length > 0 && (
          <div
            className={`px-2 pt-1 pb-0.5 flex flex-wrap gap-x-2 gap-y-0.5 ${
              isDark ? "" : ""
            }`}
          >
            {artists.map((artist, i) => (
              <a
                key={artist.url || i}
                href={artist.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-xs font-medium opacity-60 hover:underline ${
                  isDark ? "" : ""
                }`}
              >
                #{artist.name.replace(/\s+/g, "")}
              </a>
            ))}
            <span
              className={`text-xs font-medium opacity-60 ${isDark ? "" : ""}`}
            >
              #{trackName.replace(/\s+/g, "")}
            </span>
          </div>
        )}
        <hr className=" mx-1"></hr>

        {/* ── Stats row ── */}
        <div
          className={`flex items-center gap-3 px-3 py-1.5 text-xs justify-around ${
            isDark ? "text-gray-400 " : "text-gray-500 "
          }`}
        >
          {streams !== undefined && streams !== null && (
            <span className="flex items-center gap-1">
              <BiHeadphone className="text-lg" />
              {abbreviateNumber(streams)}
            </span>
          )}
          {/* Likes placeholder — BiLike kept from original */}
          <span className="flex items-center gap-1">
            <LuCalendar className="text-lg" />
            {relaseDate !== undefined && relaseDate !== null
              ? relaseDate /* approx ratio */
              : "—"}
          </span>

          {peakPos !== undefined && peakPos !== null && (
            <span className="flex items-center gap-1 text-[11px] opacity-70">
              <IoStatsChartOutline className="text-lg" /> Peak #{peakPos}
            </span>
          )}
        </div>

        {/* ── Collapsible artists panel ── */}
        <div
          className={`text-sm transition-all duration-200 overflow-hidden ${
            isDark ? "bg-zinc-800/50" : "bg-gray-100/80"
          } ${isOpen ? "max-h-40 px-3 py-2" : "max-h-0"}`}
        >
          <p
            className={`font-semibold text-xs mb-1.5 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Artists
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {artists.map((artist, i) => (
              <li key={artist.url || i}>
                <a
                  href={artist.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-block px-2.5 py-0.5 rounded-full border text-xs transition-colors ${
                    isDark
                      ? "border-gray-600 text-gray-400 hover:bg-white hover:text-black"
                      : "border-gray-300 text-gray-600 hover:bg-black hover:text-white"
                  }`}
                >
                  {artist.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </motion.li>
    </AnimatePresence>
  );
}

MusicInfoCard.propTypes = {
  songInfo: PropTypes.shape({
    position: PropTypes.number,
    positionChange: PropTypes.string,
    trackName: PropTypes.string,
    trackUrl: PropTypes.string,
    trackImageUrl: PropTypes.string,
    imageUrl: PropTypes.string,
    artists: PropTypes.arrayOf(
      PropTypes.shape({ name: PropTypes.string, url: PropTypes.string }),
    ),
    peakPosition: PropTypes.number,
    weeksOnChart: PropTypes.number,
    streams: PropTypes.number,
  }).isRequired,
  index: PropTypes.number.isRequired,
};
