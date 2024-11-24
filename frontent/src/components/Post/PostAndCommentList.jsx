import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom'; // Use useParams to get the route param
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
  const { subtopicId } = useParams(); // Get subtopicId from route
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

  return (
    <div>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="border rounded-3 my-2" style={{ color: '#111', backgroundColor: '#fff', paddingTop: '20px' }}>
            <div className="rounded-2" style={{ padding: '0 20px 0 20px' }}>
              <div style={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}>
                <div>
                  {post.author_profile_img && (
                    <UserImg profileImg={`http://127.0.0.1:8000${post.author_profile_img}`} />
                  )}
                </div>
                <div className="d-flex flex-column p-2">
                  <span>
                    <strong>{post.author_name}</strong>
                  </span>
                  <span style={{ fontSize: '12px' }}>{formatDate(post.created_at)}</span>
                </div>
              </div>
              <p>{post.content}</p>
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
                {likedPosts[post.id] ? '👍 Liked' : <p><GrLike /> Like</p>}
              </button>
              <div>
                <MdOutlineComment />
                <button onClick={() => handleExpandPost(post.id)}>
                  {expandedPost === post.id ? 'Collapse' : 'Comment'}
                </button>
              </div>
              <button>
                <FaShareFromSquare /> Share
              </button>
            </div>
            {expandedPost === post.id && (
              <div>
                {comments
                  .filter((comment) => comment.post === post.id)
                  .map((comment) => (
                    <div key={comment.id} style={{ display: 'flex', alignItems: 'center', padding: '20px' }}>
                      <div>
                        {comment.author_profile_img && (
                          <UserImg profileImg={`http://127.0.0.1:8000${comment.author_profile_img}`} />
                        )}
                      </div>
                      <p
                        className="d-flex flex-column rounded "
                        style={{ backgroundColor: '#f8f8f8', margin: '10px', boxShadow: '2px 2px #1113', padding: '10px' }}
                      >
                        <strong>
                          <Link to={`/community/profile/${comment.profile}`}>{comment.author_name}</Link>
                        </strong>
                        <span style={{ fontSize: '12px' }}>{formatDate(comment.created_at)}</span>
                        <p>
                          <span>{comment.text}</span>
                        </p>
                      </p>
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
