import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { getFlag, getChannelInfo } from "../services/youtubeService";
import VideoInfoCard from "./VideoInfoCard";
import ContentListHeader from "./ContentListHeader";
import PlatformSwitcher from "./PlatformSwitcher";
import PlatformContext from "../context/PlatformProvider";
import MusicInfoCard from "./MusicInfoCard";
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
    let beat = new Audio(audio);
    audio === "" && beat.pause();
    const playAudio = () => {
      beat.play();
    };
    playAudio(audio);
  }, [audio]);

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
      <ContentListHeader
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        flag={flag}
        flagLoading={flagLoading}
        flagError={flagError}
        loading={loading}
        error={error}
      ></ContentListHeader>

      {/* Video List Body */}
      <div className=" overflow-y-auto ">
        {!content.length ? (
          <h1 className="text-center bg-gray-600 rounded-md opacity-80">
            No hay contenido para mostrar.
          </h1>
        ) : (
          <ul className="flex flex-col space-y-5 p-2">
            <div className="flex justify-between">
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
              <PlatformSwitcher></PlatformSwitcher>
            </div>
            {currentPlatform == "youtube" ? (
              content?.map((video, i) => {
                return (
                  <VideoInfoCard
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
              content?.map((song, i) => {
                return (
                  <MusicInfoCard
                    key={song.id || i}
                    songInfo={song}
                    setAudio={setAudio}
                    audio={audio}
                  ></MusicInfoCard>
                );
              })
            ) : (
              <h1 className="absolute z-50 text-4xl">Something is wrong</h1>
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
