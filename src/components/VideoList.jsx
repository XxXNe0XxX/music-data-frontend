import PropTypes from "prop-types";
import { LuEye } from "react-icons/lu";
import { BiLike } from "react-icons/bi";
import { FaCommentAlt } from "react-icons/fa";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { GrChannel } from "react-icons/gr";
import { abbreviateNumber } from "../utils/abbreviateNumber";
import { useEffect, useState } from "react";
import { getFlag } from "../services/youtubeService";
import { MdOutlineKeyboardDoubleArrowUp } from "react-icons/md";

function VideoList({ videos, selectedCountry, loading, error }) {
  const [flag, setFlag] = useState("");
  const [flagLoading, setFlagLoading] = useState(false);
  const [flagError, setFlagError] = useState(null);
  const [isOpen, setIsOpen] = useState(true);

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
      } catch (err) {
        console.error("Error fetching flag:", err);
        setFlagError("Error loading flag");
        setFlag("");
      } finally {
        setFlagLoading(false);
      }
    }

    fetchFlag();
    setIsOpen(true);
  }, [selectedCountry]);

  return (
    <>
      <div
        className={`transition-all flex gap-y-1 flex-col max-w-[600px]  ${
          isOpen ? "h-full" : "h-14"
        } transit border-gray-700 border   rounded-xl m-5 backdrop-blur-md shadow-lg shadow-black overflow-hidden`}
      >
        <div className="flex items-center justify-between gap-x-2 text-nowrap  bg-gray-800 px-2 min-h-14 h-auto">
          <h1 className="text-xl w-full">Videos populares</h1>
          <div className="w-full text-nowrap">
            {loading && (
              <h1 className=" text-white rounded-md p-1 bg-blue-700 text-center ">
                Cargando videos...
              </h1>
            )}
            {error && (
              <h1 className=" text-white rounded-md p-1 bg-red-700 text-center md:text-nowrap text-wrap leading-4 ">
                {error}
              </h1>
            )}
          </div>
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className=" text-2xl"
          >
            <MdOutlineKeyboardDoubleArrowUp
              className={`${isOpen ? "" : "rotate-180"} transition-all`}
            ></MdOutlineKeyboardDoubleArrowUp>
          </button>
        </div>
        <div className="flex items-center gap-x-2 px-2 mt-1">
          Seleccionado: {selectedCountry || "..."}
          {flagLoading && <h1>Cargando bandera...</h1>}
          {flagError && <h1>Error al cargar la bandera...</h1>}
          {flag && <img src={flag} className="w-10 h-6 object-cover"></img>}
        </div>
        <div className="p-2">
          {!videos.length ? (
            <p>No hay videos para mostrar.</p>
          ) : (
            <ul className="flex flex-col space-y-2 rounded-xl p-2 ">
              {videos.map((video) => (
                <li
                  key={video.id}
                  className="video-item hover:bg-gray-800 grid group border-b bg-gray-800 border-r rounded-2xl p-2  hover:border-opacity-100 border-opacity-20 "
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                >
                  <a
                    href={`https://www.youtube.com/watch?v=${video.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="flex gap-2 items-center">
                      <img
                        src={video.snippet.thumbnails.default.url}
                        alt={video.snippet.title}
                        className="video-thumbnail"
                      />
                      <h3 className="group-hover:underline">
                        {video.snippet.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-x-1 text-md">
                      <GrChannel className="text-xl mb-1"></GrChannel>
                      <p className="">{video.snippet.channelTitle}</p>
                    </div>
                    <div className="flex  *:flex *:justify-start *:gap-x-2  *:items-center text-gray-400">
                      <p className="w-[20%] flex">
                        <LuEye></LuEye>
                        <span>
                          {abbreviateNumber(video.statistics.viewCount)}
                        </span>
                      </p>
                      <p className="w-[20%] flex">
                        <BiLike></BiLike>
                        {abbreviateNumber(video.statistics.likeCount)}
                      </p>
                      <p className="w-[20%] flex">
                        <FaCommentAlt></FaCommentAlt>
                        {abbreviateNumber(video.statistics.commentCount)}
                      </p>
                      <p className="">
                        <MdOutlineAccessTimeFilled></MdOutlineAccessTimeFilled>
                        {new Date(
                          video.snippet.publishedAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

VideoList.propTypes = {
  videos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      snippet: PropTypes.shape({
        title: PropTypes.string.isRequired,
        channelTitle: PropTypes.string.isRequired,
        thumbnails: PropTypes.shape({
          default: PropTypes.shape({
            url: PropTypes.string.isRequired,
          }).isRequired,
        }).isRequired,
      }).isRequired,
    })
  ).isRequired,
};

export default VideoList;
