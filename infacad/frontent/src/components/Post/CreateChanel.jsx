import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import useAccessToken from "../../features/auth/token";
import MyChannels from "./MyChannels";
import JoinedChanel from "./JoinedChanel";

const CreateChanel = () => {
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);
  const [chanelTitle, setChanelTitle] = useState("");
  const [chanelDescription, setChanelDescription] = useState("");
  const [channels, setChannels] = useState([]);

  // Function to fetch channels
  const fetchChannels = async () => {
    if (!accessToken) return;

    try {
      const response = await axios.get("http://127.0.0.1:8000/api/topics/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Save channels in localStorage
      localStorage.setItem("channels", JSON.stringify(response.data));

      // Update state with fetched channels
      setChannels(response.data);
    } catch (error) {
      console.error("Error fetching channels:", error.response?.data || error.message);
    }
  };

  // Fetch channels from localStorage on component mount
  useEffect(() => {
    const storedChannels = localStorage.getItem("channels");

    if (storedChannels) {
      setChannels(JSON.parse(storedChannels)); // Set from localStorage if available
    } else {
      fetchChannels(); // Otherwise, fetch from API
    }
  }, [accessToken]); // Dependency on accessToken to re-fetch if needed

  const handleCreateChanel = async (e) => {
    e.preventDefault();

    if (!accessToken) {
      console.error("Unable to fetch data: No valid access token.");
      return;
    }

    try {
      // Send POST request to create the channel
      await axios.post(
        "http://127.0.0.1:8000/api/topics/",
        {
          topicTitle: chanelTitle,
          topicDescription: chanelDescription,
          author: userInfo.id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Fetch the updated channels after creation and update localStorage
      await fetchChannels();

      // Clear input fields
      setChanelTitle("");
      setChanelDescription("");
    } catch (error) {
      console.error("Error creating channel:", error.response?.data || error.message);
    }
  };

  return (
    <div>
      <form className="container submit-form" onSubmit={handleCreateChanel}>
        <input
          className="input-title"
          type="text"
          value={chanelTitle}
          onChange={(e) => setChanelTitle(e.target.value)}
          placeholder="Input a name of channel..."
        />
        <input
          className="input-text"
          type="text"
          value={chanelDescription}
          onChange={(e) => setChanelDescription(e.target.value)}
          placeholder="Describe the channel..."
        />
        <br />
        <button className="btn btn-primary btn-submit" type="submit">
          Create
        </button>
      </form>

      {/* Pass the channels as a prop to MyChanels */}
      <MyChannels channels={channels} />
      <JoinedChanel/>
    </div>
  );
};

export default CreateChanel;
