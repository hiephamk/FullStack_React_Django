import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import useAccessToken from "../../features/auth/token";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateSubTopic = () => {
  const { user, userInfo } = useSelector((state) => state.auth) || {};
  const accessToken = useAccessToken(user);

  const [topics, setTopics] = useState([]);
  const [subtopics, setSubTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newSubtopicTitle, setNewSubtopicTitle] = useState("");
  
  useEffect(() => {
    const fetchTopicsAndSubtopics = async () => {
      if (!accessToken) return;
      const topicUrl = `http://127.0.0.1:8000/api/topics/`;
      const subtopicUrl = `http://127.0.0.1:8000/api/subtopics/`;
      const config = { headers: { Authorization: `Bearer ${accessToken}` } };

      try {
        const [topicRes, subtopicRes] = await Promise.all([
          axios.get(topicUrl, config),
          axios.get(subtopicUrl, config),
        ]);
        setTopics(topicRes.data);
        setSubTopics(subtopicRes.data);
      } catch (error) {
        console.error("Error fetching topics or subtopics:", error.response || error.message);
        toast.error("Failed to fetch topics or subtopics.");
      }
  };

  fetchTopicsAndSubtopics();  }, [accessToken]);
  const handleTopicClick = (topicId) => {
    setSelectedTopic(selectedTopic === topicId ? null : topicId);
  };

  // Handle creating a new topic
  const handleCreateTopic = async () => {
    if (!newTopicTitle) {
      toast.error("Topic title cannot be empty.");
      return;
    }

    const topicUrl = `http://127.0.0.1:8000/api/topics/`;
    const config = { headers: { Authorization: `Bearer ${accessToken}` } };

    try {
      const response = await axios.post(
        topicUrl,
        { topicTitle: newTopicTitle,
          author: userInfo.id,
         },
        config
      );
      setTopics((prev) => [...prev, response.data]);
      setNewTopicTitle("");
      toast.success("Topic created successfully!");
    } catch (error) {
      console.error("Error creating topic:", error.response || error.message);
      toast.error("Failed to create topic.");
    }
  };

  // Handle creating a new subtopic
  const handleCreateSubtopic = async () => {
    if (!newSubtopicTitle || !selectedTopic) {
      toast.error("Subtopic title cannot be empty, and a topic must be selected.");
      return;
    }

    const subtopicUrl = `http://127.0.0.1:8000/api/subtopics/`;
    const config = { headers: { Authorization: `Bearer ${accessToken}` } };

    try {
      const response = await axios.post(
        subtopicUrl,
        { subTopicTitle: newSubtopicTitle, 
          topic: selectedTopic,
          author: userInfo.id
         },
        config
      );
      setSubTopics((prev) => [...prev, response.data]);
      setNewSubtopicTitle("");
      toast.success("Subtopic created successfully!");
    } catch (error) {
      console.error("Error creating subtopic:", error.response || error.message);
      toast.error("Failed to create subtopic.");
    }
  };

  return (
    <div className="page-container">
      {/* Left Sidebar */}
      <div className="left-container">
        <h4>Topics</h4>

        {/* Create Topic */}
        <div>
          <input
            type="text"
            placeholder="New Topic Title"
            value={newTopicTitle}
            onChange={(e) => setNewTopicTitle(e.target.value)}
          />
          <button onClick={handleCreateTopic}>Create Topic</button>
        </div>

        <div className="left-content">
          {topics.map((topic) => (
            <div key={topic.id}>
              <button
                onClick={() => handleTopicClick(topic.id)}
                style={{ display: "block", margin: "5px 0" }}
              >
                {topic.topicTitle}
              </button>

              {/* Subtopics */}
              {selectedTopic === topic.id && (
                <div style={{ marginLeft: "10px" }}>
                  <h5>Subtopics</h5>
                  {subtopics
                    .filter((subtopic) => subtopic.topic === topic.id)
                    .map((subtopic) => (
                      <p key={subtopic.id}>{subtopic.subTopicTitle}</p>
                    ))}
                  {/* Create Subtopic */}
                  <div>
                    <input
                      type="text"
                      placeholder="New Subtopic Title"
                      value={newSubtopicTitle}
                      onChange={(e) => setNewSubtopicTitle(e.target.value)}
                    />
                    <button onClick={handleCreateSubtopic}>
                      Create Subtopic
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default CreateSubTopic;
