import React, { useState } from "react";
import CreateChanel from "./CreateChanel";
import CreateSubTopic from "./CreateSubTopic";

const ParentComponent = () => {
  const [chanels, setChanels] = useState([]);
  const [subtopics, setSubtopics] = useState([]); 

  const handleSubtopicCreated = ({ subtopic }) => {
    setSubtopics((prevSubtopics) => [...prevSubtopics, subtopic]);
  };
  return (
    <>
      <div>
        <CreateChanel setChanel={setChanels} />
        {chanels.map((chanel) => (
          <div key={chanel.id}>{chanel.topicTitle}</div>
        ))}
      </div>
      <div>
      {/* Pass the callback as a prop to CreateSubTopic */}
      <CreateSubTopic onSubtopicCreated={handleSubtopicCreated} />

      {/* Render the list of subtopics */}
      {subtopics.map((subtopic) => (
        <div key={subtopic.id}>
          <h4>{subtopic.subTopicTitle}</h4>
          <p>{subtopic.subTopicDescription}</p>
        </div>
      ))}
    </div>
    </>
  );
};

export default ParentComponent;
