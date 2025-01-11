import { createContext } from "react";
import { useState } from "react";

const PlatformContext = createContext("youtube");

export const PlatformProvider = ({ children }) => {
  const [currentPlatform, setCurrentPlatform] = useState("youtube");
  return (
    <PlatformContext.Provider value={{ currentPlatform, setCurrentPlatform }}>
      {children}
    </PlatformContext.Provider>
  );
};
export default PlatformContext;
