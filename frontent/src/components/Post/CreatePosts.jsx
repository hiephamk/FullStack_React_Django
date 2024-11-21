import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useAccessToken } from '../../features/auth/token'

const CreatePosts = ({ subtopicId, setPosts }) => {
  const { user, userInfo } = useSelector((state) => state.auth);
  const [content, setContent] = useState("");
  const accessToken = useAccessToken(user);

  const handlePost = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit

    if (!accessToken) {
      console.error("Unable to fetch data: No valid access token.");
      return;
    }

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/posts/",
        {
          content: content,
          subtopic: subtopicId,
          author: userInfo.id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Update comments state with the newly added comment
      setPosts((prevComments) => [...prevComments, res.data]);

      // Clear the input field
      setContent("");
    } catch (error) {
      console.error(error, "Error posting comment");
    }
  };

  return (
    <div>
      <form onSubmit={handlePost} className="d-flex justify-content-evenly align-self-center my-2 ">
        <input
            style={{width: '70%', height:'50px'}}
            className="rounded px-2"
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a post..."
        />
        <button type="submit" className='px-5, rounded' style={{border:'1px solid #fff', padding:'0 20px'}}>Send</button>
      </form>
    </div>
  );
};

export default CreatePosts;
