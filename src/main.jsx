import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { PlatformProvider } from "./context/PlatformProvider";
import AudioProvider from "./context/AudioContext";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PlatformProvider>
      <AudioProvider>
        <App />
      </AudioProvider>
    </PlatformProvider>
  </React.StrictMode>
);
