import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { PlatformProvider } from "./context/PlatformProvider";
import AudioProvider from "./context/AudioContext";
import { ThemeProvider } from "./context/ThemeContext";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <PlatformProvider>
        <AudioProvider>
          <App />
        </AudioProvider>
      </PlatformProvider>
    </ThemeProvider>
  </React.StrictMode>
);
