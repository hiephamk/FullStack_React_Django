
import { useState } from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
//import { useNavigate } from 'react-router-dom';

const CreateNewComment = ({postId}) => {
    const [text, setText] = useState('');

    const { userInfo } = useSelector((state) => state.auth)

    const handlePost = async (e) => {
      e.preventDefault();
      try {
          await axios.post('http://127.0.0.1:8000/api/comments/', {
              text: text,
              post: postId,         // Use the passed postId here
              author: userInfo.id   // Ensure userInfo is defined
          });
          setText('');  // Clear the text field after posting
          console.log(postId)
      } catch (error) {
          console.error("Error creating comment:", error);
      }
      window.location.reload();
  };
    
  return (
    <div >
        <form onSubmit={handlePost}>
            <div className='postList-content'>
              <input
                type="text" 
                placeholder=""
                value={text} onChange={(e) => setText(e.target.value)} 
                style={{ height: '50px', width:'80%' }}
              />
              <button type='submit' >Post</button>
            </div>
        </form>
    </div>
  )
}
CreateNewComment.propTypes = {
  postId: PropTypes.node.isRequired,
};
export default CreateNewComment