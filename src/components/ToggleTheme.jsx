import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { MdDarkMode } from "react-icons/md";
import { MdLightMode } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";

export default function ToggleTheme() {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <div
      className={`p-2 z-20 transition-colors duration-300 
                  ${isDark ? " text-white" : " text-black"} 
                  flex flex-col items-center justify-center`}
    >
      <button
        onClick={toggleTheme}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white
                   rounded-md shadow-md hover:bg-gray-300 dark:hover:bg-gray-700"
      >
        {isDark ? (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, rotate: 0 }}
              animate={{ opacity: 1, rotate: 45 }}
              exit={{ opacity: 0, rotate: 0 }}
            >
              <MdDarkMode />
            </motion.div>
          </AnimatePresence>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opaticy: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <MdLightMode />
            </motion.div>
          </AnimatePresence>
        )}
      </button>
    </div>
  );
}
