import { useState} from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import useAccessToken from "../../features/auth/token";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateTopic = () => {
  const { user, userInfo } = useSelector((state) => state.auth) || {};
  const accessToken = useAccessToken(user);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newSubtopicTitle, setNewSubtopicTitle] = useState("");  
  
  // Handle creating a new topic
  const handleCreateTopic = async () => {
    if (!newTopicTitle) {
      toast.error("Topic title cannot be empty.");
      return;
    }
    const topicUrl = `http://127.0.0.1:8000/api/topics/`;
    const config = { headers: { Authorization: `Bearer ${accessToken}` } };

    try {
      await axios.post(
        topicUrl,
        { topicTitle: newTopicTitle,
          author: userInfo.id,
         },
        config
      );
      setNewTopicTitle("");
      toast.success("Topic created successfully!");
    } catch (error) {
      console.error("Error creating topic:", error.response || error.message);
      toast.error("Failed to create topic.");
    }
  };
  return (
    <div>
      <form onClick={handleCreateTopic}>
        <input 
          type="text"
          value={newSubtopicTitle}
          onChange={(e) => setNewSubtopicTitle(e.target.value)}
        />
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

export default CreateTopic;
