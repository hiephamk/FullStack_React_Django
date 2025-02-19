
import { useState, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { FaUpload } from "react-icons/fa";
import useAccessToken from "../../features/auth/token";
//import ProfileImg from "../ProfileImg";

// eslint-disable-next-line react/prop-types
const CreatelCommentChannel = ({ postId, setComments }) => {
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null); // Ref for the hidden file input

  const handleFileUpload = () => {
    fileInputRef.current.click(); // Programmatically open the file input
  };

  const handlePost = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit

    if (!accessToken) {
      console.error("Unable to fetch data: No valid access token.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("text", text);
      formData.append("post", postId);
      formData.append("owner", userInfo.id);

      if (file) {
        formData.append("file", file);
      }

      const res = await axios.post("http://127.0.0.1:8000/api/channels/posts/comments/", formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data", 
        },
      });

      // Update comments state with the newly added comment
      setComments((prevComments) => [...prevComments, res.data]);

      // Clear the input fields
      setText("");
      setFile(null);
    } catch (error) {
      console.error(error, "Error posting comment");
    }
  };

  return (
    <div>
      <form onSubmit={handlePost} className="d-flex justify-content-evenly align-self-center my-2">
        
        <input
          style={{
            width: "70%",
            height: "50px",
            boxShadow: "2px 2px #1113",
            border: "1px solid #111",
            padding: "20px",
            borderRadius: "30px",
          }}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
        />
        <FaUpload
          onClick={handleFileUpload}
          style={{ fontSize: "1.5rem", cursor: "pointer", margin: "10px" }}
          title="Upload file"
        />
        <input
          type="file"
          accept="image/*,video/*"
          ref={fileInputRef} // Attach the ref to the input
          style={{ display: "none" }} // Hide the input field
          onChange={(e) => setFile(e.target.files[0])} // Handle file selection
        />
        <button
          type="submit"
          style={{
            boxShadow: "2px 2px #1113",
            border: "1px solid #111",
            borderRadius: "7px",
            padding: "0 20px",
          }}
        >
          Send
        </button>
      </form>
      {file && (
        <div>
          <strong>Selected file:</strong> {file.name}
        </div>
      )}
    </div>
  );
};

export default CreatelCommentChannel;
