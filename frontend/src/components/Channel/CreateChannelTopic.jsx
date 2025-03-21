

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
//import { toast } from "react-toastify";
import useAccessToken from "../../features/auth/token";

// eslint-disable-next-line react/prop-types
const CreateChannelTopic = ({ onTopicCreated }) => {
  const { channelId } = useParams();
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);
  const navigate = useNavigate();

  const [topic_title, setTopic_title] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null); // State for file (image/video)

  const handleCreateChannelTopic = async (e) => {
    e.preventDefault();

    if (!topic_title.trim() || (!content.trim() && !file)) {
      //toast.error("Subtopic title and either content or file are required.");
      return;
    }

    try {
      const topicUrl = `http://127.0.0.1:8000/api/channels/topics/`;
      const postUrl = `http://127.0.0.1:8000/api/channels/topics/posts/`;
      const config = { headers: { Authorization: `Bearer ${accessToken}` } };

      // Create subtopic
      const topicResp = await axios.post(topicUrl,
        {
          topic_title: topic_title,
          channel: channelId,
        },
        config
      );

      const topicId = topicResp.data.id;

      // Prepare FormData for file and content
      const formData = new FormData();
        formData.append("content", content);
        formData.append("topic", topicId);
        formData.append("owner", userInfo.id);
        if (file) {
          formData.append("file", file); // Attach the file here
        }

        // Log FormData to ensure the file is attached
        for (let pair of formData.entries()) {
          console.log(pair[0], pair[1]);
        }

      // Create post
      const postResponse = await axios.post(postUrl, formData, {
        headers: {
          ...config.headers,
          "Content-Type": "multipart/form-data",
        },
      });

      const postData = postResponse.data;

      // Notify parent component
      if (onTopicCreated) {
        onTopicCreated({
          topic: topicId,
          post: postData,
        });
      }

      //toast.success("Topic and post created successfully!");
      setTopic_title("");
      setContent("");
      setFile(null);

      navigate(`/home/channels/mychannel/topics/${topicId}`);
    } catch (error) {
      console.error("Error creating subtopic and post:", error.response?.data || error.message);
      //toast.error("Failed to create subtopic and post.");
    }
  };

  return (
    <div style={{ margin: "20px", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
      <h3>Create Post for channel</h3>
      <form onSubmit={handleCreateChannelTopic}>
        <input
          type="text"
          value={topic_title}
          onChange={(e) => setTopic_title(e.target.value)}
          placeholder="Post Title"
          style={{ display: "block", margin: "10px 0", width: "100%", padding:"10px" }}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Post details"
          style={{ display: "block", margin: "10px 0", width: "100%", padding:"10px" }}
        />
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setFile(e.target.files[0])} // Handle file selection
          style={{ display: "block", margin: "10px 0", borderRadius:'7px' }}
        />
        <button type="submit" className="btn btn-primary">
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreateChannelTopic;
