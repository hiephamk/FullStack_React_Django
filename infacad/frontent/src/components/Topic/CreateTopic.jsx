// import { useState} from "react";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import useAccessToken from "../../features/auth/token";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const CreateTopic = () => {
//   const { user, userInfo } = useSelector((state) => state.auth) || {};
//   const accessToken = useAccessToken(user);
//   const [newTopicTitle, setNewTopicTitle] = useState("");
//   const [newSubtopicTitle, setNewSubtopicTitle] = useState("");  
  
//   // Handle creating a new topic
//   const handleCreateTopic = async () => {
//     if (!newTopicTitle) {
//       toast.error("Topic title cannot be empty.");
//       return;
//     }
//     const topicUrl = `http://127.0.0.1:8000/api/topics/`;
//     const config = { headers: { Authorization: `Bearer ${accessToken}` } };

//     try {
//       await axios.post(
//         topicUrl,
//         { topicTitle: newTopicTitle,
//           status:status,
//           author: userInfo.id,
//          },
//         config
//       );
//       setNewTopicTitle("");
//       toast.success("Topic created successfully!");
//     } catch (error) {
//       console.error("Error creating topic:", error.response || error.message);
//       toast.error("Failed to create topic.");
//     }
//   };
//   return (
//     <div>
//       <form onClick={handleCreateTopic}>
//         <input
//           style={{border:'1px solid #1113', marginRight:'10px'}}
//           type="text"
//           value={newSubtopicTitle}
//           onChange={(e) => setNewSubtopicTitle(e.target.value)}
//         />
//         <button className="btn btn-primary" type="submit">Create</button>
//       </form>
//     </div>
//   )
// }

// export default CreateTopic;

import { useState } from "react";
import axios from 'axios'; // Update path based on your setup
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useAccessToken from "../../features/auth/token";

const CreateTopic = () => {
  const {user, userInfo} = useSelector((state) => state.auth)
  const accessToken = useAccessToken(user)

  const [formData, setFormData] = useState({
    topicTitle: "",
    topicDescription: "",
    status: "private", // Default to private
    author: userInfo.id
  });
  const [errors, setErrors] = useState({});
  //const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const validationErrors = {};
    if (!formData.topicTitle.trim()) {
      validationErrors.topicTitle = "Topic title is required.";
    }
    if (!formData.status) {
      validationErrors.status = "Status is required.";
    }
    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    }
    const url = `http://127.0.0.1:8000/api/topics/`
    try {
      const response = await axios.post(url, formData, config); // Update endpoint based on your API
      console.log("Topic created:", response.data);
      //navigate("/community"); // Redirect to the community page
    } catch (error) {
      console.error("Error creating topic:", error.response?.data || error.message);
      setErrors({ apiError: "Failed to create topic. Please try again." });
    }
  };

  return (
    <div className="create-topic-container">
      <h2>Create a New Topic</h2>
      <form onSubmit={handleSubmit} className="create-topic-form">
        <div className="form-group">
          <label htmlFor="topicTitle">Topic Title</label>
          <input
            type="text"
            id="topicTitle"
            name="topicTitle"
            value={formData.topicTitle}
            onChange={handleChange}
            className={errors.topicTitle ? "error" : ""}
          />
          {errors.topicTitle && <small className="error-text">{errors.topicTitle}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="topicDescription">Topic Description</label>
          <textarea
            id="topicDescription"
            name="topicDescription"
            value={formData.topicDescription}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={errors.status ? "error" : ""}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
          {errors.status && <small className="error-text">{errors.status}</small>}
        </div>

        {errors.apiError && <p className="error-text">{errors.apiError}</p>}

        <button type="submit" className="btn-primary">
          Create Topic
        </button>
      </form>
    </div>
  );
};

export default CreateTopic;
