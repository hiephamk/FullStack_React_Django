import { useState, useEffect } from 'react'
import useAccessToken from '../../features/auth/token'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const JoinedChanel = () => {
  const { user, userInfo } = useSelector((state) => state.auth)
  const accessToken = useAccessToken(user)
  const navigate = useNavigate()

  const [joinedTopics, setJoinedTopics] = useState([]);
  //const [topics, setTopics] = useState([]);
  const [subtopics, setSubTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);



  useEffect(() => {
    const fetchTopicAndSubTopic = async () => {
      if (!accessToken) {
        toast.error('Please Login again!');
        return;
      }
      const url1 = `http://127.0.0.1:8000/api/membership/`;
      //const url2 = `http://127.0.0.1:8000/api/topics/`;
      const subtopicUrl = `http://127.0.0.1:8000/api/subtopics/`;
      const config = { headers: { Authorization: `Bearer ${accessToken}` } };

      try {

        const resp1 = await axios.get(url1, config)
        ///const resp2 = await axios.get(url2, config)
        const subtopicRes = await axios.get(subtopicUrl, config);

        const status1 = resp1.data.filter((topic) => topic.user == userInfo.id && topic.status == "approved")
        //const status2 = resp2.data.filter((topic) => topic.author == userInfo.id)
        setJoinedTopics(status1)
        //setTopics(status2);
        setSubTopics(subtopicRes.data);
      } catch (error) {

        console.error('Error fetching topics/subtopics:', error.response || error.message);
      }
    };

    if (user?.access) {
      fetchTopicAndSubTopic();
    }
  }, [accessToken, userInfo.id]);

  const handleTopicClick = (topicId) => {
    setSelectedTopic(selectedTopic === topicId ? null : topicId);
    setSelectedSubtopic(null);
    //navigate(`/community/${topicId}`);
  };
  const handleSubtopicClick = (subtopicId) => {
    setSelectedSubtopic(selectedSubtopic === subtopicId ? null : subtopicId);
    navigate(`/home/channels/joinedchannel/posts/${subtopicId}`);
  };

  return (
    <div>
      {
        user ?
          <div>
            <div style={{ backgroundColor: '#fff', boxShadow: '2px 2px #1113', margin: '10px', padding: '10px', borderRadius: '7px' }}>
              <h3>joined chanels</h3>
              {joinedTopics.length > 0 ? (
                joinedTopics.map((topic) => (
                  <ul key={topic.id}>
                    <button onClick={() => handleTopicClick(topic.topic)} style={{ display: 'block', margin: '5px 0' }}>
                      <strong>{topic.topic_name}</strong>
                    </button>
                    {selectedTopic === topic.topic && (
                      <div style={{ marginLeft: '10px' }}>
                        {subtopics
                          .filter((subtopic) => subtopic.topic === topic.topic)
                          .map((subtopic) => (
                            <button
                              key={subtopic.id}
                              onClick={() => handleSubtopicClick(subtopic.id)}
                              style={{ display: 'block', margin: '5px 0' }}
                            >
                              <li>{subtopic.subTopicTitle}</li>
                            </button>
                          ))}
                      </div>
                    )}
                  </ul>
                ))
              ) :
                <p>This channel has no content yet.</p>
              }
            </div>
          </div>
          :
          <p>Pleease Login to see the posts</p>
      }

    </div>
  )
}

export default JoinedChanel