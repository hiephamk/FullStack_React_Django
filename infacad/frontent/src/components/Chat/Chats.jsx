import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from "react-redux";
import useAccessToken from "../../features/auth/token";
//import NewChat from './NewChat';
import NewChatGroup from './NewChatGroup';

const Chats = () => {
    const { user, userInfo } = useSelector((state) => state.auth);
    const accessToken = useAccessToken(user);

    const [chatId, setChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch messages for a specific chat
    const fetchMessages = async () => {
        if (!chatId) return;

        const url = `http://127.0.0.1:8000/api/messages/${chatId}/`; // Adjusted API endpoint
        const config = {
            headers: { Authorization: `Bearer ${accessToken}` },
        };

        setLoading(true);
        try {
            const response = await axios.get(url, {
                params: {
                    chat_id: chatId
                },
                headers: config.headers,
            });
            setMessages(response.data || []);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setMessages([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [chatId, accessToken]);

    // Send a message
    const handleSendMessage = async () => {
        if (!chatId || !message.trim()) return;

        const url = `http://127.0.0.1:8000/api/messages/${chatId}/send/`; // Adjusted API endpoint
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        };

        try {
            const response = await axios.post(
                url,
                { content: message },
                config
            );

            setMessages((prevMessages) => [
                ...prevMessages,
                response.data, // Assume the API returns the created message
            ]);

            setMessage('');
            fetchMessages(); 
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    // Handle starting a new chat
    const handleChatStart = (newChatId) => {
        setChatId(newChatId);
        setMessages([]); // Reset messages for the new chat
    };

    const groupMessagesByDate = (messages) => {
        return messages.reduce((acc, msg) => {
            const date = new Date(msg.timestamp).toDateString();
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(msg);
            return acc;
        }, {});
    };

    const formatDateLabel = (dateString) => {
        const messageDate = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        if (messageDate.toDateString() === today.toDateString()) {
            return "Today";
        } else if (messageDate.toDateString() === yesterday.toDateString()) {
            return "Yesterday";
        } else {
            return messageDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });
        }
    };

    const formatDateCon = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: false,
        });
    };

    return (
        <div className="chat-container">
            <NewChatGroup onChatStart={handleChatStart} />
            {chatId && (
                <>
                    <div className="chat-box">
                        {loading ? (
                            <div>Loading...</div>
                        ) : (
                            <div>
                                {Object.entries(groupMessagesByDate(messages)).map(([date, group]) => (
                                    <div key={date} className="messages">
                                        <div className="date-label">{formatDateLabel(date)}</div>
                                        {group.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={`message ${msg.sender === userInfo.id ? 'sent' : 'received'}`}
                                                style={{
                                                    textAlign: msg.sender.id === userInfo.id ? 'right' : 'left',
                                                    margin: '10px 0',
                                                }}
                                            >
                                                <p>{msg.content}</p>
                                                <p className='conv-date'>{formatDateCon(msg.timestamp)}</p>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="chat-input">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button onClick={handleSendMessage}>Send</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Chats;

// // ChatBox.js