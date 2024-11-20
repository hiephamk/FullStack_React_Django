
import { useState } from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 

const CreateNewPost = () => {
    const [content, setContent] = useState('');
    const { userInfo } = useSelector((state) => state.auth)

    const handlePost = (e) => {
        e.preventDefault();
        axios({
            method: 'post',
            url: 'http://127.0.0.1:8000/api/posts/',
            data: {
              content: content,
              author: userInfo.id
              
            }
          });
          window.location.reload();
      };
    
  return (
    <div>
      <form onSubmit={handlePost}>
        <ReactQuill
          value={content} 
          onChange={setContent}
        />
        <button className='btn btn-primary ' type='submit'>Post</button>
      </form>
    </div>
  )
}

export default CreateNewPost