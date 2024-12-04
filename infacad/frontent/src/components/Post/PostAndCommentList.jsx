
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom'; 
import { useSelector } from 'react-redux';
import useAccessToken from '../../features/auth/token';
import axios from 'axios';
import CreateComment from './CreateComment';
import UserImg from '../UserImg';
import { MdOutlineComment } from "react-icons/md";
import { FaShareFromSquare } from "react-icons/fa6";
import { GrLike } from "react-icons/gr";
import { toast } from 'react-toastify';

const PostAndCommentList = () => {
  const { user } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);
  const { subtopicId} = useParams(); // Get subtopicId from route
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [expandedPost, setExpandedPost] = useState(null);

  useEffect(() => {
    const fetchPostsBySubtopic = async () => {
      if (!accessToken || !subtopicId) {
        console.error('Unable to fetch data: No valid access token or subtopicId.');
        return;
      }
      const postUrl = `http://127.0.0.1:8000/api/posts/?subtopic=${subtopicId}`;
      const commentUrl = `http://127.0.0.1:8000/api/comments/`;
      const config = { headers: { Authorization: `Bearer ${accessToken}` } };

      try {
        const postRes = await axios.get(postUrl, config);
        const sortedPost = postRes.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setPosts(sortedPost);

        const commentRes = await axios.get(commentUrl, config);
        const sortedComment = commentRes.data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        setComments(sortedComment);
      } catch (error) {
        console.error('Error fetching posts:', error.response || error.message);
      }
    };

    fetchPostsBySubtopic();
  }, [accessToken, subtopicId]); // Add subtopicId to dependency array

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
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
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, like_count: post.like_count + 1 } : post
        )
      );
    } catch (error) {
      console.error("Error liking the post:", error.response || error.message);
    }
    toast.success('You liked this post.');
  };

  const handleExpandPost = (postId) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  // Function to render post content (text, image, or video)
  const renderPostContent = (content, file) => {

      if (file){
        const fileExtension = file.split('.').pop().toLowerCase();
  
      // Supported image formats
      const imageFormats = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'svg', 'webp'];
      // Supported video formats
      const videoFormats = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv', 'flv', 'wmv'];
  
      if (imageFormats.includes(fileExtension)) {
        return (
            <>
            <p>{content}</p>
              <img
                src={`${file}`}
                alt="Post content"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </>
        );
      }
      if (videoFormats.includes(fileExtension)) {
        return (
          <>
            <p>{content}</p>
            <video controls style={{ maxWidth: '100%', height: 'auto' }}>
              <source src={`${file}`} type={`video/${fileExtension}`} />
              Your browser does not support this video format.
            </video>
          </>
        );
      }
    }
    return (
      <p>{content}</p>
    )
  };
  const renderComment = (text, file) => {
    
    if (file) {
      const fileExtension = file.split('.').pop().toLowerCase();
  
      // Supported image formats
      const imageFormats = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'svg', 'webp'];
      // Supported video formats
      const videoFormats = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv', 'flv', 'wmv'];
  
      if (imageFormats.includes(fileExtension)) {
        return (
            <>
              <p>{text}</p>
              <img
                src={`${file}`}
                alt="Post text"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </>
        );
      }
      if (videoFormats.includes(fileExtension)) {
        return (
          <>
            <p>{text}</p>
            <video controls style={{ maxWidth: '100%', height: 'auto' }}>
              <source src={`${file}`} type={`video/${fileExtension}`} />
              Your browser does not support this video format.
            </video>
          </>
        );
      }
    }
    return (
      <p>{text}</p>
    )
  };
  
  return (
    <div>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="border rounded-3" style={{ color: '#111', backgroundColor: '#fff', paddingTop: '20px' }}>
            <div className="rounded-2" style={{ padding: '0 20px 0 20px' }}>
              <div style={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}>
                <div>
                  {post.author_profile_img && (
                    <UserImg profileImg={`http://127.0.0.1:8000${post.author_profile_img}`} />
                  )}
                </div>
                <div className="d-flex flex-column p-2">
                  <span>
                  <Link to={`/home/profile/${post.profile}`}>{post.author_name}</Link>
                    {/* <strong>{post.author_name}</strong> */}
                  </span>
                  <span style={{ fontSize: '12px' }}>{formatDate(post.created_at)}</span>
                </div>
              </div>
              {/* Render post content using renderPostContent */}
              {renderPostContent(post.content, post.file)}

              <p style={{ color: 'blue', borderBottom: '1px solid #1113' }}>
                <strong>{post.like_count} Like</strong>
              </p>
            </div>
            <div
              style={{
                display: 'flex',
                borderBottom: '1px solid #1113',
                justifyContent: 'space-between',
                alignItems: 'center',
                margin: '0 20px 20px',
                padding: '0 20px auto',
              }}
            >
              <button onClick={() => handleLike(post.id)}>
                {likedPosts[post.id] ? <strong>👍 Liked </strong>: <p><GrLike /> <strong>Like</strong></p>}
              </button>
              <div>
                <MdOutlineComment />
                <button onClick={() => handleExpandPost(post.id)}>
                  <strong>{expandedPost === post.id ? 'Collapse' : 'Comment'}</strong>
                </button>
              </div>
              <button>
                <FaShareFromSquare /> <strong>Share</strong>
              </button>
            </div>
            {expandedPost === post.id && (
              <div>
                {comments
                  .filter((comment) => comment.post === post.id)
                  .map((comment) => (
                    <div key={comment.id} style={{ display: 'flex', padding: '20px' }}>
                          
                            <div
                              className="d-flex flex-column rounded "
                              style={{ margin: '10px', padding: '10px', backgroundColor: '#f8f8f8', border:'1px solid #1113' }}
                            >
                              <div style={{display:'flex'}}>
                                <div style={{margin:'0 10px 10px 0'}}>
                                  {comment.author_profile_img && (
                                    <UserImg profileImg={`http://127.0.0.1:8000${comment.author_profile_img}`} />
                                  )}
                                </div>
                                <div>
                                  <strong>
                                    <Link to={`/home/profile/${comment.profile}`}>{comment.author_name}</Link>
                                  </strong>
                                  <p style={{ fontSize: '12px' }}>{formatDate(comment.created_at)}</p>
                                </div>
                              </div>
                            {renderComment(comment.text, comment.file)}
                            </div>
                    </div>
                  ))}
                <CreateComment postId={post.id} comments={comments} setComments={setComments} />
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No posts found for this subtopic.</p>
      )}
    </div>
  );
};

export default PostAndCommentList;

