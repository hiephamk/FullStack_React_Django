
import { useState, useEffect} from 'react'
import axios from 'axios';
//import AxiosInstance from '../context/Axios';
//import { useSelector } from 'react-redux';
import CreateNewComment from './CreateNewComment';
import { BiSolidCommentDetail } from "react-icons/bi";
import { FaShareFromSquare } from "react-icons/fa6";


const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [comments, setComment] = useState([]);
  
    useEffect(() => {
      const fetchPostsAndComments = async () => {
          try {
              const postResponse = await axios.get('http://127.0.0.1:8000/api/posts/');
              const commentResponse = await axios.get('http://127.0.0.1:8000/api/comments/');
              
              // Sort posts by `created_at` in descending order (latest post on the top)
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
        year: 'numeric'
    });
};

  return (
    <>
          <div>
            {posts.map((post) => (
            <div key={post.id} className='postList-container'>
                <div className='postList-content'>
                  <div className='post-text'>
                    <div className='post-text-title'>
                      <span><strong>{post.author_name}</strong></span>
                      <p>{ formatDate(post.created_at) }</p>
                    </div>
                    <div className="post-text-content" dangerouslySetInnerHTML={{ __html: post.content }} />
                  </div>
                </div>
                <div className='post-text-icon'>
                  <div>👍 <span>Like </span></div> 
                  <div><BiSolidCommentDetail /><span>Comment</span></div> 
                  <div><FaShareFromSquare /><span>Share</span></div>
                </div>
                <div className='postList-content'>
                    <div className='post-text'>
                        {comments
                        .filter((comment) => comment.post === post.id) // Filter comments for the current post
                        .map((comment) => (
                            <div key={comment.id}>
                            <p><strong>{comment.author_name}: {comment.text}</strong></p>
                            
                            </div>
                        ))}
                    </div>
                    <CreateNewComment postId={post.id} />
                    
                </div>
            </div>
            ))}
          </div>
        </>
  )
}

export default PostList