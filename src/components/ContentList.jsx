import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { getFlag, getChannelInfo } from "../services/youtubeService";
import VideoInfoCard from "./VideoInfoCard";
import ContentListHeader from "./ContentListHeader";
import PlatformSwitcher from "./PlatformSwitcher";
import PlatformContext from "../context/PlatformProvider";
import MusicInfoCard from "./MusicInfoCard";
import StopAudio from "./StopAudio";
function ContentList({ content, selectedCountry, loading, error }) {
  const { currentPlatform } = useContext(PlatformContext);
  const [flag, setFlag] = useState("");
  const [flagLoading, setFlagLoading] = useState(false);
  const [flagError, setFlagError] = useState(null);

  const [isOpen, setIsOpen] = useState(false); // For collapsing the entire list
  const [channelInfo, setChannelInfo] = useState(null);
  const [isOpenChannelInfo, setIsOpenChannelInfo] = useState(false); // For channel collapsible
  const [audio, setAudio] = useState("");

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
      className={`transition-all flex gap-y-1 flex-col max-w-[500px] w-screen dark:bg-black/50 backdrop-blur-sm
        ${isOpen ? "h-[94vh]" : " h-12 md:h-20 "}  
        dark:border-gray-600 md:border-l md:border-r border-b border-y-1 sm:rounded-md  md:mt-4 md:mx-4  shadow-sm shadow-black overflow-y-hidden`}
    >
      {/* Header area */}
      <ContentListHeader
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        flag={flag}
        flagLoading={flagLoading}
        flagError={flagError}
        loading={loading}
        error={error}
      ></ContentListHeader>
      <hr className="mx-2"></hr>
      <div className="flex justify-between py-2 mx-4 items-center flex-wrap *:flex-grow ">
        <span className="flex items-center gap-x-2 ml-2 ">
          País: {selectedCountry || "Ninguno"}
          {flag && (
            <img
              src={flag}
              className="w-14 h-8 object-cover rounded-md border-[1px] border-gray-500"
              alt="Flag"
            />
          )}
        </span>
        <StopAudio></StopAudio>
        <PlatformSwitcher></PlatformSwitcher>
      </div>
      {/* Video List Body */}
      <div className=" overflow-y-auto mx-2 ">
        {!content.length ? (
          <h1 className="text-center dark:bg-gray-600 bg-gray-300 p-10 rounded-md opacity-80 mx-3">
            No hay contenido para mostrar. Selecciona un país.
          </h1>
        ) : (
          <ul className="flex flex-col space-y-3 px-2">
            {currentPlatform == "youtube" ? (
              content?.map((video, i) => {
                return (
                  <VideoInfoCard
                    index={i}
                    key={video.id || i}
                    videoInfo={video}
                    channelInfo={channelInfo}
                    handleFetchChannelInfo={handleFetchChannelInfo}
                    isOpenChannelInfo={isOpenChannelInfo}
                    setIsOpenChannelInfo={setIsOpenChannelInfo}
                  />
                );
              })
            ) : currentPlatform == "spotify" ? (
              content?.slice(0, 10).map((song, i) => {
                return (
                  <MusicInfoCard
                    key={song.id || i}
                    index={i}
                    songInfo={song}
                    setAudio={setAudio}
                    audio={audio}
                  />
                );
              })
            ) : (
              <h1 className="absolute z-50 text-4xl">{"Algo salió mal :("}</h1>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

ContentList.propTypes = {
  // content: PropTypes.array.isRequired,
  selectedCountry: PropTypes.string,
  loading: PropTypes.bool,
  error: PropTypes.string,
};

export default ContentList;
