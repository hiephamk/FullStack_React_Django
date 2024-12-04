// import { useState, useEffect } from 'react'
// import useAccessToken from '../../features/auth/token'
// import { useSelector } from 'react-redux'
// import axios from 'axios'
// import { toast } from 'react-toastify'
// import { useNavigate } from 'react-router-dom'

// const TopicList = () => {
//   const { user, userInfo } = useSelector((state) => state.auth)
//   const accessToken = useAccessToken(user)
//   const navigate = useNavigate()

//   const [joinedTopics, setJoinedTopics] = useState([]);
//   const [topics, setTopics] = useState([]);
//   const [subtopics, setSubTopics] = useState([]);
//   const [selectedTopic, setSelectedTopic] = useState(null);
//   const [selectedSubtopic, setSelectedSubtopic] = useState(null);



//   useEffect(() => {
//     const fetchTopicAndSubTopic = async () => {
//       if (!accessToken) {
//         toast.error('Please Login again!');
//         return;
//       }
//       const url1 = `http://127.0.0.1:8000/api/membership/`;
//       const url2 = `http://127.0.0.1:8000/api/topics/`;
//       const subtopicUrl = `http://127.0.0.1:8000/api/subtopics/`;
//       const config = { headers: { Authorization: `Bearer ${accessToken}` } };

//       try {

//         const resp1 = await axios.get(url1, config)
//         const resp2 = await axios.get(url2, config)
//         const subtopicRes = await axios.get(subtopicUrl, config);

//         const status1 = resp1.data.filter((topic) => topic.user == userInfo.id && topic.status == "approved")
//         const status2 = resp2.data.filter((topic) => topic.author == userInfo.id)
//         setJoinedTopics(status1)
//         setTopics(status2);
//         setSubTopics(subtopicRes.data);
//       } catch (error) {

//         console.error('Error fetching topics/subtopics:', error.response || error.message);
//       }
//     };

//     if (user?.access) {
//       fetchTopicAndSubTopic();
//     }
//   }, [accessToken]);

//   const handleTopicClick = (topicId) => {
//     setSelectedTopic(selectedTopic === topicId ? null : topicId);
//     setSelectedSubtopic(null);
//     //navigate(`/home/channels/mychannel/${topicId}`);
//   };
//   const handleSubtopicClick = (subtopicId) => {
//     setSelectedSubtopic(selectedSubtopic === subtopicId ? null : subtopicId);
//     navigate(`/home/channels/mychannel/posts/${subtopicId}`);
//   };

//   return (
//     <div>
//       {
//         user ?
//           <div>
//             <div style={{ backgroundColor: '#fff', boxShadow: '2px 2px #1113', margin: '10px', padding: '10px', borderRadius: '7px' }}>
//               <h3>My chanels</h3>
//               <ul>
//                 {topics.map((topic) => (
//                   <div key={topic.id}>
//                     <button onClick={() => handleTopicClick(topic.id)} style={{ display: 'block', margin: '5px 0' }}>
//                       <strong>{topic.topicTitle}</strong>
//                     </button>
//                     {selectedTopic === topic.id && (
//                       <div style={{ marginLeft: '10px' }}>
//                         {subtopics
//                           .filter((subtopic) => subtopic.topic === topic.id)
//                           .map((subtopic) => (
//                             <button
//                               key={subtopic.id}
//                               onClick={() => handleSubtopicClick(subtopic.id)}
//                               style={{ display: 'block', margin: '5px 0' }}
//                             >
//                               {subtopic.subTopicTitle}

//                             </button>
//                           ))}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </ul>
//             </div>
//           </div>
//           :
//           <p>Pleease Login to see the posts</p>
//       }

//     </div>
//   )
// }

// export default TopicList

// import { useState, useEffect } from 'react';
// import useAccessToken from '../../features/auth/token';
// import { useSelector } from 'react-redux';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';

// const TopicList = () => {
//   const { user, userInfo } = useSelector((state) => state.auth);
//   const accessToken = useAccessToken(user);
//   const navigate = useNavigate();

//   const [joinedTopics, setJoinedTopics] = useState([]);
//   const [topics, setTopics] = useState([]);
//   const [subtopics, setSubTopics] = useState([]);
//   const [selectedTopic, setSelectedTopic] = useState(null);
//   const [selectedSubtopic, setSelectedSubtopic] = useState(null);
//   const [newSubtopicTitle, setNewSubtopicTitle] = useState('');
//   const [newSubtopicDescription, setNewSubtopicDescription] = useState('');

//   useEffect(() => {
//     const fetchTopicAndSubTopic = async () => {
//       if (!accessToken) {
//         toast.error('Please Login again!');
//         return;
//       }
//       const url1 = `http://127.0.0.1:8000/api/membership/`;
//       const url2 = `http://127.0.0.1:8000/api/topics/`;
//       const subtopicUrl = `http://127.0.0.1:8000/api/subtopics/`;
//       const config = { headers: { Authorization: `Bearer ${accessToken}` } };

//       try {
//         const resp1 = await axios.get(url1, config);
//         const resp2 = await axios.get(url2, config);
//         const subtopicRes = await axios.get(subtopicUrl, config);

//         const status1 = resp1.data.filter((topic) => topic.user == userInfo.id && topic.status == "approved");
//         const status2 = resp2.data.filter((topic) => topic.author == userInfo.id);
//         setJoinedTopics(status1);
//         setTopics(status2);
//         setSubTopics(subtopicRes.data);
//       } catch (error) {
//         console.error('Error fetching topics/subtopics:', error.response || error.message);
//       }
//     };

//     if (user?.access) {
//       fetchTopicAndSubTopic();
//     }
//   }, [accessToken]);

//   const handleTopicClick = (topicId) => {
//     setSelectedTopic(selectedTopic === topicId ? null : topicId);
//     setSelectedSubtopic(null);
//     setNewSubtopicTitle('');
//     setNewSubtopicDescription('');
//   };

//   const handleSubtopicClick = (subtopicId) => {
//     setSelectedSubtopic(selectedSubtopic === subtopicId ? null : subtopicId);
//     navigate(`/home/channels/mychannel/posts/${subtopicId}`);
//   };

//   const handleCreateSubtopic = async (e) => {
//     e.preventDefault();

//     if (!newSubtopicTitle.trim()) {
//       toast.error('Subtopic title cannot be empty.');
//       return;
//     }

//     try {
//       const subtopicUrl = `http://127.0.0.1:8000/api/subtopics/`;
//       const config = { headers: { Authorization: `Bearer ${accessToken}` } };

//       const newSubtopic = {
//         subTopicTitle: newSubtopicTitle,
//         subTopicDescription: newSubtopicDescription,
//         topic: selectedTopic, // Link the subtopic to the selected topic
//         author: userInfo.id,
//       };

//       const response = await axios.post(subtopicUrl, newSubtopic, config);

//       // Update subtopics dynamically
//       setSubTopics((prevSubtopics) => [...prevSubtopics, response.data]);

//       // Reset form fields
//       setNewSubtopicTitle('');
//       setNewSubtopicDescription('');

//       toast.success('Subtopic created successfully!');
//     } catch (error) {
//       console.error('Error creating subtopic:', error.response?.data || error.message);
//       toast.error('Failed to create subtopic.');
//     }
//   };

//   return (
//     <div>
//       {user ? (
//         <div>
//           <div
//             style={{
//               backgroundColor: '#fff',
//               boxShadow: '2px 2px #1113',
//               margin: '10px',
//               padding: '10px',
//               borderRadius: '7px',
//             }}
//           >
//             <h3>My Channels</h3>
//             <ul>
//               {topics.map((topic) => (
//                 <div key={topic.id}>
//                   <button
//                     onClick={() => handleTopicClick(topic.id)}
//                     style={{ display: 'block', margin: '5px 0' }}
//                   >
//                     <strong>{topic.topicTitle}</strong>
//                   </button>
//                   {selectedTopic === topic.id && (
//                     <div style={{ marginLeft: '10px' }}>
//                       {/* Subtopics List */}
//                       {subtopics
//                         .filter((subtopic) => subtopic.topic === topic.id)
//                         .map((subtopic) => (
//                           <button
//                             key={subtopic.id}
//                             onClick={() => handleSubtopicClick(subtopic.id)}
//                             style={{ display: 'block', margin: '5px 0' }}
//                           >
//                             {subtopic.subTopicTitle}
//                           </button>
//                         ))}
//                       {/* Subtopic Creation Form */}
//                       <form
//                         onSubmit={handleCreateSubtopic}
//                         style={{
//                           marginTop: '10px',
//                           padding: '10px',
//                           border: '1px solid #ccc',
//                           borderRadius: '5px',
//                           backgroundColor: '#f9f9f9',
//                         }}
//                       >
//                         <h4>Create a Subtopic</h4>
//                         <input
//                           type="text"
//                           value={newSubtopicTitle}
//                           onChange={(e) => setNewSubtopicTitle(e.target.value)}
//                           placeholder="Subtopic Title"
//                           style={{ display: 'block', margin: '5px 0', width: '100%' }}
//                         />
//                         <textarea
//                           value={newSubtopicDescription}
//                           onChange={(e) => setNewSubtopicDescription(e.target.value)}
//                           placeholder="Subtopic Description"
//                           style={{ display: 'block', margin: '5px 0', width: '100%' }}
//                         />
//                         <button type="submit" className="btn btn-primary btn-sm">
//                           Add Subtopic
//                         </button>
//                       </form>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </ul>
//           </div>
//         </div>
//       ) : (
//         <p>Please Login to see the posts</p>
//       )}
//     </div>
//   );
// };

// export default TopicList;


// import { useState, useEffect } from "react";
// import useAccessToken from "../../features/auth/token";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import CreateSubTopic from "./CreateSubTopic";

// const TopicList = () => {
//   const { user, userInfo } = useSelector((state) => state.auth);
//   const accessToken = useAccessToken(user);
//   const navigate = useNavigate();

//   const [joinedTopics, setJoinedTopics] = useState([]);
//   const [topics, setTopics] = useState([]);
//   const [subtopics, setSubTopics] = useState([]);
//   const [selectedTopic, setSelectedTopic] = useState(null);
//   const [selectedSubtopic, setSelectedSubtopic] = useState(null);

//   useEffect(() => {
//     const fetchTopicAndSubTopic = async () => {
//       if (!accessToken) {
//         toast.error("Please Login again!");
//         return;
//       }
//       const url1 = `http://127.0.0.1:8000/api/membership/`;
//       const url2 = `http://127.0.0.1:8000/api/topics/`;
//       const subtopicUrl = `http://127.0.0.1:8000/api/subtopics/`;
//       const config = { headers: { Authorization: `Bearer ${accessToken}` } };

//       try {
//         const resp1 = await axios.get(url1, config);
//         const resp2 = await axios.get(url2, config);
//         const subtopicRes = await axios.get(subtopicUrl, config);

//         const status1 = resp1.data.filter(
//           (topic) => topic.user == userInfo.id && topic.status == "approved"
//         );
//         const status2 = resp2.data.filter((topic) => topic.author == userInfo.id);
//         setJoinedTopics(status1);
//         setTopics(status2);
//         setSubTopics(subtopicRes.data);
//       } catch (error) {
//         console.error("Error fetching topics/subtopics:", error.response || error.message);
//       }
//     };

//     if (user?.access) {
//       fetchTopicAndSubTopic();
//     }
//   }, [accessToken]);

//   const handleTopicClick = (topicId) => {
//     setSelectedTopic(selectedTopic === topicId ? null : topicId);
//     setSelectedSubtopic(null);
//     navigate(`/home/channels/mychannel/${topicId}`);
//   };

//   const handleSubtopicClick = (subtopicId) => {
//     setSelectedSubtopic(selectedSubtopic === subtopicId ? null : subtopicId);
//     navigate(`/home/channels/mychannel/posts/${subtopicId}`);
//   };

//   const handleSubtopicCreated = (newSubtopic) => {
//     setSubTopics((prevSubtopics) => [...prevSubtopics, newSubtopic]);
//   };

//   return (
//     <div>
//       {user ? (
//         <div>
//           <div
//             style={{
//               backgroundColor: "#fff",
//               boxShadow: "2px 2px #1113",
//               margin: "10px",
//               padding: "10px",
//               borderRadius: "7px",
//             }}
//           >
//             <h3>My Channels</h3>
//             <ul>
//               {topics.map((topic) => (
//                 <div key={topic.id}>
//                   <button
//                     onClick={() => handleTopicClick(topic.id)}
//                     style={{ display: "block", margin: "5px 0" }}
//                   >
//                     <strong>{topic.topicTitle}</strong>
//                   </button>
//                   <button onClick={() => handleTopicClick(topicId)}>🍔</button>
//                   {selectedTopic === topic.id && (
//                     <div style={{ marginLeft: "10px" }}>
//                       {/* Subtopics List */}
//                       {subtopics
//                         .filter((subtopic) => subtopic.topic === topic.id)
//                         .map((subtopic) => (
//                           <button
//                             key={subtopic.id}
//                             onClick={() => handleSubtopicClick(subtopic.id)}
//                             style={{ display: "block", margin: "5px 0" }}
//                           >
//                             {subtopic.subTopicTitle}
//                           </button>
//                         ))}

//                     </div>
//                   )}
//                 </div>
//               ))}
//             </ul>
//           </div>
//         </div>
//       ) : (
//         <p>Please Login to see the posts</p>
//       )}
//     </div>
//   );
// };

// export default TopicList;

import { useState, useEffect } from "react";
import useAccessToken from "../../features/auth/token";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CreateSubTopic from "./CreateSubTopic";
import CreateTopic from "../Topic/CreateTopic";

const TopicList = () => {
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);
  const navigate = useNavigate();

  const [joinedTopics, setJoinedTopics] = useState([]);
  const [topics, setTopics] = useState([]);
  const [subtopics, setSubTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);

  // Fetch topics and subtopics from the server
  const fetchTopicAndSubTopic = async () => {
    if (!accessToken) {
      toast.error("Please Login again!");
      return;
    }
    const url1 = `http://127.0.0.1:8000/api/membership/`;
    const url2 = `http://127.0.0.1:8000/api/topics/`;
    const subtopicUrl = `http://127.0.0.1:8000/api/subtopics/`;
    const config = { headers: { Authorization: `Bearer ${accessToken}` } };

    try {
      const resp1 = await axios.get(url1, config);
      const resp2 = await axios.get(url2, config);
      const subtopicRes = await axios.get(subtopicUrl, config);

      const status1 = resp1.data.filter(
        (topic) => topic.user === userInfo.id && topic.status === "approved"
      );
      const status2 = resp2.data.filter((topic) => topic.author === userInfo.id);
      setJoinedTopics(status1);
      setTopics(status2);
      setSubTopics(subtopicRes.data);
    } catch (error) {
      console.error("Error fetching topics/subtopics:", error.response || error.message);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    if (user?.access) {
      fetchTopicAndSubTopic();
    }
  }, [accessToken, userInfo.id]);

  const handleTopicClick = (topicId) => {
    setSelectedTopic(selectedTopic === topicId ? null : topicId);
    setSelectedSubtopic(null);
    navigate(`/home/channels/mychannel/${topicId}`);
  };

  const handleSubtopicClick = (subtopicId) => {
    setSelectedSubtopic(selectedSubtopic === subtopicId ? null : subtopicId);
    navigate(`/home/channels/mychannel/posts/${subtopicId}`);
  };

  const handleSubtopicCreated = () => {
    // Re-fetch data after a subtopic is created
    fetchTopicAndSubTopic();
    toast.success("Subtopic added successfully!");
  };

  return (
    <div>
      {user ? (
        <div>
          <div
            style={{
              backgroundColor: "#fff",
              boxShadow: "2px 2px #1113",
              margin: "10px",
              padding: "10px",
              borderRadius: "7px",
            }}
          >
            <ul>
              {topics.map((topic) => (
                <div key={topic.id}>
                  <button
                    onClick={() => handleTopicClick(topic.id)}
                    style={{ display: "block", margin: "5px 0" }}
                  >
                    <strong>{topic.topicTitle}</strong>
                  </button>
                  {selectedTopic === topic.id && (
                    <div style={{ marginLeft: "10px" }}>

                      {subtopics
                        .filter((subtopic) => subtopic.topic === topic.id)
                        .map((subtopic) => (
                          <button
                            key={subtopic.id}
                            onClick={() => handleSubtopicClick(subtopic.id)}
                            style={{ display: "block", margin: "5px 0" }}
                          >
                            {subtopic.subTopicTitle}
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p>Please Login to see the posts</p>
      )}
    </div>
  );
};

export default TopicList;
