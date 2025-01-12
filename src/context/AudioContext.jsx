import React, { useState, createContext, useContext, useRef } from "react";

// Create a context to share audio state and actions
const AudioContext = createContext();

export const useAudio = () => useContext(AudioContext);

const AudioProvider = ({ children }) => {
  const [currentAudioUrl, setCurrentAudioUrl] = useState(null); // Current audio URL
  const [isPlaying, setIsPlaying] = useState(false); // Play/Pause state
  const audioRef = useRef(new Audio()); // Audio element

  // Play or pause the current audio
  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Change the audio and play it
  const changeAudio = (url) => {
    if (currentAudioUrl !== url) {
      audioRef.current.src = url;
      audioRef.current.play();
      setCurrentAudioUrl(url);
      setIsPlaying(true);
    } else {
      togglePlayPause(); // If it's the same audio, just toggle play/pause
    }
  };

  // Stop the audio
  const stopAudio = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0; // Reset the audio playback position
    setIsPlaying(false);
  };

  // Provide state and functions to children
  return (
    <AudioContext.Provider
      value={{
        currentAudioUrl,
        isPlaying,
        togglePlayPause,
        changeAudio,
        stopAudio,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export default AudioProvider;
