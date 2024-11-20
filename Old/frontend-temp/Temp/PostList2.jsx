
// import { useState, useEffect} from 'react'
// import axios from 'axios';
// //import { useSelector } from 'react-redux';
// import CreateNewComment from './CreateNewComment';
// import { BiSolidCommentDetail } from "react-icons/bi";
// import { FaShareFromSquare } from "react-icons/fa6";
// import ReactQuill from 'react-quill';
// import UserImg from '../components/UserImg';
// import { SlLike } from "react-icons/sl";


// const PostList = () => {
//   const [posts, setPosts] = useState([]);
//   const [comments, setComment] = useState([]);
//   const [isLiked, setIsLiked] = useState(false);
//   //const { userInfo } = useSelector((state) => state.auth);

//   useEffect(() => {
//     const fetchPostsAndComments = async () => {
//       try {
//         const postResponse = await axios.get('http://127.0.0.1:8000/api/posts/');
//         const commentResponse = await axios.get('http://127.0.0.1:8000/api/comments/');
        
//         // Sort posts by `created_at` in descending order
//         const sortedPosts = postResponse.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
//         setPosts(sortedPosts);
//         setComment(commentResponse.data);
        
//       } catch (error) {
//         console.error("Error fetching posts or comments:", error);
//       }
//     };

//     fetchPostsAndComments();
//   }, []);

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric',
//       hour: 'numeric'
//     });
//   };
  

//     // Function to toggle the like status
//     const handleLike = () => {
//         setIsLiked((prev) => !prev);
//     };
//   return (
//     <div>
//       {posts.map((post) => (
//         <div key={post.id}>
//           <div className="post-container">
//             <div className="post-content">
//               <div className="post-text">
//                 <div className="post-title-box">
//                     <a href='/home/profile' className="profile-img-post">
//                       {/* Generate the full URL for the profile image */}
//                       {post.author_profile_img && 
//                         <UserImg profileImg={`http://127.0.0.1:8000${post.author_profile_img}`} />
//                       }
//                     </a>
//                     <div className='post-title-text-box'>
//                       <h5><a href='/home/profile'><strong>{post.author_name}</strong></a></h5>
//                       <p>{formatDate(post.created_at)}</p>
//                     </div>
//                 </div>
//                 <div className="post-text-content">
//                   <ReactQuill
//                       value={post.content}
//                       readOnly={true}
//                       theme="bubble" // or "snow" if you want toolbar styling
//                   />
//               <button onClick={handleLike}>
//                 {isLiked ? '<SlLike /> Like' : <p style={{color:'blue', fontSize:'18px'}}>'👍 Like'</p>} 
//               </button>
//                 </div>
//               </div>
//               <div className="post-text-icon">
//                 <div><BiSolidCommentDetail /><span>Comment</span></div>
//                 <div><FaShareFromSquare /><span>Share</span></div>
//               </div>
//             </div>

//             <div className="comment-container">
//               <div className="comment-content">
//                 {comments
//                   .filter((comment) => comment.post === post.id)
//                   .map((comment) => (
//                     <div key={comment.id} className="comment-box-container">
//                       <div className="profile-img-post">
//                         {/* Generate the full URL for the profile image */}
//                         {post.author_profile_img && 
//                           <UserImg profileImg={`http://127.0.0.1:8000${comment.author_profile_img}`} />
//                         }
//                       </div>
//                       <div className='comment-text-box'>
//                         <span><a href='/home/profile'><strong>{comment.author_name}</strong></a></span>
//                         <span>{formatDate(comment.created_at)}</span>
//                         <p>{comment.text}</p>
//                       </div>
//                     </div>
//                   ))}
//                 <div>
//                   <CreateNewComment postId={post.id} />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default PostList;

import { useState, useEffect } from 'react';
import axios from 'axios';
import CreateNewComment from '../pages/CreateNewComment';
import { BiSolidCommentDetail } from "react-icons/bi";
import { FaShareFromSquare } from "react-icons/fa6";
import ReactQuill from 'react-quill';
import UserImg from '../components/UserImg';
import { SlLike } from "react-icons/sl";
//import { useSelector } from 'react-redux';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  //const { userInfo } = useSelector((state) => state.auth)

  useEffect(() => {
    const fetchPostsAndComments = async () => {
      try {
        const postResponse = await axios.get('http://127.0.0.1:8000/api/posts/');
        const commentResponse = await axios.get('http://127.0.0.1:8000/api/comments/');
        
        // Sort posts by `created_at` in descending order
        const sortedPosts = postResponse.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        // Add `isLiked` and `likeCount` to each post object
        const updatedPosts = sortedPosts.map(post => ({
          ...post,
          isLiked: false,           // Track if the post is liked
          likeCount: post.likeCount || 0  // Initial like count from the backend, defaulting to 0 if not provided
        }));
        
        setPosts(updatedPosts);
        setComments(commentResponse.data);
        
      } catch (error) {
        console.error("Error fetching posts or comments:", error);
      }
    };

    fetchPostsAndComments();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric'
    });
  };

  // Function to toggle the like status for a specific post
  const handleLike = async (postId, isCurrentlyLiked) => {
    const action = isCurrentlyLiked ? 'unlike' : 'like';

    try {
        const response = await axios.post(`http://127.0.0.1:8000/api/posts/${postId}/like/`, {
            [action]: true
        });

        setPosts(prevPosts =>
            prevPosts.map(post => {
                if (post.id === postId) {
                    return { ...post, isLiked: !post.isLiked, likeCount: response.data.like_count };
                }
                return post;
            })
        );
    } catch (error) {
        console.error("Failed to update like count:", error);
    }
    window.location.reload();
};


  return (
    <div>
      {posts.map((post) => (
        
        <div key={post.id}>
          <div className="post-container">
            <div className="post-content">
              <div className="post-text">
                <div className="post-title-box">
                    <a href='/home/profile' className="profile-img-post">
                      {/* Generate the full URL for the profile image */}
                      {post.author_profile_img && 
                        <UserImg profileImg={`http://127.0.0.1:8000${post.author_profile_img}`} />
                      }
                    </a>
                    <div className='post-title-text-box'>
                      <h5><a href='/home/profile'><strong>{post.author_name}</strong></a></h5>
                      <p>{formatDate(post.created_at)}</p>
                    </div>
                </div>
                <div className="post-text-content">
                  <ReactQuill
                    value={post.content}
                    readOnly={true}
                    theme="bubble"
                  />
                  <p>{post.like_count} {post.like_count === 1 ? 'Like' : 'Likes'}</p>
                </div>
                
              </div>
              <div className="post-text-icon">
                  <button onClick={() => handleLike(post.id)}>
                    {post.isLiked ? <span style={{color: 'blue', fontSize: '18px'}}>👍</span> : <SlLike />}
                    <span style={{color:'blue'}}> Like</span>
                  </button>
                <div><BiSolidCommentDetail /><span> Comment</span></div>
                <div><FaShareFromSquare /><span> Share</span></div>
              </div>
            </div>

            <div className="comment-container">
              <div className="comment-content">
                {comments
                  .filter((comment) => comment.post === post.id)
                  .map((comment) => (
                    <div key={comment.id} className="comment-box-container">
                      <div className="profile-img-post">
                        {comment.author_profile_img && 
                          <UserImg profileImg={`http://127.0.0.1:8000${comment.author_profile_img}`} />
                        }
                      </div>
                      <div className='comment-text-box'>
                        <span><a href='/home/profile'><strong>{comment.author_name}</strong></a></span>
                        <span>{formatDate(comment.created_at)}</span>
                        <p>{comment.text}</p>
                      </div>
                    </div>
                  ))}
                <div>
                  <CreateNewComment postId={post.id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;

// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import ReactQuill from 'react-quill';
// import { BiSolidCommentDetail } from "react-icons/bi";
// import { FaShareFromSquare } from "react-icons/fa6";
// import { SlLike } from "react-icons/sl";
// import UserImg from '../components/UserImg';
// import CreateNewComment from './CreateNewComment';

// const PostList = () => {
//   const [posts, setPosts] = useState([]);
//   const [comments, setComments] = useState([]);
//   const [likedPosts, setLikedPosts] = useState({});  // Track like status for each post

//   // To handle Collapse/Expand functionality
//   const [expandedPost, setExpandedPost] = useState(null);
//   const [expandedComment, setExpandedComment] = useState(null);

//   useEffect(() => {
//     const fetchPostsAndComments = async () => {
//       try {
//         const postResponse = await axios.get('http://127.0.0.1:8000/api/posts/');
//         const commentResponse = await axios.get('http://127.0.0.1:8000/api/comments/');
        
//         // Sort posts by `created_at` in descending order
//         const sortedPosts = postResponse.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
//         setPosts(sortedPosts);
//         setComments(commentResponse.data);
//       } catch (error) {
//         console.error("Error fetching posts or comments:", error);
//       }
//     };

//     fetchPostsAndComments();
//   }, []);

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric',
//       hour: 'numeric'
//     });
//   };

//   // Function to toggle like status for a specific post
//   const handleLike = async (postId, isCurrentlyLiked) => {
//         const action = isCurrentlyLiked ? 'unlike' : 'like';
    
//         try {
//             const response = await axios.post(`http://127.0.0.1:8000/api/posts/${postId}/like/`, {
//                 [action]: true
//             });
    
//             setPosts(prevPosts =>
//                 prevPosts.map(post => {
//                     if (post.id === postId) {
//                         return { ...post, isLiked: !post.isLiked, likeCount: response.data.like_count };
//                     }
//                     return post;
//                 })
//             );
//         } catch (error) {
//             console.error("Failed to update like count:", error);
//         }
//         window.location.reload();
//     };


//   // Function to toggle the collapse/expand for users who liked the post

//   const handleCommentExpand = (postId) => {
//     setExpandedComment(expandedComment === postId ? null : postId);
//   };

//   return (
//     <div>
//       {posts.map((post) => (
//         <div key={post.id} className="post-container">
//           <div className="post-content">
//             <div className="post-text">
//               <div className="post-title-box">
//                 <a href="/home/profile" className="profile-img-post">
//                   {post.author_profile_img && (
//                     <UserImg profileImg={`http://127.0.0.1:8000${post.author_profile_img}`} />
//                   )}
//                 </a>
//                 <div className="post-title-text-box">
//                   <h5><a href="/home/profile"><strong>{post.author_name}</strong></a></h5>
//                   <p>{formatDate(post.created_at)}</p>
//                 </div>
//               </div>
//               <div className="post-text-content">
//                 <ReactQuill
//                   value={post.content}
//                   readOnly={true}
//                   theme="bubble"
//                 />
                
//               </div>
//             </div>
//             <div className="pos-relative flex-row justify-evenly">
//               <button onClick={() => handleLike(post.id)}>
//                 {likedPosts[post.id] ? <p style={{ color: 'blue', fontSize: '18px' }}>👍 Like</p> : <span><SlLike/> Like</span>}
//               </button>
//               <div>
//                 <BiSolidCommentDetail />
//               </div>
//               <div className='post-text-icon pos-absolute'>
//                 <button onClick={() => handleCommentExpand(post.id)}>
//                   {expandedComment === post.id ? 'Collapse Comments' : 'Comments'}
//                 </button>
//                 {expandedComment === post.id && (
//                   <div className="comment-container">
//                     <div className="comment-content pos-absolute">
//                       {comments
//                         .filter((comment) => comment.post === post.id)
//                         .map((comment) => (
//                           <div key={comment.id} className="comment-box-container">
//                             <div className="profile-img-post">
//                               {comment.author_profile_img && (
//                                 <UserImg profileImg={`http://127.0.0.1:8000${comment.author_profile_img}`} />
//                               )}
//                             </div>
//                             <div className="comment-text-box">
//                               <span><a href="/home/profile"><strong>{comment.author_name}</strong></a></span>
//                               <span>{formatDate(comment.created_at)}</span>
//                               <p>{comment.text}</p>
//                             </div>
//                           </div>
//                         ))}
//                       <CreateNewComment postId={post.id} />
//                     </div>
//                   </div>
//                 )}
//               </div>
//               <div><FaShareFromSquare /><span>Share</span></div>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default PostList;