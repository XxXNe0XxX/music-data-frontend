import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { getFlag, getChannelInfo } from "../services/youtubeService";
import { MdOutlineKeyboardDoubleArrowUp } from "react-icons/md";
import VideoInfoCard from "./VideoInfoCard";

function VideoList({ videos, selectedCountry, loading, error }) {
  const [flag, setFlag] = useState("");
  const [flagLoading, setFlagLoading] = useState(false);
  const [flagError, setFlagError] = useState(null);

  const [isOpen, setIsOpen] = useState(false); // For collapsing the entire list
  const [channelInfo, setChannelInfo] = useState(null);
  const [isOpenChannelInfo, setIsOpenChannelInfo] = useState(false); // For channel collapsible

  useEffect(() => {
    async function fetchFlag() {
      if (!selectedCountry) {
        setFlag("");
        return;
      }
      setFlagLoading(true);
      setFlagError(null);
      try {
        const flagData = await getFlag(selectedCountry);
        setFlag(flagData);
        setIsOpen(true);
      } catch (err) {
        console.error("Error fetching flag:", err);
        setFlagError("Error loading flag");
        setFlag("");
      } finally {
        setFlagLoading(false);
      }
    }
    fetchFlag();
  }, [selectedCountry]);

  async function handleFetchChannelInfo(channelId) {
    try {
      const response = await getChannelInfo(channelId);
      setChannelInfo(response);
      // Optionally open the channel collapsible when we fetch
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      className={`transition-all flex gap-y-1 flex-col max-w-[500px] w-screen bg-black/50
        ${isOpen ? "h-[94vh]" : " h-12 md:h-20 "}  
        border-gray-900 border-l border-r border-b sm:rounded-md m-0 md:mt-4 md:ml-4  shadow-lg shadow-black overflow-y-hidden`}
    >
      {/* Header area */}
      <div className="relative flex flex-wrap items-start justify-between text-nowrap min-h-44  overflow-hidden">
        {/* Flag loading, error, or the image */}
        <div className="absolute w-full flex items-center justify-center">
          {flagLoading && <h1>Cargando bandera...</h1>}
          {flagError && (
            <h1 className="text-right">Error al cargar la bandera...</h1>
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
            Videos populares
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
              {/* {error} */}
              Videos no disponibles debido a restricciones regionales de
              youtube.
            </h1>
          )}
        </div>
      </div>

      {/* Video List Body */}
      <div className=" overflow-y-auto ">
        {!videos.length ? (
          <h1 className="text-center bg-gray-600 rounded-md opacity-80">
            No hay videos para mostrar.
          </h1>
        ) : (
          <ul className="flex flex-col space-y-5 p-2">
            {selectedCountry && (
              <span className="flex items-center gap-x-2">
                Seleccionado: {selectedCountry}
                {flag && (
                  <img
                    src={flag}
                    className="w-14 h-8 object-cover rounded-md"
                    alt="Flag"
                  />
                )}
              </span>
            )}

            {videos.map((video, i) => (
              <VideoInfoCard
                key={video.id || i}
                videoInfo={video}
                channelInfo={channelInfo}
                handleFetchChannelInfo={handleFetchChannelInfo}
                isOpenChannelInfo={isOpenChannelInfo}
                setIsOpenChannelInfo={setIsOpenChannelInfo}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

VideoList.propTypes = {
  videos: PropTypes.array.isRequired,
  selectedCountry: PropTypes.string,
  loading: PropTypes.bool,
  error: PropTypes.string,
};

export default VideoList;
