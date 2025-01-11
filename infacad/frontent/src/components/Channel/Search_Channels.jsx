import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import useAccessToken from "../../features/auth/token";

const SearchChannel = () => {
    const { user } = useSelector((state) => state.auth);
    const accessToken = useAccessToken(user);

    const [keyword, setKeyword] = useState("");
    const [channels, setChannels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [joinedChannel, setJoinedChannel] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit

    if (!keyword.trim()) {
      alert("Please enter a keyword to search.");
      return;
    }

    setLoading(true);

    const url = `http://127.0.0.1:8000/api/channels/search-channels/?keyword=${keyword}`;
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    try {
      const response = await axios.get(url, config);
      setChannels(response.data);
    } catch (error) {
      console.error("Error fetching channels:", error);
      alert("Failed to search for channels. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (channelId, channel_type) => {
    const url = `http://127.0.0.1:8000/api/channels/join-channel/${channelId}/`;
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    };

    try {
        const response = await axios.post(url, {}, config);
        //alert(response.data.detail);
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
    <div>
      <div className="container-fluid d-flex justify-content-center align-content-center">
          <form onSubmit={handleSearch} className="d-flex w-75" role="search">
            <input
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Enter keyword to search"
              className="form-control me-2 border border-success"
              
            />
            <button type="submit" className="btn btn-outline-success border border-success">Search</button>
          </form>
      </div>

      {loading && <p>Loading...</p>}

        <div className="channels">
            {
                channels.length > 0 ? (
                    <div>
                        {channels.map((channel) => (
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
                ):(<p>No channels found.</p>)
            }
        </div>
    </div>
  );
};

export default SearchChannel;
