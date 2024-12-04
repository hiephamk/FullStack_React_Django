// // import { useState } from "react";
// // import axios from "axios";
// // import { toast } from "react-toastify";
// // import PropTypes from "prop-types";

// // const CreateSubTopic = ({ selectedTopic, accessToken, userInfo, onSubtopicCreated }) => {
// //   const [subtopicTitle, setSubtopicTitle] = useState("");
// //   const [subtopicDescription, setSubtopicDescription] = useState("");

// //   const handleCreateSubtopic = async (e) => {
// //     e.preventDefault();

// //     if (!subtopicTitle.trim()) {
// //       toast.error("Subtopic title cannot be empty.");
// //       return;
// //     }

// //     try {
// //       const subtopicUrl = `http://127.0.0.1:8000/api/subtopics/`;
// //       const config = { headers: { Authorization: `Bearer ${accessToken}` } };

// //       const newSubtopic = {
// //         subTopicTitle: subtopicTitle,
// //         subTopicDescription: subtopicDescription,
// //         topic: selectedTopic, // Link the subtopic to the selected topic
// //         author: userInfo.id,
// //       };

// //       const response = await axios.post(subtopicUrl, newSubtopic, config);

// //       // Notify the parent component about the new subtopic
// //       onSubtopicCreated(response.data);

// //       // Reset form fields
// //       setSubtopicTitle("");
// //       setSubtopicDescription("");

// //       toast.success("Subtopic created successfully!");
// //     } catch (error) {
// //       console.error("Error creating subtopic:", error.response?.data || error.message);
// //       toast.error("Failed to create subtopic.");
// //     }
// //   };

// //   return (
// //     <form
// //       onSubmit={handleCreateSubtopic}
// //       style={{
// //         marginTop: "10px",
// //         padding: "10px",
// //         border: "1px solid #ccc",
// //         borderRadius: "5px",
// //         backgroundColor: "#f9f9f9",
// //       }}
// //     >
// //       <h4>Create a Subtopic</h4>
// //       <input
// //         type="text"
// //         value={subtopicTitle}
// //         onChange={(e) => setSubtopicTitle(e.target.value)}
// //         placeholder="Subtopic Title"
// //         style={{ display: "block", margin: "5px 0", width: "100%" }}
// //       />
// //       <textarea
// //         value={subtopicDescription}
// //         onChange={(e) => setSubtopicDescription(e.target.value)}
// //         placeholder="Subtopic Description"
// //         style={{ display: "block", margin: "5px 0", width: "100%" }}
// //       />
// //       <button type="submit" className="btn btn-primary btn-sm">
// //         Add Subtopic
// //       </button>
// //     </form>
// //   );
// // };

// // CreateSubTopic.propTypes = {
// //   selectedTopic: PropTypes.number.isRequired,
// //   accessToken: PropTypes.string.isRequired,
// //   userInfo: PropTypes.object.isRequired,
// //   onSubtopicCreated: PropTypes.func.isRequired,
// // };

// // export default CreateSubTopic;

// // 

// import { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import useAccessToken from '../../features/auth/token';

// // eslint-disable-next-line react/prop-types
// const CreateSubTopic = ({ onSubtopicCreated }) => {
//   const { topicId } = useParams(); // Get topicId from URL
//   const { user, userInfo } = useSelector((state) => state.auth);
//   const accessToken = useAccessToken(user);
//   const navigate = useNavigate();

//   const [subtopicTitle, setSubtopicTitle] = useState('');
//   const [content, setContent] = useState('');

//   const handleCreateSubtopic = async (e) => {
//     e.preventDefault();

//     if (!subtopicTitle.trim() || !content.trim()) {
//       toast.error('Both subtopic title and content are required.');
//       return;
//     }

//     try {
//       const subtopicUrl = `http://127.0.0.1:8000/api/subtopics/`;
//       const postUrl = `http://127.0.0.1:8000/api/posts/`;
//       const config = { headers: { Authorization: `Bearer ${accessToken}` } };

//       // Create subtopic
//       const subtopicResponse = await axios.post(
//         subtopicUrl,
//         {
//           subTopicTitle: subtopicTitle,
//           subTopicDescription: content, // Content becomes subtopic description
//           topic: topicId, // Link the subtopic to the topicId
//           author: userInfo.id,
//         },
//         config
//       );
      
//       const subtopicId = subtopicResponse.data.id; // Get the ID of the created subtopic

//       // Create a post linked to the new subtopic
//       const postResponse = await axios.post(
//         postUrl,
//         {
//           title: subtopicTitle, // Subtopic title becomes post title
//           content: content, // Content becomes post details
//           subtopic: subtopicId, // Link the post to the newly created subtopic
//           author: userInfo.id,
//         },
//         config
//       );
//       const postData = postResponse.data;

//       // Notify parent component to update state
//       if (onSubtopicCreated) {
//         onSubtopicCreated({
//           subtopic: subtopicId,
//           post: postData,
//         });
//       }
//       // Notify success and reset form fields
//       toast.success('Subtopic and post created successfully!');
//       setSubtopicTitle('');
//       setContent('');

//       // Navigate back to the channel page
//       navigate(`/home/channels/mychannel/posts/${subtopicId}`);
//     } catch (error) {
//       console.error('Error creating subtopic and post:', error.response?.data || error.message);
//       toast.error('Failed to create subtopic and post.');
//     }
//   };

//   return (
//     <div style={{ margin: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
//       <h3>Create Subtopic for Topic ID: {topicId}</h3>
//       <form onSubmit={handleCreateSubtopic}>
//         <input
//           type="text"
//           value={subtopicTitle}
//           onChange={(e) => setSubtopicTitle(e.target.value)}
//           placeholder="Subtopic Title"
//           style={{ display: 'block', margin: '10px 0', width: '100%' }}
//         />
//         <textarea
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           placeholder="Subtopic Details"
//           style={{ display: 'block', margin: '10px 0', width: '100%' }}
//         />
//         <button type="submit" className="btn btn-primary">
//           Create Subtopic
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CreateSubTopic;

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import useAccessToken from "../../features/auth/token";

// eslint-disable-next-line react/prop-types
const CreateSubTopic = ({ onSubtopicCreated }) => {
  const { topicId } = useParams();
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);
  const navigate = useNavigate();

  const [subtopicTitle, setSubtopicTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null); // State for file (image/video)

  const handleCreateSubtopic = async (e) => {
    e.preventDefault();

    if (!subtopicTitle.trim() || (!content.trim() && !file)) {
      toast.error("Subtopic title and either content or file are required.");
      return;
    }

    try {
      const subtopicUrl = `http://127.0.0.1:8000/api/subtopics/`;
      const postUrl = `http://127.0.0.1:8000/api/posts/`;
      const config = { headers: { Authorization: `Bearer ${accessToken}` } };

      // Create subtopic
      const subtopicResponse = await axios.post(
        subtopicUrl,
        {
          subTopicTitle: subtopicTitle,
          subTopicDescription: content,
          topic: topicId,
          author: userInfo.id,
        },
        config
      );

      const subtopicId = subtopicResponse.data.id;

      // Prepare FormData for file and content
      const formData = new FormData();
        formData.append("title", subtopicTitle);
        formData.append("content", content);
        formData.append("subtopic", subtopicId);
        formData.append("author", userInfo.id);
        if (file) {
          formData.append("file", file); // Attach the file here
        }

        // Log FormData to ensure the file is attached
        for (let pair of formData.entries()) {
          console.log(pair[0], pair[1]);
        }

      // Create post
      const postResponse = await axios.post(postUrl, formData, {
        headers: {
          ...config.headers,
          "Content-Type": "multipart/form-data",
        },
      });

      const postData = postResponse.data;

      // Notify parent component
      if (onSubtopicCreated) {
        onSubtopicCreated({
          subtopic: subtopicId,
          post: postData,
        });
      }

      toast.success("Subtopic and post created successfully!");
      setSubtopicTitle("");
      setContent("");
      setFile(null);

      navigate(`/home/channels/mychannel/posts/${subtopicId}`);
    } catch (error) {
      console.error("Error creating subtopic and post:", error.response?.data || error.message);
      toast.error("Failed to create subtopic and post.");
    }
  };

  return (
    <div style={{ margin: "20px", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
      <h3>Create Subtopic for Topic ID: {topicId}</h3>
      <form onSubmit={handleCreateSubtopic}>
        <input
          type="text"
          value={subtopicTitle}
          onChange={(e) => setSubtopicTitle(e.target.value)}
          placeholder="Post Title"
          style={{ display: "block", margin: "10px 0", width: "100%", padding:"10px" }}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Post details"
          style={{ display: "block", margin: "10px 0", width: "100%", padding:"10px" }}
        />
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setFile(e.target.files[0])} // Handle file selection
          style={{ display: "block", margin: "10px 0", borderRadius:'7px' }}
        />
        <button type="submit" className="btn btn-primary">
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreateSubTopic;
