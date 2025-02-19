
import { useState, useEffect } from "react";
import useAccessToken from "../../features/auth/token";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const JoinedChannel = () => {
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);
  const navigate = useNavigate();

  const [joinedChannels, setJoinedChannels] = useState([]);
  const [channels, setChannels] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  // Fetch joined channels and topics
  const fetchJoinedChannels = async () => {
    if (!accessToken) {
      toast.error("Please Login again!");
      return;
    }
    const membershipUrl = `http://127.0.0.1:8000/api/channels/memberships/`;
    const channelUrl = `http://127.0.0.1:8000/api/channels/`;
    const topicUrl = `http://127.0.0.1:8000/api/channels/topics/`;
    const config = { headers: { Authorization: `Bearer ${accessToken}` } };

    try {
      const [memberResp, channelResp, topicResp] = await Promise.all([
        axios.get(membershipUrl, config),
        axios.get(channelUrl, config),
        axios.get(topicUrl, config),
      ]);

      const membershipData = memberResp.data.filter(
        (membership) => membership.user === userInfo?.id && membership.status === "approved"
      );
      setJoinedChannels(membershipData);

      // Filter channels that the user has joined and set them in the state
      const channelData = channelResp.data.filter((channel) =>
        membershipData.some((membership) => membership.channel === channel.id)
      );
      setChannels(channelData);

      // Set topics
      setTopics(topicResp.data);
    } catch (error) {
      console.error("Error fetching joined channels/topics:", error.response || error.message);
      toast.error("Failed to fetch channels or topics.");
    }
  };

  useEffect(() => {
    if (user?.access && userInfo?.id) {
      fetchJoinedChannels();
    }
  }, [accessToken, userInfo?.id]);

  const handleChannelClick = (channelId) => {
    setSelectedChannel(selectedChannel === channelId ? null : channelId);
    setSelectedTopic(null);
    // navigate(`/home/channels/joinedchannel/${channelId}`);
  };

  const handleTopicClick = (topicId) => {
    setSelectedTopic(selectedTopic === topicId ? null : topicId);
    navigate(`/home/channels/joinedchannel/topics/${topicId}`);
  };

  return (
    <div>
      {channels.length > 0 ? (
        channels.map((channel) => (
          <div key={channel.id}>
            <button onClick={() => handleChannelClick(channel.id)}>
              <p style={{boxShadow:'2px 2px #1113',backgroundColor:'#2222', padding:'10px', border:'1px solid #1113',borderRadius:'7px'}}><strong>{channel.name}</strong></p>
            </button>
            {selectedChannel === channel.id && (
              <div style={{ marginLeft: "10px" }}>
                {topics
                  .filter((topic) => topic.channel === channel.id)
                  .map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => handleTopicClick(topic.id)}
                    >
                      <li style={{margin: "5px 0", boxShadow:'2px 2px #1113',backgroundColor:'#1726', padding:'10px', border:'1px solid #1113',borderRadius:'7px'}}>
                        <strong>{topic.topic_title}</strong>
                      </li>
                    </button>
                  ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No approved channels found.</p>
      )}
    </div>
  );
};

export default JoinedChannel;
