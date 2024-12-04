import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import 'react-quill/dist/quill.snow.css';
import { GrLike } from "react-icons/gr";
import { MdOutlineComment } from "react-icons/md";
import { FaShareFromSquare } from "react-icons/fa6";
import CreateComment from './CreateComment'
import { toast } from "react-toastify";

const PostList = () => {
    const { user} = useSelector((state) => state.auth);
    const [posts, setPosts] = useState([])
    const [comments, setComments] = useState([])
    const [likedPosts, setLikedPosts] = useState({});
    const [expandedPost, setExpandedPost] = useState(null);


    useEffect(() => {
      const fetchPostAndComment = async () => {
        const postUrl = `http://127.0.0.1:8000/api/posts/`;
        const commentUrl = `http://127.0.0.1:8000/api/comments/`;

        let currentAccessToken = user.access;

        const refreshAccessToken = async () => {
          const refreshUrl = `http://127.0.0.1:8000/api/token/refresh/`;
          try {
            const res = await axios.post(refreshUrl, { refresh: user.refresh });
            return res.data.access;
          } catch (error) {
            console.error("Error refreshing token:", error.response || error.message);
            return null;
          }
        };

        // Attempt to refresh token if access token is missing or invalid
        if (!currentAccessToken) {
          // eslint-disable-next-line no-const-assign
          currentAccessToken = await refreshAccessToken();
        }

        if (!currentAccessToken) {
          console.error("Unable to fetch data: No valid access token.");
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${currentAccessToken}`,
          },
        };

        try {
          const postRes = await axios.get(postUrl, config);
          const commentRes = await axios.get(commentUrl, config);
          const sortedPosts = postRes.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          const sortedComment = commentRes.data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
          setPosts(sortedPosts);
          setComments(sortedComment);
        } catch (error) {
          console.error("Error fetching data:", error.response || error.message);
        }
      };

      if (user && user.access) {
        fetchPostAndComment()
      }
    },[user])

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
      let currentAccessToken = user.access;

      const refreshAccessToken = async () => {
        const refreshUrl = `http://127.0.0.1:8000/api/token/refresh/`;
        try {
          const res = await axios.post(refreshUrl, { refresh: user.refresh });
          return res.data.access;
        } catch (error) {
          console.error("Error refreshing token:", error.response || error.message);
          return null;
        }
      };

      if (!currentAccessToken) {
        currentAccessToken = await refreshAccessToken();
      }

      if (!currentAccessToken) {
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
                Authorization: `Bearer ${currentAccessToken}`,
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

        <div className="">
            <div>
              {posts
                .map((post) => (
                <div key={post.id} className="border rounded-3 my-2" style={{color:'#fff', backgroundColor: '#4682B4', paddingTop:'20px'}}>
                  <div className="rounded-2" style={{padding:'0 20px 0 20px'}}>
                    <div className="d-flex flex-column p-2" style={{fontSize:'18px'}}>
                      <span ><strong>{post.author_name}</strong> </span>
                      <span style={{fontSize: '12px'}}> {formatDate(post.created_at)}</span>
                    </div>
                    <p>{post.content}</p>
                    {/* <ReactQuill
                      theme="bubble"
                      value = {post.content}
                      readOnly = {true}
                    /> */}
                    <p style={{color:'blue', borderBottom:'1px solid #fff'}}><strong>{post.like_count} Like</strong></p>
                  </div>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center',margin:'0 0 20px', padding:'0 20px auto', borderBottom:'1px solid #fff' }}>
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
                          <div key={comment.id} className="border border-1 rounded p-2 m-3" style={{backgroundColor:'#4682b4'}}>
                            <div className="d-flex flex-column ">
                              <span><strong>{comment.author_name}</strong></span>
                              <span style={{fontSize:'12px'}}>{formatDate(comment.created_at)}</span>
                            </div>
                            <p>{comment.text}</p>
                          </div>
                        ))}
                         <CreateComment postId={post.id} comments={comments} setComments={setComments}/>
                      </div>
                  )}

                </div>

              ))}
            </div>
        </div>
    );
};

export default PostList;

// import 'react-quill/dist/quill.snow.css';
// import { GrLike } from "react-icons/gr";
// import { MdOutlineComment } from "react-icons/md";
// import { FaShareFromSquare } from "react-icons/fa6";
// import CreateComment from './CreateComment';
// import { toast } from "react-toastify";

// const PostList = ({ posts, comments, handleLike, handleExpandPost, expandedPost }) => {
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric',
//       hour: 'numeric'
//     });
//   };

//   return (
//     <div>
//       {posts.length > 0 ? (
//         posts.map((post) => (
//           <div key={post.id} className="border rounded-3 my-2" style={{ color: '#fff', backgroundColor: '#4682B4', paddingTop: '20px' }}>
//             <div className="rounded-2" style={{ padding: '0 20px 0 20px' }}>
//               <div className="d-flex flex-column p-2" style={{ fontSize: '18px' }}>
//                 <span><strong>{post.author_name}</strong></span>
//                 <span style={{ fontSize: '12px' }}> {formatDate(post.created_at)}</span>
//               </div>
//               <p>{post.content}</p>
//               <p style={{ color: 'blue', borderBottom: '1px solid #fff' }}><strong>{post.like_count} Like</strong></p>
//             </div>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 20px', padding: '0 20px auto', borderBottom: '1px solid #fff' }}>
//               <button onClick={() => handleLike(post.id)}>
//                 <GrLike /> Like
//               </button>
//               <div>
//                 <MdOutlineComment />
//                 <button onClick={() => handleExpandPost(post.id)}>
//                   {expandedPost === post.id ? 'Collapse' : 'Comment'}
//                 </button>
//               </div>
//               <button><FaShareFromSquare /> Share</button>
//             </div>
//             {expandedPost === post.id && (
//               <div>
//                 {comments.filter((comment) => comment.post === post.id).map((comment) => (
//                   <div key={comment.id} className="border border-1 rounded p-2 m-3" style={{ backgroundColor: '#4682b4' }}>
//                     <div className="d-flex flex-column ">
//                       <span><strong>{comment.author_name}</strong></span>
//                       <span style={{ fontSize: '12px' }}>{formatDate(comment.created_at)}</span>
//                     </div>
//                     <p>{comment.text}</p>
//                   </div>
//                 ))}
//                 <CreateComment postId={post.id} comments={comments} setComments={() => {}} />
//               </div>
//             )}
//           </div>
//         ))
//       ) : (
//         <p>No posts available for this subtopic.</p>
//       )}
//     </div>
//   );
// };

// export default PostList;
