import React, { useState } from "react";
import { FaYoutube, FaSpotify } from "react-icons/fa";
import { SiNetflix } from "react-icons/si";
import { AnimatePresence, motion } from "framer-motion";
import { MdLocalMovies, MdOutlineArrowDropDown } from "react-icons/md";
import { useContext } from "react";
import PlatformContext from "../context/PlatformProvider";
import { FiTv } from "react-icons/fi";

const PlatformSwitcher = () => {
  const [isNetflixDropdownOpen, setIsNetflixDropdownOpen] = useState(true);
  const { currentPlatform, setCurrentPlatform } = useContext(PlatformContext);

  return (
    <ul
      className="flex items-center justify-end max-w-full text-2xl p-1 space-x-3"
      role="tablist"
    >
      <li>
        <button
          onClick={() => setCurrentPlatform("youtube")}
          className={`rounded-md p-2 transition-colors ${
            currentPlatform === "youtube"
              ? "bg-red-700 text-white border-red-400"
              : "hover:bg-neutral-500"
          }`}
          role="tab"
          aria-selected={currentPlatform === "youtube"}
          aria-controls="youtube-content"
        >
          <FaYoutube title="YouTube" />
        </button>
      </li>
      <li>
        <button
          onClick={() => setCurrentPlatform("spotify")}
          className={`rounded-md p-2 transition-colors ${
            currentPlatform === "spotify"
              ? "bg-green-700 text-white border-green-400"
              : "hover:bg-neutral-500"
          }`}
          role="tab"
          aria-selected={currentPlatform === "spotify"}
          aria-controls="spotify-content"
        >
          <FaSpotify title="Spotify" />
        </button>
      </li>
      <li className="relative">
        <button
          onClick={() => {
            !currentPlatform.includes("netflix") &&
              setCurrentPlatform("netflixMovies");
            setIsNetflixDropdownOpen((prev) => !prev);
          }}
          className={`rounded-md p-2 flex items-center text-start transition-colors ${
            currentPlatform.includes("netflix")
              ? "bg-black text-red-600"
              : "hover:bg-neutral-500"
          }`}
          role="tab"
          aria-selected={currentPlatform.includes("netflix")}
          aria-controls="netflix-content"
        >
          <SiNetflix title="Netflix" />
          <AnimatePresence>
            {currentPlatform.includes("netflix") && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 20 }}
                exit={{ opacity: 0, width: 0 }}
                className="flex justify-center"
              >
                <MdOutlineArrowDropDown
                  aria-expanded={isNetflixDropdownOpen}
                  className={`transition-transform text-white ${
                    !isNetflixDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
        <AnimatePresence>
          {currentPlatform.includes("netflix") && isNetflixDropdownOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute flex flex-col top-full right-0 gap-y-1 mt-8 z-40  text-center dark:text-white text-black"
            >
              <span
                onClick={() => {
                  setCurrentPlatform("netflixMovies");
                  setIsNetflixDropdownOpen(false);
                }}
                className={`${
                  currentPlatform === "netflixMovies"
                    ? "bg-black  dark:bg-black text-red-600 "
                    : "dark:bg-black bg-white text-black dark:text-white"
                } flex items-center justify-start gap-x-1 cursor-pointer hover:opacity-90   transition-all rounded-md  min-w-12 p-2  text-sm  `}
              >
                <MdLocalMovies className="text-lg ml-1" /> Cine
              </span>
              <span
                onClick={() => {
                  setCurrentPlatform("netflixShows");
                  setIsNetflixDropdownOpen(false);
                }}
                className={`${
                  currentPlatform === "netflixShows"
                    ? "bg-black  dark:bg-black text-red-600 "
                    : "dark:bg-black bg-white text-black dark:text-white"
                } flex items-center justify-start gap-x-1 cursor-pointer opacity-90 hover:opacity-100   transition-all rounded-md  min-w-12 p-2  text-sm  `}
              >
                <FiTv className="text-lg mb-[2px] ml-1" />
                TV
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </li>
    </ul>
  );
};

export default PlatformSwitcher;
