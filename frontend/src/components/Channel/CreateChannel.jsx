import { useState } from "react";
import axios from 'axios'; // Update path based on your setup
//import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useAccessToken from "../../features/auth/token";

const CreateChannel = () => {
  const {user, userInfo} = useSelector((state) => state.auth)
  const accessToken = useAccessToken(user)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    channel_type: "private", // Default to private
    owner: userInfo.id
  });
  const [errors, setErrors] = useState({});
  //const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const validationErrors = {};
    if (!formData.name.trim()) {
      validationErrors.name = "channel name is required.";
    }
    if (!formData.channel_type) {
      validationErrors.channel_type = "channel type is required.";
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
    const url = `http://127.0.0.1:8000/api/channels/`
    try {
      const response = await axios.post(url, formData, config);
      setFormData({
        name: "",
        description: "",
        channel_type: "private",
      });
      //console.log("Channel created:", response.data);
    } catch (error) {
      console.error("Error creating topic:", error.response?.data || error.message);
      setErrors({ apiError: "Failed to create topic. Please try again." });
    }
  };

  return (
    <div className="form-container">
      <h4>Create a New Channel</h4>
      <form onSubmit={handleSubmit} className="create-topic-form">
        <div className="form-group d-flex flex-column">
          <label htmlFor="topicTitle">Channel name: </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? "error" : ""}
            style={{border:'1px solid #111', width:'300px', borderRadius:'5px', padding:'10px'}}
          />
          {errors.name && <small className="error-text">{errors.name}</small>}
        </div>

        <div className="form-group d-flex flex-column">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={{border:'1px solid #111', width:'300px', borderRadius:'5px', padding:'10px'}}
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="channel_type">channel_type</label>
          <select
            id="channel_type"
            name="channel_type"
            value={formData.channel_type}
            onChange={handleChange}
            className={errors.channel_type ? "error" : ""}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
          {errors.channel_type && <small className="error-text">{errors.channel_type}</small>}
        </div>

        {errors.apiError && <p className="error-text">{errors.apiError}</p>}

        <button type="submit" className="btn btn-primary">
          Create Channel
        </button>
      </form>
    </div>
  );
};

export default CreateChannel;
