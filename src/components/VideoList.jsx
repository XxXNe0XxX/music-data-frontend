import PropTypes from "prop-types";

function VideoList({ videos }) {
  if (!videos.length) {
    return <p>No hay videos para mostrar.</p>;
  }

  return (
    <div className="video-list">
      {videos.map((video) => (
        <div key={video.id} className="video-item">
          <img
            src={video.snippet.thumbnails.default.url}
            alt={video.snippet.title}
            className="video-thumbnail"
          />
          <div className="video-info">
            <h3 className="video-title">{video.snippet.title}</h3>
            <p className="video-channel">{video.snippet.channelTitle}</p>
          </div>
        </div>
      ))}
    </div>
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
