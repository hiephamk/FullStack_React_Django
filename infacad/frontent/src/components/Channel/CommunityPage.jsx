import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import useAccessToken from '../../features/auth/token';
//import { toast } from 'react-toastify';
import SearchChannel from './Search_Channels';

function CommunityPage() {
    const { user } = useSelector((state) => state.auth);
    const accessToken = useAccessToken(user);
    const [Channels, setChannels] = useState([]);
    const [joinedChannel, setJoinedChannel] = useState([]);

    useEffect(() => {
        const fetchTopicAndSubTopic = async () => {
            if (!accessToken) {
                //toast.error('Please Login again!');
                return;
            }
            const topicUrl = `http://127.0.0.1:8000/api/channels/`;
            const config = { headers: { Authorization: `Bearer ${accessToken}` } };

            try {
                const topicRes = await axios.get(topicUrl, config);
                setChannels(topicRes.data);
            } catch (error) {
                console.error('Error fetching topics:', error.response || error.message);
            }
        };

        fetchTopicAndSubTopic();
    }, [accessToken, user]);

    const handleJoin = async (channelId, channel_type) => {
      const url = `http://127.0.0.1:8000/api/channels/join-channel/${channelId}/`;
      const config = {
          headers: {
              Authorization: `Bearer ${accessToken}`,
          },
      };
  
      try {
          const response = await axios.post(url, {}, config);
          alert(response.data.detail);
          if (channel_type === "public") {
              setJoinedChannel((prev) => [...prev, channelId]); // Update the local state for public topics
          }
      } catch (error) {
          if (error.response) {
              alert(error.response.data.detail);
          } else {
              console.error("Error joining topic:", error);
          }
      }
  };
    return (
        <div className="community-page">
            <div>
                <SearchChannel/>
            </div>
            <div className="channels">
                {Channels.map((channel) => (
                    <div key={channel.id}>
                        <div style={{width:'18rem'}}>
                            <div className='channels'>
                                <div className={`card-body ${channel.channel_type}`}>
                                    <h5>{channel.name}</h5>
                                    <p>{channel.description}</p>
                                    <p>Author: {channel.owner_name}</p>
                                    <p>Status: {channel.channel_type === 'public' ? 'Public' : 'Private'}</p>
                                    <button className='btn btn-primary'>
                                        {joinedChannel.includes(channel.id) ? (
                                            <p>You have joined this channel.</p>
                                        ) : (
                                            <button onClick={() => handleJoin(channel.id, channel.status)}>
                                                {channel.channel_type === 'public' ? 'Join' : 'Ask to Join'}
                                            </button>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CommunityPage;
