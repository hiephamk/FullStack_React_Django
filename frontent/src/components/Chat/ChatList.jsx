
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useAccessToken from '../../features/auth/token';
import axios from 'axios';
import PropTypes from 'prop-types';


const ChatList = ({ onChatStart }) => {
    const { user, userInfo } = useSelector((state) => state.auth);
    const accessToken = useAccessToken(user);

    const [chatList, setChatList] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [receiverId, setReceiverId] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);


    useEffect(() => {
        const fetchChatList = async () => {
            if(!accessToken){
                console.error ("cannot get acceToken")
                return;
            }else{
                console.log("accessToken", accessToken)
            }
            const url = `http://127.0.0.1:8000/api/chat/`;
            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            };
            try {
                const response = await axios.get(url, config);
                
                const filteredMessages = response.data.filter(
                    (msg) => msg.sender === userInfo.id
                );
                setChatList(filteredMessages);
                console.log("chatlist", response.data);
            } catch (error) {
                console.error('Cannot fetch chat list', error.response || error.message);
            }
        };
        if (accessToken && userInfo?.id) {
            fetchChatList();
        }
    }, [accessToken,receiverId, userInfo?.id]);

    const handleItemClick = (msg) => {
        setSearchTerm(msg.receiver_name || msg.member_name);
        setReceiverId(msg.receiver || msg.members);
        setIsSidebarOpen(true);
        if (onChatStart) {
            onChatStart(msg.receiver || msg.members);
        }
    };

    const fetchMessages = async () => {
        if (!receiverId) return;

        const url = `http://127.0.0.1:8000/api/get_messages/`;
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
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

            setChatMessages(response.data.messages || []);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setChatMessages([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [receiverId, accessToken, userInfo?.id]);

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

            setChatMessages((prevMessages) => [
                ...prevMessages,
                response.data, // Assume the API returns the created message
            ]);

            setMessage('');
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleCloseSidebar = () => {
        setIsSidebarOpen(false);
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
            messageDate.getDate() === today.getDate() &&
            messageDate.getMonth() === today.getMonth() &&
            messageDate.getFullYear() === today.getFullYear()
        ) {
            return "Today";
        } else if (
            messageDate.getDate() === yesterday.getDate() &&
            messageDate.getMonth() === yesterday.getMonth() &&
            messageDate.getFullYear() === yesterday.getFullYear()
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
            hour12: false, // Optional: Use `false` for 24-hour format
        });
    };
    return (
        <div>
            <div className="chat-list" style={{ width: '300px', margin: '20px auto' }}>
                <p><strong>Chat History:</strong></p>
                <ul>
                    {chatList.map((msg) => (
                        <li key={msg.id}>
                            <button onClick={() => handleItemClick(msg)}>
                                {msg.receiver_name || msg.member_name || 'Unknown User'}
                                
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {isSidebarOpen && receiverId && (
                <div className="sidebar">
                    <div className="sidebar-content">
                        <div className="sidebar-header">
                            <h5>{searchTerm}</h5>
                            <button onClick={handleCloseSidebar}>Close</button>
                        </div>
                        <div className="chat-box">
                            {loading ? (
                                <div>Loading...</div>
                            ) : (
                                <div >
                                    {Object.entries(groupMessagesByDate(chatMessages)).map(([date, messages]) => (
                                        <div key={date} className="messages">
                                            <div className="date-label">{formatDateLabel(date)}</div>
                                            {messages.map((msg) => (
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
                                placeholder="Type a message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <button onClick={handleSendMessage}>Send</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

ChatList.propTypes = {
    onChatStart: PropTypes.func.isRequired,
};

export default ChatList;

