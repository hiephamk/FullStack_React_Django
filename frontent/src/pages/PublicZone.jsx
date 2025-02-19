import { useState, useEffect, useMemo } from "react";
import NavPublic from "../components/navigation/NavPublic";
import CreatePublicZonePost from "../components/PublicZone/CreatePublicZonePost";
import usePublicZone from "../features/Hooks/usePublicZone";
import { Outlet } from "react-router-dom";
import UserImg from "../components/UserImg";
import formatDate from "../features/formatDate";
import { Link } from "react-router-dom";
import anonymous from "../assets/anonymous.png";
import FetchContent from "../components/PublicZone/FetchContent";

const PublicZone = () => {
  const [topic, setTopic] = useState("General");
  const [loading, setLoading] = useState(true); // New loading state
  const content = usePublicZone();
  const [contents, setContent] = useState([])
  useEffect(() => {
    if (content.length > 0) {
      setLoading(false);
    }
  }, [content]);

  const handleTopicClick = (text) => {
    setTopic(text);
  };
  return (
    <>
      <NavPublic />
      <div className="page-container">
        <div className="left-container">
          <div className="left-content">
            <button onClick={() => handleTopicClick("General")}>
              <p>General</p>
            </button>
            <button onClick={() => handleTopicClick("Healthcare")}>
              <p>Healthcare</p>
            </button>
            <button onClick={() => handleTopicClick("Technology")}>
              <p>Technology</p>
            </button>
          </div>
        </div>
        <div className="main-container">
          <div className="main-content">
            <h1>Topic: {topic}</h1>
            <FetchContent contents={contents} setContent={setContent} topic={topic}/>
          </div>
        </div>
        <div className="right-container">
          <div className="main-content bg-light">
            <CreatePublicZonePost />
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicZone;

