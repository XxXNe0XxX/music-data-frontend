import PropTypes from "prop-types";
import { useState } from "react";
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

export default function VideoInfoCard({
  videoInfo,
  channelInfo,
  handleFetchChannelInfo,
  isOpenChannelInfo,
  setIsOpenChannelInfo,
}) {
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
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        key={videoInfo.id}
        className="group rounded-md p-1 border-opacity-10 shadow-sm shadow-white overflow-hidden"
      >
        {/* --- Top Row: Thumbnail + Title/Channel --- */}
        <div className="flex gap-2">
          {/* Thumbnail or channel image */}
          <div
            className={`flex items-center w-24 h-20 rounded-full  ${
              isSameChannel ? "overflow-hidden" : ""
            }  transition-all `}
          >
            {isSameChannel ? (
              <img
                className="object-cover transition-all"
                src={channelSnippet?.thumbnails?.default?.url}
                alt={channelSnippet?.title || "Channel thumbnail"}
              />
            ) : (
              <img
                className="object-cover transition-all"
                src={snippet.thumbnails?.default?.url}
                alt={snippet.title}
              />
            )}
          </div>

          {/* Title & Channel link */}
          <div className="flex flex-col justify-between max-h-20 transition-all w-full ">
            {isSameChannel ? (
              <h3 className=" leading-6 h-full overflow-hidden line-clamp-2">
                {channelSnippet?.description}
              </h3>
            ) : (
              <a
                href={`https://www.youtube.com/watch?v=${videoInfo.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <h3 className="hover:underline leading-6 line-clamp-2">
                  {snippet.title}
                </h3>
              </a>
            )}

            {/* Channel name or fetch button */}
            <div className="flex justify-between">
              {isSameChannel ? (
                <a
                  className="flex items-end gap-x-1 text-md hover:underline"
                  href={`https://youtube.com/${channelSnippet?.customUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <p className="font-semibold">{channelSnippet?.customUrl}</p>
                </a>
              ) : (
                <button
                  className="flex items-center gap-x-1 text-md hover:underline"
                  onClick={() => handleFetchChannelInfo(snippet.channelId)}
                >
                  <GrChannel className="text-xl mb-1" />
                  <p className="font-semibold">{snippet.channelTitle}</p>
                  <IoMdMore />
                </button>
              )}

              {/* Toggle extra channel info */}
              {isSameChannel && (
                <div className=" flex mr-2">
                  <button onClick={() => {}}>
                    <IoArrowBackSharp className="mr-2" />
                  </button>
                  <button
                    onClick={() => setIsOpenChannelInfo((prev) => !prev)}
                    className="text-white"
                  >
                    <FaPlus
                      className={`${
                        isSameChannel && isOpenChannelInfo ? "rotate-45" : ""
                      } transition-all`}
                    />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- Stats Row --- */}
        {isSameChannel ? (
          // Channel-level stats
          <div className="flex  items-center justify-between text-gray-400 w-full *:w-full  *:pl-2 ">
            <p className="flex items-center gap-x-1 ">
              <LuEye />
              <span>{abbreviateNumber(channelStats?.viewCount)}</span>
            </p>
            <p className="flex items-center gap-x-1 ">
              <SlPeople />
              {abbreviateNumber(channelStats?.subscriberCount)}
            </p>
            <p className="flex items-center gap-x-1 ">
              <LiaFileVideoSolid />
              {abbreviateNumber(channelStats?.videoCount)}
            </p>
            <p className="flex items-center gap-x-1 ">
              <CiCalendarDate />
              {new Date(channelSnippet?.publishedAt).toLocaleDateString()}
            </p>
          </div>
        ) : (
          // Video-level stats
          <div className="flex  items-center justify-between text-gray-400 *:w-full  *:pl-2 ">
            <p className="flex items-center gap-x-1">
              <LuEye />
              {abbreviateNumber(statistics?.viewCount)}
            </p>
            <p className="flex items-center gap-x-1">
              <BiLike />
              {abbreviateNumber(statistics?.likeCount)}
            </p>
            <p className="flex items-center gap-x-1">
              <FaRegCommentAlt />
              {abbreviateNumber(statistics?.commentCount)}
            </p>
            <p className="flex items-center gap-x-1">
              <FaRegClock />
              {new Date(snippet?.publishedAt).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* --- Collapsible Panel for "More Channel Info" --- */}
        {isSameChannel && (
          <div
            className={`overflow-hidden transition-all duration-300 mt-2 
            ${isOpenChannelInfo ? "max-h-40" : "max-h-0"}
            bg-gray-800/50 rounded-md px-2`}
          >
            <h4 className="font-semibold text-lg mb-1">
              Más información del canal:
            </h4>
            <ul className="text-gray-200 text-sm pl-4 list-disc space-y-1">
              <li>País: {channelSnippet?.country || "N/A"}</li>

              <li>
                Ir a:
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

VideoInfoCard.defaultProps = {
  channelInfo: null,
  isOpenChannelInfo: false,
};
