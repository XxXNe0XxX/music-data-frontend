import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { LuEye } from "react-icons/lu";
import { BiLike } from "react-icons/bi";
import { FaRegCommentAlt, FaRegClock } from "react-icons/fa";
import { GrChannel } from "react-icons/gr";
import { SlPeople } from "react-icons/sl";
import { LiaFileVideoSolid } from "react-icons/lia";
import { CiCalendarDate } from "react-icons/ci";
import { IoMdMore } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import * as motion from "motion/react-client";
import { abbreviateNumber } from "../utils/abbreviateNumber";
import { AnimatePresence } from "motion/react";
import { IoArrowBackSharp } from "react-icons/io5";
import { ThemeContext } from "../context/ThemeContext";
import { MdCalendarToday } from "react-icons/md";

export default function VideoInfoCard({
  index,
  videoInfo,
  channelInfo,
  handleFetchChannelInfo,
  isOpenChannelInfo,
  setIsOpenChannelInfo,
}) {
  const { isDark } = useContext(ThemeContext);

  // Deconstruct data
  const snippet = videoInfo?.snippet || {};
  const statistics = videoInfo?.statistics || {};

  // Check if this video’s channel matches the loaded `channelInfo`
  const isSameChannel =
    channelInfo && snippet.channelId === channelInfo?.items?.[0]?.id;

  const channelSnippet = channelInfo?.items?.[0]?.snippet;
  const channelStats = channelInfo?.items?.[0]?.statistics;

  return (
    <AnimatePresence>
      <motion.li
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { delay: index * 0.1, duration: 0.3 },
        }}
        exit={{ opacity: 0 }}
        className={`group rounded-md border-opacity-10 shadow-sm shadow-gray-600 overflow-hidden backdrop-blur-xl bg-gradient-to-l ${
          isDark
            ? "from-slate-500/20 to-red-900/80"
            : "from-slate-300/40 to-red-100/90"
        }`}
      >
        {/* --- Top Row: Thumbnail + Title/Channel --- */}
        <div className="flex gap-2 ">
          {/* Thumbnail or channel image */}
          <div
            className={`flex items-center  w-fit max-h-fit justify-center rounded-full  ${
              isSameChannel ? "" : ""
            }  transition-all `}
          >
            {isSameChannel ? (
              <img
                className="object-cover transition-all rounded-full h-22 m-7 "
                src={channelSnippet?.thumbnails?.default?.url}
                alt={channelSnippet?.title || "Channel thumbnail"}
              />
            ) : (
              <img
                className="object-cover transition-all h-28 w-full"
                src={snippet?.thumbnails?.default?.url}
                alt={snippet?.title || "Video thumbnail"}
              />
            )}
          </div>

          {/* Title & Channel link */}
          <div className="flex flex-col justify-between flex-grow transition-all w-full ">
            {isSameChannel ? (
              <h3 className=" leading-6 line-clamp-2 p-1">
                {channelSnippet?.description}
              </h3>
            ) : (
              <a
                href={`https://www.youtube.com/watch?v=${videoInfo.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <h3 className="hover:underline leading-6 line-clamp-2 p-1">
                  {snippet.title}
                </h3>
              </a>
            )}

            {/* Channel name or fetch button */}
            <div className="flex justify-between mb-1">
              {isSameChannel ? (
                <a
                  className="flex items-end gap-x-1 text-md hover:underline"
                  href={`https://youtube.com/${channelSnippet?.customUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <p className=" text-gray-500 text-sm">
                    {channelSnippet?.customUrl}
                  </p>
                </a>
              ) : (
                <button
                  className="flex items-center gap-x-1 text-md hover:underline "
                  onClick={() => handleFetchChannelInfo(snippet.channelId)}
                >
                  <IoMdMore />
                  <GrChannel className="text-md mb-1" />
                  <p className=" text-gray-500 line-clamp-1 text-start text-sm">
                    {snippet.channelTitle}
                  </p>
                </button>
              )}

              {/* Toggle extra channel info */}
              {isSameChannel && (
                <div className=" flex mr-2">
                  <button
                    onClick={() => {
                      handleFetchChannelInfo(null);
                      setIsOpenChannelInfo(false);
                    }}
                  >
                    <IoArrowBackSharp className="mr-2" />
                  </button>
                  <button
                    onClick={() => setIsOpenChannelInfo((prev) => !prev)}
                    className="  "
                  >
                    <FaPlus
                      className={` ${
                        isSameChannel && isOpenChannelInfo ? "rotate-45" : ""
                      } transition-all`}
                    />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Tags list */}
        {!isSameChannel && (
          <div className="flex flex-wrap line-clamp-2 font-light opacity-30 w-full p-1  items-center justify-start">
            {snippet?.tags?.map((tag, i) => {
              if (i < 5 && tag.length < 20) {
                return (
                  <span
                    className="hover:text-blue-600 transition-colors cursor-default ml-2"
                    key={i}
                  >
                    #{tag}
                  </span>
                );
              }
            })}
          </div>
        )}
        {/* --- Stats Row --- */}
        <hr className=" mx-1"></hr>

        {isSameChannel ? (
          // Channel-level stats
          <div className="flex  items-center *:justify-center *:w-full text-xs mt-2 ">
            <p className="flex items-center gap-x-1 ">
              <LuEye />
              <span title="Total channel views">
                {abbreviateNumber(channelStats?.viewCount)}
              </span>
            </p>
            <p className="flex items-center gap-x-1 ">
              <SlPeople />
              <span title="Subscribers">
                {abbreviateNumber(channelStats?.subscriberCount)}
              </span>
            </p>
            <p className="flex items-center gap-x-1 ">
              <LiaFileVideoSolid />
              <span title="Total videos">
                {abbreviateNumber(channelStats?.videoCount)}
              </span>
            </p>
            <p className="flex items-center gap-x-1 ">
              <MdCalendarToday />
              <span title="Channel creation date">
                {new Date(channelSnippet?.publishedAt).toLocaleDateString()}
              </span>
            </p>
          </div>
        ) : (
          // Video-level stats
          <div className="flex  items-center *:justify-center text-xs  *:w-full p-2">
            <p className="flex items-center gap-x-1">
              <LuEye />
              <span title="Total video views">
                {abbreviateNumber(statistics?.viewCount)}
              </span>
            </p>
            <p className="flex items-center gap-x-1">
              <BiLike />
              <span title="Likes">
                {abbreviateNumber(statistics?.likeCount)}
              </span>
            </p>
            <p className="flex items-center gap-x-1">
              <FaRegCommentAlt />
              <span title="Comments">
                {abbreviateNumber(statistics?.commentCount)}
              </span>
            </p>
            <p className="flex items-center gap-x-1">
              <FaRegClock />
              <span title="Video publish date">
                {new Date(snippet?.publishedAt).toLocaleDateString()}
              </span>
            </p>
          </div>
        )}

        {/* --- Collapsible Panel for "More Channel Info" --- */}
        {isSameChannel && (
          <div
            className={`overflow-hidden transition-all duration-300 mt-2 
            ${isOpenChannelInfo ? "max-h-40" : "max-h-0"}
            bg-gray-200 dark:bg-gray-800/50 rounded-md px-2`}
          >
            <h4 className="font-semibold text-lg mb-1">More channel info:</h4>
            <ul className=" text-sm pl-4 list-disc space-y-1">
              <li>Country: {channelSnippet?.country || "N/A"}</li>

              <li>
                Go to:
                <a
                  href={`https://youtube.com/${channelSnippet?.customUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline ml-1"
                >
                  {channelSnippet?.customUrl || "N/A"}
                </a>
              </li>
            </ul>
          </div>
        )}
      </motion.li>
    </AnimatePresence>
  );
}

VideoInfoCard.propTypes = {
  videoInfo: PropTypes.object.isRequired,
  channelInfo: PropTypes.object,
  handleFetchChannelInfo: PropTypes.func.isRequired,
  isOpenChannelInfo: PropTypes.bool,
  setIsOpenChannelInfo: PropTypes.func.isRequired,
};
