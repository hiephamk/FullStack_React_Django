import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosInstance from '../context/Axios';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handlePost = (event) => {
    event.preventDefault(); // Prevent page reload
    console.log("Sending data:", { title, content });
    
    AxiosInstance.post('posts/', {
      title: title,
      content: content,
    })
    .then((res) => {
      navigate('/home/community');
    })
    .catch((error) => {
      console.error("Error submitting post:", error);
    });
  };
  
  return (
    <div>
      <h1>Create New Post</h1>
      <div > {/* Use submitPost function */}
        <div>
          <label>Title</label>
          <input 
            type="text" 
            name='title'
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Content</label>
          <textarea 
            type='text'
            name='content'
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            required
          ></textarea>
        </div>
        <button onClick={handlePost}>Create Post</button>
      </div>
    </div>
  );
};

export default CreatePost;