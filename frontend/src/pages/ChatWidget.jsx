import React, { useState } from "react";

//import ChatBox from "../components/Chat/ChatBox";
import Chats from "../components/Chat/Chats";

const ChatWidget = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div style={styles.widgetContainer}>
      {/* Toggle Button */}
      <button onClick={toggleChat} style={styles.chatButton}>
        Chat
      </button>

      {/* Chat Box */}
      {isChatOpen && (
        <div style={styles.chatBox}>
          <div style={styles.chatHeader}>
            <h4>Chat</h4>
            <button onClick={toggleChat} style={styles.closeButton}>
              ✖
            </button>
          </div>
          {/* <div style={styles.chatContent}>
            <ChatBox/>
          </div> */}
          <div style={styles.chatContent}>
            <Chats/>
          </div>
        </div>

      )}
    </div>
  );

};

const styles = {
  widgetContainer: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: 1000,
  },
  chatButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    fontSize: "18px",
    cursor: "pointer",
  },
  chatBox: {
    width: "400px",
    height: "600px",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
  },
  chatHeader: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px",
    borderTopLeftRadius: "10px",
    borderTopRightRadius: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeButton: {
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: "18px",
    cursor: "pointer",
  },
  chatContent: {
    flex: 1,
    padding: "10px",
    overflowY: "auto",
  },
};

export default ChatWidget;
