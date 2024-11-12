
import { useState, useEffect} from 'react'
import axios from 'axios';
//import AxiosInstance from '../context/Axios';
//import { useSelector } from 'react-redux';
import CreateNewComment from './CreateNewComment';
import { BiSolidCommentDetail } from "react-icons/bi";
import { FaShareFromSquare } from "react-icons/fa6";
//import ProfileImg from './ProfileImg';
import Profile from '../components/Profile';
import ReactQuill from 'react-quill';


const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComment] = useState([]);
  //const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchPostsAndComments = async () => {
      try {
        const postResponse = await axios.get('http://127.0.0.1:8000/api/posts/');
        const commentResponse = await axios.get('http://127.0.0.1:8000/api/comments/');
        
        // Sort posts by `created_at` in descending order
        const sortedPosts = postResponse.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        setPosts(sortedPosts);
        setComment(commentResponse.data);
        
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

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>
          <div className="post-container">
            <div className="post-content">
              <div className="post-text">
                <div className="post-title-box">
                    <div className="profile-img-post">
                      {/* Generate the full URL for the profile image */}
                      {post.author_profile_img && 
                        <Profile profileImg={`http://127.0.0.1:8000${post.author_profile_img}`} />
                      }
                    </div>
                    <div className='post-title-text-box'>
                      <h5><strong>{post.author_name}</strong></h5>
                      <p>{formatDate(post.created_at)}</p>
                    </div>
                </div>
                <div className="post-text-content">
                  <ReactQuill
                      value={post.content}
                      readOnly={true}
                      theme="bubble" // or "snow" if you want toolbar styling
                  />
                </div>
                
              </div>
              <div className="post-text-icon">
                <div>👍 <span>Like</span></div>
                <div><BiSolidCommentDetail /><span>Comment</span></div>
                <div><FaShareFromSquare /><span>Share</span></div>
              </div>
            </div>

            <div className="comment-container">
              <div className="comment-content">
                {comments
                  .filter((comment) => comment.post === post.id)
                  .map((comment) => (
                    <div key={comment.id} className="comment-box-container">
                      <div className="profile-img-post">
                  {/* Generate the full URL for the profile image */}
                  {post.author_profile_img && 
                    <Profile profileImg={`http://127.0.0.1:8000${comment.author_profile_img}`} />
                  }
                </div>
                      <div className='comment-text-box'>
                        <span><strong>{comment.author_name} </strong></span>
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
