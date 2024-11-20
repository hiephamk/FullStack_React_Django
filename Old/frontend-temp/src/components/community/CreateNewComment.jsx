
import { useState } from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import ProfileImg from '../components/profileImg';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 


const CreateNewComment = ({postId}) => {
    const [text, setText] = useState('');
    const { userInfo } = useSelector((state) => state.auth)

    const handlePost = async (accessToken) => {
      //e.preventDefault();
      const config = {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
      }
      try {
          await axios.post('http://127.0.0.1:8000/api/comments/',config, {
              text: text,
              post: postId,         // Use the passed postId here
              author: userInfo.id   // Ensure userInfo is defined
          });
          setText('');  // Clear the text field after posting
          console.log(postId)
      } catch (error) {
          console.error("Error creating comment:", error);
      }
      //window.location.reload();
  };

  return (
    <div >
        <form onSubmit={handlePost} >
            <div className='create-comment d-flex justify-content-between align-items-center'>
              <div className='img-fluid rounded-pill'>
                <ProfileImg/>
              </div>
              <div style={{width: '500px', color:'black'}}>
                <ReactQuill
                  value={text} 
                  onChange={setText}
                  theme='snow'
                  formats={['header','font', 'size', 'bold', 'italic', 'underline']}
                />
              </div>
              <div>
                <button className='btn btn-primary' type='submit' >Post</button>
              </div>
            </div>
        </form>
    </div>
  )
}
CreateNewComment.propTypes = {
  postId: PropTypes.node.isRequired,
};
export default CreateNewComment