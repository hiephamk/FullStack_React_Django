import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const CreateComment = ({ postId, setComments }) => {
  const { user, userInfo } = useSelector((state) => state.auth);
  const [text, setText] = useState("");

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
        "http://127.0.0.1:8000/api/comments/",
        {
          text: text,
          post: postId,
          author: userInfo.id,
        },
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        }
      );

      // Update comments state with the newly added comment
      setComments((prevComments) => [...prevComments, res.data]);

      // Clear the input field
      setText("");
    } catch (error) {
      console.error(error, "Error posting comment");
    }
  };

  return (
    <div>
      <form onSubmit={handlePost} className="d-flex justify-content-evenly align-self-center my-2 ">
        <input
            style={{width: '70%', height:'50px',boxShadow:'2px 2px #1113', border:'1px solid #111', padding:'10px', borderRadius:'30px'}}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
        />
        <button type="submit" style={{boxShadow:'2px 2px #1113',border:'1px solid #111',borderRadius:'7px', padding:'0 20px'}}>Send</button>
      </form>
    </div>
  );
};

export default CreateComment;
