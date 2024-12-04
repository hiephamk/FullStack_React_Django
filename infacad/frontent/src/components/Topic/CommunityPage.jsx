import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import useAccessToken from '../../features/auth/token';

function CommunityPage() {
    const { user } = useSelector((state) => state.auth);
    const accessToken = useAccessToken(user);
    const [topics, setTopics] = useState([]);
    const [joinedTopics, setJoinedTopics] = useState([]);

    useEffect(() => {
        const fetchTopicAndSubTopic = async () => {
            if (!accessToken) {
                toast.error('Please Login again!');
                return;
            }
            const topicUrl = `http://127.0.0.1:8000/api/topics/`;
            const config = { headers: { Authorization: `Bearer ${accessToken}` } };

            try {
                const topicRes = await axios.get(topicUrl, config);
                setTopics(topicRes.data);
            } catch (error) {
                console.error('Error fetching topics:', error.response || error.message);
            }
        };

        fetchTopicAndSubTopic();
    }, [accessToken, user]);

    const handleJoin = async (topicId, topicStatus) => {
      const url = `http://127.0.0.1:8000/api/join-topic/${topicId}/`;
      const config = {
          headers: {
              Authorization: `Bearer ${accessToken}`,
          },
      };
  
      try {
          const response = await axios.post(url, {}, config);
          alert(response.data.detail);
          if (topicStatus === "public") {
              setJoinedTopics((prev) => [...prev, topicId]); // Update the local state for public topics
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
            <h1>Community Topics</h1>
            <div className="topics">
                {topics.map((topic) => (
                    <div key={topic.id} className={`topic-card ${topic.status}`}>
                        <h3>{topic.topicTitle}</h3>
                        <p>{topic.topicDescription}</p>
                        <p>{topic.author_name}</p>
                        <p>Status: {topic.status === 'public' ? 'Public' : 'Private'}</p>
                        {joinedTopics.includes(topic.id) ? (
                            <p>You have joined this topic.</p>
                        ) : (
                            <button onClick={() => handleJoin(topic.id, topic.status)}>
                                {topic.status === 'public' ? 'Join' : 'Request to Join'}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CommunityPage;
