import React from "react";
import PropTypes from "prop-types";
import { MdOutlineKeyboardDoubleArrowUp } from "react-icons/md";

// 1) Import from Motion
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";

function ContentListHeader({
  isOpen,
  setIsOpen,
  flag,
  flagLoading,
  flagError,
  loading,
  error,
}) {
  return (
    <div className="relative flex flex-wrap items-start justify-between text-nowrap min-h-44 overflow-hidden">
      {/* Flag loading, error, or the image */}
      <div className="absolute w-full flex items-center justify-center">
        {flagLoading && (
          <h1 className="absolute bottom-0 left-0 p-1">Cargando bandera...</h1>
        )}
        {flagError && (
          <h1 className="text-right absolute bottom-0 left-0 p-1">
            Error al cargar la bandera...
          </h1>
        )}
        {flag && (
          <img
            src={flag}
            className={`w-full object-cover transition-all ${
              isOpen ? "h-44" : "h-12 md:h-20"
            }`}
          />
        )}
        <div className="absolute top-0 left-0 bg-gradient-to-r from-black/100 to-gray-50/0 w-[100%] h-[100%]" />
      </div>

      {/* Title + expand button */}
      <div className="flex items-center justify-between w-full z-10 h-12 md:h-20 p-2">
        <h1
          className={`${
            isOpen ? "text-3xl" : "text-2xl"
          } w-full font-semibold transition-all ml-2 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]`}
        >
          Videos populares 🔥
        </h1>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="text-3xl border-1 border-gray-200 shadow-sm bg-slate-900 shadow-black rounded-md"
        >
          <MdOutlineKeyboardDoubleArrowUp
            className={`${
              isOpen ? "" : "rotate-180"
            } transition-all text-gray-200`}
          />
        </button>
      </div>

      {/* Loading or error states */}
      <div className="w-full text-nowrap h-fit z-10 mx-2 flex justify-end">
        {loading && (
          <h1 className="text-white rounded-md p-1 bg-blue-700 text-center leading-4">
            Cargando videos...
          </h1>
        )}
        {error && (
          <h1 className="text-white rounded-md p-1 bg-red-700 text-center leading-4 text-wrap">
            {error}
            {/* Videos no disponibles debido a restricciones regionales de youtube. */}
          </h1>
        )}
      </div>
    </div>
  );
}

ContentListHeader.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  flag: PropTypes.string,
  flagLoading: PropTypes.bool,
  flagError: PropTypes.string,
  loading: PropTypes.bool,
  error: PropTypes.string,
};

ContentListHeader.defaultProps = {
  flag: "",
  flagLoading: false,
  flagError: null,
  loading: false,
  error: null,
};

export default ContentListHeader;
