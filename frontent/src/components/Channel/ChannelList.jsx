
import { useState, useEffect } from "react";
import useAccessToken from "../../features/auth/token";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


const ChannelList = () => {
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);
  const navigate = useNavigate();

  const [channels, setChannels] = useState([]);
  const [Topics, setTopics] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  // Fetch topics and subtopics from the server
  const fetchChannel = async () => {
    if (!accessToken) {
      toast.error("Please Login again!");
      return;
    }
    // const membershipUrl = `http://127.0.0.1:8000/api/channels/memberships/`;
    const channelUrl = `http://127.0.0.1:8000/api/channels/`;
    const topicUrl = `http://127.0.0.1:8000/api/channels/topics/`;
    const config = { headers: { Authorization: `Bearer ${accessToken}` } };

    try {
      // const memberResp = await axios.get(membershipUrl, config);
      const channelResp = await axios.get(channelUrl, config);
      const topicResp = await axios.get(topicUrl, config);

      // const membershipData = memberResp.data.filter(
      //   (channel) => channel.user === userInfo.id && channel.status === "approved"
      // );
      const channelData = channelResp.data.filter((channel) => channel.owner === userInfo.id);
      // setJoinedChannel(membershipData);
      setChannels(channelData);
      setTopics(topicResp.data);
    } catch (error) {
      console.error("Error fetching topics/subtopics:", error.response || error.message);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    if (user?.access && userInfo?.id) {
      fetchChannel();
    }
  }, [accessToken, userInfo.id]);

  const handleChannelClick = (channelId) => {
    setSelectedChannel(selectedChannel === channelId ? null : channelId);
    setSelectedTopic(null);
    navigate(`/home/channels/mychannel/${channelId}`);
  };

  const handleTopicClick = (topicId) => {
    setSelectedTopic(selectedTopic === topicId ? null : topicId);
    navigate(`/home/channels/mychannel/topics/${topicId}`);
  };
  return (
    <div>
      {user ? (
          <div>
            <div>
              {channels.map((channel) => (
                <div key={channel.id}>
                  <button
                    onClick={() => handleChannelClick(channel.id)}
                  >
                    <p style={{boxShadow:'2px 2px #1113',backgroundColor:'#2222', padding:'10px', border:'1px solid #1113',borderRadius:'7px'}}><strong>{channel.name}</strong></p>
                  </button>
                  {selectedChannel === channel.id && (
                    <div>
                      {Topics
                        .filter((topic) => topic.channel === channel.id)
                        .map((topic) => (
                          <button
                            key={topic.id}
                            onClick={() => handleTopicClick(topic.id)}
                          >
                            <li style={{margin: "5px", boxShadow:'2px 2px #1113',backgroundColor:'#1726', padding:'10px', border:'1px solid #1113',borderRadius:'7px'}}>
                              <strong>{topic.topic_title}</strong>
                            </li>
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
        </div>
      ) : (
        <p>Please Login to see the posts</p>
      )}
    </div>
  );
};

export default ChannelList;
