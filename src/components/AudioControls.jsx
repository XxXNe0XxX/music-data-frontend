import React from "react";
import { useAudio } from "../context/AudioContext";
import { FaPause, FaPlay } from "react-icons/fa";

const AudioControls = ({ audioUrl, title }) => {
  const { currentAudioUrl, isPlaying, changeAudio, togglePlayPause } =
    useAudio();

  return (
    <div className="flex">
      {currentAudioUrl !== audioUrl && (
        <button
          onClick={() => {
            changeAudio(audioUrl);
            togglePlayPause;
          }}
        >
          <FaPlay className="dark:hover:text-white hover:text-black transition-colors"></FaPlay>
        </button>
      )}
      {currentAudioUrl === audioUrl && (
        <button onClick={togglePlayPause}>
          {isPlaying ? (
            <FaPause className="dark:hover:text-white hover:text-black transition-colors" />
          ) : (
            <FaPlay className="dark:hover:text-white hover:text-black transition-colors" />
          )}
        </button>
      )}
    </div>
  );
};

export default AudioControls;
