import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import { BiSolidCommentDetail } from "react-icons/bi";
import { FaShareFromSquare } from "react-icons/fa6";
import { SlLike } from "react-icons/sl";
import UserImg from '../components/UserImg';
import CreateNewComment from '../pages/CreateNewComment';
import api from '../features/auth/api'


const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [isLiked, setIsLiked] = useState(false);


  

  // To handle Collapse/Expand functionality
  const [expandedPost, setExpandedPost] = useState(null);


  useEffect(() => {
    const fetchPostsAndComments = async () => {
        try {
            const resPost = await api.get('/posts/');
            const resComment = await api.get('/comments/');
            setPosts(resPost.data);
            setComments(resComment.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }z
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

  // Function to toggle like status
  const handleLike = (postId) => {
    setIsLiked((prev) => !prev);

    axios.post(`http://127.0.0.1:8000/api/posts/${postId}/like/`)
      .then((response) => {
        // Handle the response with updated like count and users who liked the post
        const { like_count, users_liked } = response.data;

        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? { ...post, like_count, users_liked } : post
          )
        );
      })
      .catch((error) => console.error("Error liking post:", error));
  };

  // Function to toggle the collapse/expand for users who liked the post
  const handleExpandCollapse = (postId) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };
  // const handleCommentExpand = (postId) => {
  //   setExpandedPost(expandedPost === postId ? null : postId);
  // };

  return (
    <div className=''>
      {posts.map((post) => (
        <div key={post.id} >
          <div className="">
            <div className="">
              <div className='shadow p-3 my-2 bg-body-tertiary rounded'>
                <div className="d-flex">
                  <a href="/home/profile" className="profile-img-post">
                    {post.author_profile_img && (
                      <UserImg profileImg={`http://127.0.0.1:8000${post.author_profile_img}`} />
                    )}
                  </a>
                  <div className="lh-1">
                    <h5><a href="/home/profile"><strong>{post.author_name}</strong></a></h5>
                    <p style={{fontSize:'12'}}>{formatDate(post.created_at)}</p>
                  </div>
                </div>
                <div className="border rounded text-dark">
                  <ReactQuill
                    value={post.content}
                    readOnly={true}
                    theme="bubble"
                  />
                </div>
                <p style={{color:'blue'}}><strong>{post.like_count} Likes</strong></p>
              </div>
            </div>
            <div className="shadow-sm p-3 bg-body-tertiary rounded d-flex justify-content-evenly">
                <button onClick={() => handleLike(post.id)}>
                  {isLiked ? <p style={{ color: 'blue', fontSize: '18px' }}>👍 Like</p> : <span><SlLike/> Like</span>}
                </button>
                <div className='flex-row'>
                  <BiSolidCommentDetail />
                  <button onClick={() => handleExpandCollapse(post.id)}>
                  {expandedPost === post.id ? 'Collapse' : 'Comment'}
                </button>
                </div>
              <div><FaShareFromSquare /><span>Share</span></div>
            </div>
          </div>
          <div className='rounded-4'>
              {expandedPost === post.id && (
                <div className="shadow-sm p-3 mb-5 my-1 bg-body-tertiary rounded-2">
                  <CreateNewComment postId={post.id} />
                </div>
              )}
          </div>
            <div className="text-dark">
              {comments
                .filter((comment) => comment.post === post.id)
                .map((comment) => (
                  <div key={comment.id} className="comment-box d-flex shadow-sm p-3 mx-3 my-2 bg-body-tertiary rounded">
                    <div className="profile-img-post">
                      {comment.author_profile_img && (
                        <UserImg profileImg={`http://127.0.0.1:8000${comment.author_profile_img}`} />
                      )}
                    </div>
                    <div className="p-1">
                      <div className='mb-2 px-2 flex-columns lh-1'>
                        <span><a href="/home/profile"><strong>{comment.author_name}</strong></a></span>
                        <span style={{fontSize: '12px'}}> {formatDate(comment.created_at)}</span>
                      </div>
                      {/* <p className='px-2 text-justify comment-box'>{comment.text}</p> */}
                      <ReactQuill
                        value={comment.text}
                        readOnly={true}
                        theme="bubble"
                      />
                    </div>
                  </div>
                ))}
            </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;