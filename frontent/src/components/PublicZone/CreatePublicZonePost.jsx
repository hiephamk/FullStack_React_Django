import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import useAccessToken from '../../features/auth/token';

const CreatePublicZonePost = () => {
  const { user, userInfo } = useSelector(state => state.auth);
  const accessToken = useAccessToken(user);

  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isDisplayName, setIsDisplayName] = useState(false);
  const [media, setMedia] = useState(null);

  const CreatePost = async (e) => {
    e.preventDefault();  // Prevent default form submission behavior

    const url = `http://127.0.0.1:8000/api/publiczone/`;
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',  // Set content type for form data
      }
    };

    const formData = new FormData();  // Corrected initialization
    formData.append('topics', topic);
    formData.append('content', content);
    formData.append('content_owner', userInfo.id);
    formData.append('isDisplayName', isDisplayName);
    // formData.append('display_name', displayName);

    if (media) {
      formData.append('media', media);  // Assuming media is a file object
    }

    try {
      await axios.post(url, formData, config);
      // Reset form fields after successful post
      setTopic('');
      setContent('');
      setDisplayName('');
      setIsDisplayName(false);
      setMedia(null);
    } catch (error) {
      console.error("Error creating post:", error.response?.data || error.message);
    }
  };

  const isDisplayNameCheck = () => {
    setIsDisplayName(prev => !prev);  // Toggle checkbox value
  };

  return (
    <>
      <form onSubmit={CreatePost}>
        <div>
          <select
            id='options'
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Select topic"
            style={{
              border: "1px solid #111",
              width: "100%",
              borderRadius: "5px",
              padding: "10px",
            }}
          >
            <option value="General">Select one topic</option>
            <option value="Technology">Technology</option>
            <option value="Healthcare">Health Care</option>
          </select>
          <input 
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            style={{
              border: "1px solid #111",
              width: "100%",
              borderRadius: "5px",
              padding: "10px",
            }}
          />
          {/* <input 
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Display Name"
            style={{
              border: "1px solid #111",
              width: "100%",
              borderRadius: "5px",
              padding: "10px",
            }}
          /> */}
          <label>
            <input 
              type="checkbox"
              checked={isDisplayName}
              onChange={isDisplayNameCheck}
            />
            <span style={{marginLeft:'5px'}}>Display as an anonymous?</span>
          </label>
        </div>
        <button type="submit" className="btn btn-primary m-2">Post</button>
      </form>
    </>
  );
};

export default CreatePublicZonePost;
