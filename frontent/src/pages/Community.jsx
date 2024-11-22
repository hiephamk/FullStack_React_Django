import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import useAccessToken from '../features/auth/token';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateComment from '../components/Post/CreateComment';
import { MdOutlineComment } from "react-icons/md";
import { FaShareFromSquare } from "react-icons/fa6";
import { GrLike } from "react-icons/gr";
import CreatePost from '../components/Post/CreatePost'
import UserImg from '../components/UserImg';
import ProfileImg from '../components/profileImg';
//import CreateSubtopic from '../components/Topic/CreateSubtopic';

const TopicList = () => {
  const { user, userInfo } = useSelector((state) => state.auth) || {};
  const accessToken = useAccessToken(user);

  const [topics, setTopics] = useState([]);
  const [subtopics, setSubTopics] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  const [likedPosts, setLikedPosts] = useState({});
  const [expandedPost, setExpandedPost] = useState(null);
  const [newSubtopicTitle, setNewSubtopicTitle] = useState("");


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
        toast.error('Failed to fetch topics or subtopics.');
        console.error('Error fetching topics/subtopics:', error.response || error.message);
      }
    };

    if (user?.access) {
      fetchTopicAndSubTopic();
    }
  }, [accessToken, user]);

  const fetchPostsBySubtopic = async (subtopicId) => {
    if (!accessToken) {
      console.error('Unable to fetch data: No valid access token.');
      return;
    }
    const postUrl = `http://127.0.0.1:8000/api/posts/?subtopic=${subtopicId}`;
    const config = { headers: { Authorization: `Bearer ${accessToken}` } };

    try {
      const postRes = await axios.get(postUrl, config);
      const sortedPost = postRes.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setPosts(sortedPost);
    } catch (error) {
      toast.error('Failed to fetch posts for this subtopic.');
      console.error('Error fetching posts:', error.response || error.message);
    }
  };
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
  const handleTopicClick = (topicId) => {
    setSelectedTopic(selectedTopic === topicId ? null : topicId);
    setSelectedSubtopic(null);
    setPosts([]);
  };

  const handleSubtopicClick = (subtopicId) => {
    setSelectedSubtopic(subtopicId);
    fetchPostsBySubtopic(subtopicId);
  };

  // Function to handle comment submission
  useEffect(() => {
    const fetchPostAndComment = async () => {
      const commentUrl = `http://127.0.0.1:8000/api/comments/`;

      if (!accessToken) {
        console.error("Unable to fetch data: No valid access token.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      try {
        const commentRes = await axios.get(commentUrl, config);
        const sortedComment = commentRes.data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        setComments(sortedComment);
      } catch (error) {
        console.error("Error fetching data:", error.response || error.message);
      }
    };

    if (user && user.access) {
      fetchPostAndComment()
    }
  },[user, accessToken])

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric'
    });
  };
  const handleLike = async (postId) => {
    if (likedPosts[postId]) {
      toast.warning('You have already liked this post.');
      return;
  }
    if (!accessToken) {
      console.error("Unable to fetch data: No valid access token.");
      return;
    }
      try {
        // Send the API request
        await axios.post(
          `http://127.0.0.1:8000/api/posts/${postId}/like/`,
          { like_count: 1 },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setLikedPosts((prevLikedPosts) => ({
          ...prevLikedPosts,
          [postId]: true,
      }));
        // Update the like count in the posts state
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? { ...post, like_count: post.like_count + 1 }
              : post
          )
        );
      } catch (error) {
        console.error("Error liking the post:", error.response || error.message);
      }
      toast.success('You liked this post.');
  };
  const handleExpandPost = (postId)=>{
    setExpandedPost(expandedPost === postId ? null : postId)
  }
  return (
    <div className="page-container">
      {/* Left Sidebar */}
      <div className="left-container">
        <div style={{borderBottom:'2px solid #1113', marginBottom:'10px', textAlign:'center'}} >
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
                      </button>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Middle Section */}
      <div className="main-container">
        
        <div className='left-content'>
          {topics.map((topic) => (
            <div key={topic.id}>
              {selectedTopic === topic.id && (
                <div style={{ marginLeft: '10px', border:'2px solid #1113', textAlign:'center', borderRadius:'20px'}}>
                  <p style={{fontSize:'24px'}}><strong>Topic: {topic.topicTitle}</strong> </p>
                  {selectedTopic === topic.id && (
                  <div style={{ marginLeft: "10px" }}>
                  <div>
                    <input
                      type="text"
                      placeholder="New Subtopic Title"
                      value={newSubtopicTitle}
                      onChange={(e) => setNewSubtopicTitle(e.target.value)}
                    />
                  
                    <button onClick={handleCreateSubtopic}>
                      Create
                    </button>
                  </div>
                </div>
              )}
                  {subtopics
                    .map((subtopic) => (
                      <div key={subtopic.id} style={{ display: 'block', margin: '5px 0' }} >
                        {selectedSubtopic === subtopic.id && (
                          <div>
                            <strong>Title: {subtopic.subTopicTitle}</strong>
                            <CreatePost subtopicId={selectedSubtopic} setPosts={setPosts} fetchPostsBySubtopic={fetchPostsBySubtopic}/>
                          </div>

                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
        {selectedSubtopic && posts.length > 0 ? (
          <div>
          {posts
            .map((post) => (
            <div key={post.id} className="border rounded-3 my-2" style={{color:'#111', backgroundColor: '#fff', paddingTop:'20px'}}>
              
              <div className="rounded-2" style={{padding:'0 20px 0 20px'}}>
                <div  style={{fontSize:'18px', display:'flex', alignItems:'center'}}>
                  <div>
                    <div>
                      {post.author_profile_img && 
                        <UserImg profileImg={`http://127.0.0.1:8000${post.author_profile_img}`} />
                      }
                    </div>
                  </div>
                  <div className="d-flex flex-column p-2">
                    <span ><strong>{post.author_name}</strong> </span>
                    <span style={{fontSize: '12px'}}> {formatDate(post.created_at)}</span>
                  </div>
                </div>
                <p>{post.content}</p>

                <p style={{color:'blue', borderBottom:'1px solid #1113'}}><strong>{post.like_count} Like</strong></p>
              </div>
              <div style={{display:'flex', borderBottom:'1px solid #1113', justifyContent:'space-between', alignItems:'center',margin:'0 20px 20px', padding:'0 20px auto' }}>
                <button onClick={() => handleLike(post.id)}>
                {likedPosts[post.id] ? '👍 Liked' : <p><GrLike /> Like</p>}
                </button>
                  <div>
                    <MdOutlineComment />
                    <button onClick={() => handleExpandPost(post.id)}>
                      {expandedPost === post.id ? ' collapse' : 'Comment'}
                    </button>
                  </div>
                <button><FaShareFromSquare /> Share</button>
              </div>
              {expandedPost === post.id && (
                <div>
                {
                    comments
                    .filter((comment) => comment.post === post.id)
                    .map((comment) => (
                      <div key={comment.id} style={{display:'flex', alignItems:'center', padding:'20px'}}>
                        <div>
                        {comment.author_profile_img && 
                          <UserImg profileImg={`http://127.0.0.1:8000${comment.author_profile_img}`} />
                        }
                        </div>
                        <p className="d-flex flex-column rounded " style={{backgroundColor:'#f8f8f8',margin:'10px', boxShadow:'2px 2px #1113', padding:'10px'}} >
                          <span ><strong>{comment.author_name}</strong></span>
                          <span style={{fontSize:'12px'}}>{formatDate(comment.created_at)}</span>
                          <span>{comment.text}</span>
                        </p>
                      </div>
                    ))}
                     <div>
                      <CreateComment postId={post.id} comments={comments} setComments={setComments}/>
                      </div>
                  </div>
              )}

            </div>

          ))}
        </div>
        ) : (
          <p></p>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="right-container" style={{ width: '20%', padding: '10px' }}>
        <h4>Additional Content</h4>
        <p>Reserved for future features or widgets.</p>
      </div>

      <ToastContainer />
    </div>
  );
};

export default TopicList;
