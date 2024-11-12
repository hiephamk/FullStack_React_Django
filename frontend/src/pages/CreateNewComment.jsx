
import { useState } from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Profile from './ProfileImg';


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
        <form onSubmit={handlePost} className='createComment-container'>
            <div className='profile-img-post'>
              <Profile/>
            </div>
            <div>
              <input
                className='comment-box-text'
                type="text" 
                placeholder=""
                value={text} onChange={(e) => setText(e.target.value)} 
              />
            </div>
            <div>
              <button className='btn btn-primary' type='submit' >Post</button>
            </div>
        </form>
    </div>
  )
}
CreateNewComment.propTypes = {
  postId: PropTypes.node.isRequired,
};
export default CreateNewComment