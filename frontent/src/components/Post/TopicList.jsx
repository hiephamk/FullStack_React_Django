import {useState, useEffect} from 'react'
import useAccessToken from '../../features/auth/token'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { Outlet, useNavigate } from 'react-router-dom'
import PostAndCommentList from './PostAndCommentList'
import { toast } from 'react-toastify'

const TopicList = () => {
  const {user, userInfo} = useSelector((state) => state.auth)
  const accessToken = useAccessToken(user)
  const navigate = useNavigate()

  const [topics, setTopics] = useState([]);
  const [subtopics, setSubTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);



  useEffect(() => {
    const fetchTopicAndSubTopic = async () => {
      if (!accessToken) {
        console.error('Unable to fetch data: No valid access token.');
        return;
      }
      const topicUrl = `http://127.0.0.1:8000/api/topics/`;
      const subtopicUrl = `http://127.0.0.1:8000/api/subtopics/`;
      const config = { headers: { Authorization: `Bearer ${accessToken}` } };

      try {
        const topicRes = await axios.get(topicUrl, config);
        const subtopicRes = await axios.get(subtopicUrl, config);
        setTopics(topicRes.data);
        setSubTopics(subtopicRes.data);
      } catch (error) {
        toast.error('Please Login again!');
        console.error('Error fetching topics/subtopics:', error.response || error.message);
      }
    };

    if (user?.access) {
      fetchTopicAndSubTopic();
    }
  }, [accessToken, user]);
  const handleTopicClick = (topicId) => {
    setSelectedTopic(selectedTopic === topicId ? null : topicId);
    setSelectedSubtopic(null);
    //navigate(`/community/${topicId}`);
  };
  const handleSubtopicClick = (subtopicId) => {
    setSelectedSubtopic(selectedSubtopic === subtopicId ? null : subtopicId);
    navigate(`/community/${subtopicId}`);
  };
  
  return (
    <div className='container'>
      <div className="left-container">
        <div style={{ borderBottom: '2px solid #1113', marginBottom: '10px', textAlign: 'center' }} >
          <h5>Welcome back, {userInfo.first_name}!</h5>
        </div>
        <h4>Topics</h4>
        <div className='left-content'>
        {topics.map((topic) => (
            <div key={topic.id}>
              <button onClick={() => handleTopicClick(topic.id)} style={{ display: 'block', margin: '5px 0' }}>
                {topic.topicTitle}
              </button>
              {selectedTopic === topic.id && (
                <div style={{ marginLeft: '10px' }}>
                  {subtopics
                    .filter((subtopic) => subtopic.topic === topic.id)
                    .map((subtopic) => (
                      <button
                        key={subtopic.id}
                        onClick={() => handleSubtopicClick(subtopic.id)}
                        style={{ display: 'block', margin: '5px 0' }}
                      >
                        {subtopic.subTopicTitle}
                        {/* {selectedSubtopic === subtopic.id && (
                          <div className='main-container'>
                          <PostAndCommentList subTopicId = {subtopic.id}/>
                        </div>
                        )} */}
                      </button>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default TopicList