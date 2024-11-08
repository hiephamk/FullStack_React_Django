// src/components/Post.js
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Comment from './CreatePost';

const Post = () => {
  const { postId } = useParams();
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/posts/${postId}/`)
      .then(response => {
        setPost(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the post!", error);
      });

    axios.get(`http://localhost:8000/api/posts/${postId}/comments/`)
      .then(response => {
        setComments(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the comments!", error);
      });
  }, [postId]);

  return (
    <div >
      <h1>Post here</h1>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <h3>Comments</h3>
      <div>
        {comments.map(comment => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default Post;
