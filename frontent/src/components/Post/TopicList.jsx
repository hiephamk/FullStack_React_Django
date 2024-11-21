// import { useState, useEffect} from 'react'
// import { useSelector } from 'react-redux'
// import axios from 'axios'
// //import PostList from './PostList'
// import useAccessToken from '../../features/auth/token'
// import CreateComment from './CreateComment'
// import toast from 'react-toastify'
// import { GrLike } from "react-icons/gr";
// import { MdOutlineComment } from "react-icons/md";
// import { FaShareFromSquare } from "react-icons/fa6";
// import { ToastContainer } from "react-toastify";
// import { FaShare } from "react-icons/fa";

// const TopicList = () => {
//   const { user, userInfo } = useSelector((state) => state.auth)
//   const accessToken = useAccessToken(user)
//   const [topics, setTopic] = useState([])
//   const [subtopics, setSubTopic] = useState([])
//   const [posts, setPosts] = useState([])
//   const [comments, setComments] = useState([])
//   const [likedPosts, setLikedPosts] = useState({});
//   const [expandedPost, setExpandedPost] = useState(null);
//   const [selectedTopic, setSelectedTopic] = useState(null);
//   const [selectedSubtopic, setSelectedSubtopic] = useState(null);

//   useEffect(() => {
//     const fetchTopicAndSubTopic = async () => {
//       const topicUrl = `http://127.0.0.1:8000/api/topics/`
//       const subtopicUrl = `http://127.0.0.1:8000/api/subtopics/`
//       if (!accessToken) {
//         console.error("unable to fetch data: no valid access token.")
//         return;
//       }
//       const config = {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       };
//       try {
//         const topicRes = await axios.get(topicUrl, config);
//         const subtopicRes = await axios.get(subtopicUrl, config);
//         const sortedTopic = topicRes.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
//         const sortedSubTopic = subtopicRes.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
//         setTopic(sortedTopic)
//         setSubTopic(sortedSubTopic)
//       }catch (error){
//         console.error("error fetching data", error.response || error.message)
//       }
//     };
//     const fetchPostAndComment = async () => {
//       const postUrl = `http://127.0.0.1:8000/api/posts/`;
//       const commentUrl = `http://127.0.0.1:8000/api/comments/`;
    
//       if (!accessToken) {
//         console.error("Unable to fetch data: No valid access token.");
//         return;
//       }
    
//       const config = {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       };
    
//       try {
//         const postRes = await axios.get(postUrl, config);
//         const commentRes = await axios.get(commentUrl, config);
//         const sortedPosts = postRes.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
//         const sortedComment = commentRes.data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
//         setPosts(sortedPosts);
//         setComments(sortedComment);
//       } catch (error) {
//         console.error("Error fetching data:", error.response || error.message);
//       }
//     };
//     if(user && user.access) {
//       fetchTopicAndSubTopic();
//       fetchPostAndComment();
//     }
//   },[accessToken,user])


//   const fetchPostsBySubtopic = async (subtopicId) => {
//     const postUrl = `http://127.0.0.1:8000/api/posts/?subtopic=${subtopicId}`;

//     const config = {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     };

//     try {
//       const postRes = await axios.get(postUrl, config);
//       setPosts(postRes.data);
//     } catch (error) {
//       console.error("Error fetching posts", error.response || error.message);
//     }
//   };

//   const handleTopicClick = (topicId) => {
//     setSelectedTopic(selectedTopic === topicId ? null : topicId); // Toggle topic selection
//     setSelectedSubtopic(null); // Clear subtopic selection
//     setPosts([]); // Clear posts
//   };

//   const handleSubtopicClick = (subtopicId) => {
//     setSelectedSubtopic(subtopicId);
//     fetchPostsBySubtopic(subtopicId);
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric',
//       hour: 'numeric'
//     });
//   };
//   const handleLike = async (postId) => {
//     if (likedPosts[postId]) {
//       toast.warning('You have already liked this post.');
//       return;
//   }
//     if (!accessToken) {
//       console.error("Unable to fetch data: No valid access token.");
//       return;
//     }
//       try {
//         // Send the API request
//         await axios.post(
//           `http://127.0.0.1:8000/api/posts/${postId}/like/`,
//           { like_count: 1 },
//           {
//             headers: {
//               Authorization: `Bearer ${accessToken}`,
//             },
//           }
//         );
//         setLikedPosts((prevLikedPosts) => ({
//           ...prevLikedPosts,
//           [postId]: true,
//       }));
//         // Update the like count in the posts state
//         setPosts((prevPosts) =>
//           prevPosts.map((post) =>
//             post.id === postId
//               ? { ...post, like_count: post.like_count + 1 }
//               : post
//           )
//         );
//       } catch (error) {
//         console.error("Error liking the post:", error.response || error.message);
//       }
//         toast.success('You liked this post.');
//       };
//         const handleExpandPost = (postId)=>{
//         setExpandedPost(expandedPost === postId ? null : postId)
//       }
//   return (
//     <div className='page-container' style={{ color: "#fff", backgroundColor: "#4682B4", padding: "20px" }}>
//       <h1>Topics</h1>
//       {topics.map((topic) => (
//         <div key={topic.id} className='left-container'>
//           <button onClick={() => handleTopicClick(topic.id)}>
//             {topic.topicTitle}
//           </button>
//           {selectedTopic === topic.id && (
//             <div style={{ marginLeft: "20px", display:'flex', flexDirection:'column' }}>
//               {subtopics
//                 .filter((subtopic) => subtopic.topic === topic.id)
//                 .map((subtopic) => (
//                   <button
//                     key={subtopic.id}
//                     onClick={() => handleSubtopicClick(subtopic.id)}
//                   >
//                     {subtopic.subTopicTitle}
//                   </button>
//                 ))}
//             </div>
//           )}
//         </div>
//       ))}
//       {selectedSubtopic && (
//         <div className='main-container' style={{ marginTop: "20px" }}>
//           <h2>Posts</h2>
//           <div>
//               {posts
//                 .filter((post) => post.subtopic === selectedSubtopic)
//                 .map((post) => (
//                 <div key={post.id} className="border rounded-3 my-2" style={{color:'#fff', backgroundColor: '#4682B4', paddingTop:'20px'}}>
//                   <div className="rounded-2" style={{padding:'0 20px 0 20px'}}>
//                     <div className="d-flex flex-column p-2" style={{fontSize:'18px'}}>
//                       <span ><strong>{post.author_name}</strong> </span>
//                       <span style={{fontSize: '12px'}}> {formatDate(post.created_at)}</span>
//                     </div>
//                     <p>{post.content}</p>
//                     <p style={{color:'blue', borderBottom:'1px solid #fff'}}><strong>{post.like_count} Like</strong></p>
//                   </div>
//                   <div style={{display:'flex', justifyContent:'space-between', alignItems:'center',margin:'0 0 20px', padding:'0 20px auto', borderBottom:'1px solid #fff' }}>
//                     <button onClick={() => handleLike(post.id)}>
//                     {likedPosts[post.id] ? '👍 Liked' : <p><GrLike /> Like</p>}
//                     </button>
//                       <div>
//                         <MdOutlineComment />
//                         <button onClick={() => handleExpandPost(post.id)}>
//                           {expandedPost === post.id ? ' collapse' : 'Comment'}
//                         </button>
//                       </div>
//                     <button><FaShareFromSquare /> Share</button>
//                   </div>
//                   {expandedPost === post.id && (
//                     <div>
//                     {
//                         comments
//                         .filter((comment) => comment.post === post.id)
//                         .map((comment) => (
//                           <div key={comment.id} className="border border-1 rounded p-2 m-3" style={{backgroundColor:'#4682b4'}}>
//                             <div className="d-flex flex-column ">
//                               <span><strong>{comment.author_name}</strong></span>
//                               <span style={{fontSize:'12px'}}>{formatDate(comment.created_at)}</span>
//                             </div>
//                             <p>{comment.text}</p>
//                           </div>
//                         ))}
//                          <CreateComment postId={post.id} comments={comments} setComments={setComments}/>
//                       </div>
//                   )}

//                 </div>

//               ))}
//             </div>
//         </div>
//       )}
//     <ToastContainer />
//     </div>
//   )
// }

// export default TopicList


import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import useAccessToken from '../../features/auth/token';
import CreateComment from './CreateComment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GrLike } from 'react-icons/gr';
import { MdOutlineComment } from 'react-icons/md';
import { FaShare } from 'react-icons/fa';

const TopicList = () => {
  const { user } = useSelector((state) => state.auth) || {};
  const accessToken = useAccessToken(user);

  const [topics, setTopics] = useState([]);
  const [subtopics, setSubTopics] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [expandedPost, setExpandedPost] = useState(null);
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
        setTopics(topicRes.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
        setSubTopics(subtopicRes.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
      } catch (error) {
        toast.error('Failed to fetch topics or subtopics.');
        console.error('Error fetching topics/subtopics:', error.response || error.message);
      }
    };

    const fetchPostAndComment = async () => {
      if (!accessToken) {
        console.error('Unable to fetch data: No valid access token.');
        return;
      }
      const postUrl = `http://127.0.0.1:8000/api/posts/`;
      const commentUrl = `http://127.0.0.1:8000/api/comments/`;
      const config = { headers: { Authorization: `Bearer ${accessToken}` } };

      try {
        const postRes = await axios.get(postUrl, config);
        const commentRes = await axios.get(commentUrl, config);
        setPosts(postRes.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
        setComments(commentRes.data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)));
      } catch (error) {
        toast.error('Failed to fetch posts or comments.');
        console.error('Error fetching posts/comments:', error.response || error.message);
      }
    };

    if (user?.access) {
      fetchTopicAndSubTopic();
      fetchPostAndComment();
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
      setPosts(postRes.data);
    } catch (error) {
      toast.error('Failed to fetch posts for this subtopic.');
      console.error('Error fetching posts:', error.response || error.message);
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

  const handleLike = async (postId) => {
    if (likedPosts[postId]) {
      toast.warning('You have already liked this post.');
      return;
    }
    if (!accessToken) {
      console.error('Unable to fetch data: No valid access token.');
      return;
    }
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/posts/${postId}/like/`,
        { like_count: 1 },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setLikedPosts((prev) => ({ ...prev, [postId]: true }));
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, like_count: post.like_count + 1 } : post
        )
      );
      toast.success('You liked this post.');
    } catch (error) {
      toast.error('Error liking the post.');
      console.error('Error liking post:', error.response || error.message);
    }
  };

  const handleExpandPost = (postId) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
    });
  };

  return (
    <div className='page-container' style={{ color: '#fff', backgroundColor: '#4682B4', padding: '20px' }}>
      <ToastContainer />
      {topics.map((topic) => (
        <div key={topic.id} className='left-container'>
          <button onClick={() => handleTopicClick(topic.id)}>{topic.topicTitle}</button>
          {selectedTopic === topic.id && (
            <div style={{ marginLeft: '20px', display: 'flex', flexDirection: 'column' }}>
              {subtopics
                .filter((subtopic) => subtopic.topic === topic.id)
                .map((subtopic) => (
                  <button key={subtopic.id} onClick={() => handleSubtopicClick(subtopic.id)}>
                    {subtopic.subTopicTitle}
                  </button>
                ))}
            </div>
          )}
        </div>
      ))}
      {selectedSubtopic && (
        <div className='main-container' style={{ marginTop: '20px' }}>
          <h2>Posts</h2>
          {
            posts
            .filter((post) => post.selectedSubtopic === subtopics.id)
            .map((post) => (
              <div key={post.id}>
                <p>{post.content}</p>
              </div>
            ))
          }
          {/* <div>
            {posts
              .filter((post) => post.subtopic === selectedSubtopic)
              .map((post) => (
                <div key={post.id} className='border rounded-3 my-2' style={{ color: '#fff', backgroundColor: '#4682B4', paddingTop: '20px' }}>
                  <div className='rounded-2' style={{ padding: '0 20px 0 20px' }}>
                    <div className='d-flex flex-column p-2' style={{ fontSize: '18px' }}>
                      <span>
                        <strong>{post.author_name}</strong>
                      </span>
                      <span style={{ fontSize: '12px' }}> {formatDate(post.created_at)}</span>
                    </div>
                    <p>{post.content}</p>
                    <p style={{ color: 'blue', borderBottom: '1px solid #fff' }}>
                      <strong>{post.like_count} Like</strong>
                    </p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 20px', padding: '0 20px auto', borderBottom: '1px solid #fff' }}>
                    <button onClick={() => handleLike(post.id)}>
                      {likedPosts[post.id] ? '👍 Liked' : <p><GrLike /> Like</p>}
                    </button>
                    <div>
                      <MdOutlineComment />
                      <button onClick={() => handleExpandPost(post.id)}>
                        {expandedPost === post.id ? 'Collapse' : 'Comment'}
                      </button>
                    </div>
                    <button>
                      <FaShare /> Share
                    </button>
                  </div>
                  {expandedPost === post.id && (
                    <div>
                      {comments
                        .filter((comment) => comment.post === post.id)
                        .map((comment) => (
                          <div key={comment.id} className='border border-1 rounded p-2 m-3' style={{ backgroundColor: '#4682b4' }}>
                            <div className='d-flex flex-column'>
                              <span>
                                <strong>{comment.author_name}</strong>
                              </span>
                              <span style={{ fontSize: '12px' }}>{formatDate(comment.created_at)}</span>
                            </div>
                            <p>{comment.text}</p>
                          </div>
                        ))}
                      <CreateComment postId={post.id} accessToken={accessToken} setComments={setComments} />
                    </div>
                  )}
                </div>
              ))}
          </div> */}
        </div>
      )}
    </div>
  );
};

export default TopicList;
