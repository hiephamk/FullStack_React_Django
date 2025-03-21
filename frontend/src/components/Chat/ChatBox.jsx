
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from "react-redux";
import useAccessToken from "../../features/auth/token";
import NewChat from './NewChat';

const ChatBox = () => {
    const { user, userInfo } = useSelector((state) => state.auth);
    const accessToken = useAccessToken(user);

    const [receiverId, setReceiverId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch the messages between sender and receiver
    const fetchMessages = async () => {
        if (!receiverId) return;

        const url = `http://127.0.0.1:8000/api/get_messages/`;
        const config = {
            headers: { Authorization: `Bearer ${accessToken}` },
        };

        setLoading(true);
        try {
            const response = await axios.get(url, {
                params: {
                    sender: userInfo.id,
                    receiver: receiverId,
                },
                headers: config.headers,
            });

            setMessages(response.data.messages || []);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setMessages([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [receiverId, accessToken, userInfo]);

    // Send a message
    const handleSendMessage = async () => {
        if (!receiverId || !message.trim()) return;

        const url = "http://127.0.0.1:8000/api/start_chat/";
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        };

        try {
            const response = await axios.post(
                url,
                {
                    receiver: receiverId,
                    content: message,
                    sender: userInfo.id,
                },
                config
            );

            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    id: response.data.id,
                    sender: {
                        id: userInfo.id,
                    },
                    content: message,
                    timestamp: new Date().toISOString(),
                },
            ]);

            setMessage('');
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    // Handle selecting a receiver
    const handleChatStart = (receiverId) => {
        setReceiverId(receiverId);
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

        if (
            messageDate.toDateString() === today.toDateString()
        ) {
            return "Today";
        } else if (
            messageDate.toDateString() === yesterday.toDateString()
        ) {
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
            <NewChat onChatStart={handleChatStart} />
            {receiverId && (
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
                                                className={`message ${msg.sender.id === userInfo.id ? 'sent' : 'received'}`}
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

export default ChatBox;
