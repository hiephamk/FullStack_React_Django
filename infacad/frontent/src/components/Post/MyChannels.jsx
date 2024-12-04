// MyChanels.js
import PropTypes from "prop-types";
import { useNavigate, Link } from "react-router-dom";


// eslint-disable-next-line react/prop-types
const MyChannels = ({ channels }) => {

  const navigate = useNavigate()
  if (!channels || channels.length === 0) {
    return <div>No channels available.</div>;
  }
  
  return (
    <div>
      <h3>My Channels</h3>
      <ul style={{display:'flex'}}>
        {channels.map((channel) => (
          <li key={channel.id}>
            <Link to = '/home/mychannel/posts' >
              <div className="topic-card">{channel.topicTitle}</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

MyChannels.propTypes = {
  channels: PropTypes.array.isRequired,
};

export default MyChannels;
