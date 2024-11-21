import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const CreatePost = ({ subtopicId, setPosts, fetchPostsBySubtopic }) => {
  const { user, userInfo } = useSelector((state) => state.auth);
  const [content, setContent] = useState("");

  const handlePost = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit

    let currentToken = user.access;
    const refreshToken = async () => {
      const refreshUrl = `http://127.0.0.1:8000/api/token/refresh/`;
      try {
        const res = await axios.post(refreshUrl, { refresh: user.refresh });
        return res.data.access;
      } catch (error) {
        console.error("Error refreshing token:", error.response || error.message);
        return null;
      }
    };

    if (!currentToken) {
      currentToken = await refreshToken();
    }
    if (!currentToken) {
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
            Authorization: `Bearer ${currentToken}`,
          },
        }
      );

      // Update comments state with the newly added comment
      setPosts((prevPosts) => [...prevPosts, res.data]);

      // Clear the input field
      setContent("");
      fetchPostsBySubtopic(subtopicId);
    } catch (error) {
      console.error(error, "Error posting comment");
    }
  };

  return (
    <div>
      <form onSubmit={handlePost} style={{boxSizing:'border-box', width:'100%', display:'flex', justifyContent:'space-evenly', margin:'10px'}}>
        <input
            style={{width: '80%', height:'50px', border:'1px solid #111',borderRadius:'10px',padding:'15px', boxShadow:'2px 2px #1113'}}
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a new post..."
        />
        <button type="submit" style={{border:'1px solid #111', padding:'0 18px', width:'10%', borderRadius:'7px', boxShadow:'2px 2px #1113'}}>Send</button>
      </form>
    </div>
  );
};
CreatePost.propTypes = {
  subtopicId: PropTypes.number.isRequired, // Correct prop name and type
  setPosts: PropTypes.func.isRequired,
  fetchPostsBySubtopic: PropTypes.func.isRequired,
}
export default CreatePost;
