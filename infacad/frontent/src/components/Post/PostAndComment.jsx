
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useAccessToken from '../../features/auth/token';
import axios from 'axios';
import CreateComment from './CreateComment';
import UserImg from '../UserImg';
import { MdOutlineComment } from "react-icons/md";
import { FaShareFromSquare } from "react-icons/fa6";
import { GrLike } from "react-icons/gr";
//import { toast } from 'react-toastify';
import PropTypes from 'prop-types';


// eslint-disable-next-line react/prop-types
const PostAndComment = ({posts, setPosts, visibility}) => {
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);

  //const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [expandedPost, setExpandedPost] = useState(null);
  const [sharePostId, setSharePostId] = useState(null)
  //const [visibility, setVisibility] = useState('public');
  
  const baseUrl = "http://127.0.0.1:8000";
    const fetchPosts = async () => {
      const postUrl = `${baseUrl}/api/posts/?visibility=${visibility}`;  // Add visibility to URL
      const commentUrl = `${baseUrl}/api/comments/`;
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };
      try {
        const postRes = await axios.get(postUrl, config);
        const sortedPost = postRes.data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
          setPosts(sortedPost);

        const commentRes = await axios.get(commentUrl, config);
        const sortedComment = commentRes.data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        setComments(sortedComment);
      } catch (error) {
        console.error('Error fetching posts or comments:', error);
      }
    };

    useEffect(() => {
      if (accessToken && userInfo) {
        fetchPosts()
      }
    }, [accessToken, visibility, userInfo]); // Depend on circleName and visibility to refetch posts
    
     // Add visibility to the dependency array

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute:'numeric',
    });
  };

const handleShare = async (postId) => {
    const url = `http://127.0.0.1:8000/api/posts/${postId}/share/`;

    const config = {
        headers: { 
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    };

    try {
        await axios.post(url, {}, config);
        fetchPosts()
        //toast.success('Post shared successfully!');
    } catch (error) {
        console.error('Error sharing the post:', error);
        //toast.error('Failed to share the post.');
    }finally {
      setSharePostId(null);
    }
};

  const handleCopyUrl = (postId) => {
    const postUrl = `${window.location.origin}/home/posts/${postId}/copy/`;
    navigator.clipboard
      .writeText(postUrl)
      //.then(() => toast.success('Post URL copied to clipboard!'))
      .catch((error) => {
        console.error('Error copying the link:', error);
        //toast.error('Failed to copy the post URL.');
      });
    setSharePostId(null); // Close the sharing options
  };

  const handleLike = async (postId) => {
    if (likedPosts[postId]) {
      return;
    }
    if (!accessToken) {
      console.error("Unable to fetch data: No valid access token.");
      return;
    }
    try {
      await axios.post(
        `${baseUrl}/api/posts/${postId}/like/`,
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
    //toast.success('You liked this post.');
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
    return ( <p>{content}</p>)
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
              alt="Comment text"
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
    );
  };

  return (

    <div >
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="border rounded-3" style={{ color: '#111', backgroundColor: '#fff' }}>
            <div>
              {
                post.shared ? (
                  <div className='post-container'>
                      <div style={{display:'flex', justifyContent:'flex-start', alignItems:'center'}}>
                        <div style={{height:'40px',width:'40px', marginLeft:'10px'}}>
                          {post.author_profile_img && (
                            <UserImg profileImg={`http://127.0.0.1:8000${post.shared_owner_profile_img}`} />
                          )}
                        </div>
                        <span className="d-flex flex-column p-2">
                          <Link style={{textDecoration:'none'}} to={`/home/profile/${post.profile}`}>{post.shared_owner_name} <strong style={{paddingLeft:'5px', fontStyle:'italic'}}>shared the post: </strong></Link>
                          <span style={{ fontSize: '12px' }}>{formatDate(post.updated_at)}</span>
                        </span>
                      </div>
                      <div style={{ padding: '0 20px 0 20px', border:'1px solid #1113', borderRadius:'7px', margin:'10px 20px' }}>
                        <div style={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}>
                          <div style={{borderRadius:'100px',height:'40px',width:'40px'}}>
                            {post.author_profile_img && (
                              <UserImg profileImg={`http://127.0.0.1:8000${post.author_profile_img}`} />
                            )}
                          </div>
                          <div className="d-flex flex-column p-2">
                            <span>
                              <Link to={`/home/profile/${post.profile}`}>{post.author_name}</Link>
                            </span>
                            <span style={{ fontSize: '12px' }}>{formatDate(post.created_at)}</span>
                          </div>
                        </div>
                        <p>{renderPostContent(post.content, post.file)}</p>
                      </div>
                      <p style={{ color: 'blue', borderBottom: '1px solid #1113', padding:'10px' }}>
                        <strong>{post.like_count} Like</strong>
                      </p>
                  </div>
                )
                :
                (<div className="rounded-2" style={{ padding: '0 20px 0 20px' }}>
                  <div style={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}>
                    <div style={{borderRadius:'100px',height:'40px',width:'40px'}}>
                      {post.author_profile_img && (
                        <UserImg profileImg={`http://127.0.0.1:8000${post.author_profile_img}`} />
                      )}
                    </div>
                    <div className="d-flex flex-column p-2">
                      <span>
                        <Link style={{textDecoration:'none'}} to={`/home/profile/${post.profile}`}>{post.author_name}</Link>
                      </span>
                      <span style={{ fontSize: '12px' }}>{formatDate(post.created_at)}</span>
                    </div>
                  </div>
                  <p>{renderPostContent(post.content, post.file)}</p>
                  <p style={{ color: 'blue', borderBottom: '1px solid #1113' }}>
                    <strong>{post.like_count} Like</strong>
                  </p>
                </div>)
              }
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
              <button onClick={() => setSharePostId(post.id)}>
                <FaShareFromSquare /> <strong>Share</strong>
              </button>
              {sharePostId === post.id && (
              <div
                style={{
                  border: '1px solid #ccc',
                  padding: '10px',
                  marginTop: '10px',
                  backgroundColor: '#f9f9f9',
                  display:'flex',
                  flexDirection:'column'
                }}
              >
                <button onClick={() => handleShare(post.id)}>Circle</button>
                <button onClick={() => handleCopyUrl(post.id)}>Copy URL</button>
              </div>
            )}
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
                                <div style={{borderRadius:'100px',height:'40px',width:'40px',margin:'0 10px 10px 0'}}>
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
        null
      )}
    </div>
  );
};
PostAndComment.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      author_profile_img: PropTypes.string,
      profile: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      author_name: PropTypes.string.isRequired,
      content: PropTypes.string,
      file: PropTypes.string,
      like_count: PropTypes.number,
      created_at: PropTypes.string.isRequired,
    })
  ).isRequired,
  setPosts: PropTypes.func.isRequired,
};
export default PostAndComment;