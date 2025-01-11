import React from "react";
import { FaYoutube } from "react-icons/fa";
import { FaSpotify } from "react-icons/fa";
import { useContext } from "react";
import PlatformContext from "../context/PlatformProvider";
const PlatformSwitcher = () => {
  const { currentPlatform, setCurrentPlatform } = useContext(PlatformContext);
  return (
    <ul
      className="flex items-center justify-around  text-2xl p-1 space-x-3"
      role="tablist"
    >
      <li>
        <button
          onClick={() => setCurrentPlatform("youtube")}
          className={`rounded-md  p-2 transition-colors ${
            currentPlatform === "youtube"
              ? "bg-red-600 text-white border-red-400"
              : "hover:bg-gray-600 text-gray-300"
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
              ? "bg-green-600 text-white border-green-400"
              : "hover:bg-gray-600 text-gray-300"
          }`}
          role="tab"
          aria-selected={currentPlatform === "spotify"}
          aria-controls="spotify-content"
        >
          <FaSpotify title="Spotify" />
        </button>
      </li>
    </ul>
  );
};

export default PlatformSwitcher;
