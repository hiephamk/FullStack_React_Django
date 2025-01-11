import {useState, useEffect} from 'react'
import { useSelector  } from 'react-redux'
import useAccessToken from '../../features/auth/token'
import axios from 'axios'
import UserImg from '../UserImg'

// eslint-disable-next-line react/prop-types
const ChatListGroup = ({ onChatStart }) => {
    const { user, userInfo } = useSelector((state) => state.auth);
    const accessToken = useAccessToken(user);

    const [chatList, setChatList] = useState([]);
    const [chatId, setChatId] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [contents, setContents] = useState([])
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [receiverId, setReceiverId] = useState([]);
    const [members, setMembers] = useState([])
    const [loading, setLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleItemClick = (msg) => {
        setSearchTerm(msg.group_name);
        setMembers(msg.member_name)
        setChatId(msg.id);
        setReceiverId(msg.members);
        setIsSidebarOpen(true);
        if (onChatStart) {
            onChatStart(msg.id);
        }
    };
    useEffect(() => {
        const fetchChatList = async () => {
            if (!accessToken) return;
            const url = `http://127.0.0.1:8000/api/chat/`;
            const config = {
                headers: { Authorization: `Bearer ${accessToken}` },
            };
            try {
                const response = await axios.get(url, config);
                //console.log("Chat List Response:", response.data); // Debug response
                const filteredChats = response.data?.filter((chat) => chat.members.some((member) => member === userInfo.id)) || [];
                setChatList(filteredChats);
            } catch (error) {
                console.error('Cannot fetch chat list:', error.response || error.message);
            }
        };
        if (accessToken && userInfo?.id) {
            fetchChatList();
        }
    }, [accessToken, userInfo?.id, receiverId]); // Updated dependencies
    
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
    const fetchMessages = async () => {
        if (!chatId || !accessToken){
            return;
        }else {
            console.log(accessToken)
        }
        const url = `http://127.0.0.1:8000/api/messages/${chatId}`;
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        setLoading(true);
        try {
            const response = await axios.get(url, {
                params: { chat_id: chatId },
                headers: config.headers, // Move headers here
            });
            console.log("chatId:", chatId)
            console.log("message:", response.data)
            setChatMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setChatMessages([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [accessToken, chatId]);
    
    const handleSendMessage = async () => {
        if (!chatId || !message.trim()) return;

        const url = `http://127.0.0.1:8000/api/messages/${chatId}/send/`
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

  return (
    <div>
        <div>
            <div className="chat-list">
                <ul>
                    {chatList.map((msg) => (
                        <li key={msg.id}>
                            <button onClick={() => handleItemClick(msg)}>
                                <div style={{display:'flex', justifyContent:'space-evenly'}}>
                                    <div className='circle-container'>
                                        <div className='circle-item'>
                                            {msg.member_profile_imgs?.map((img, index) => (
                                                <UserImg key={index} profileImg={`http://127.0.0.1:8000${img}`}  />
                                            ))}
                                        </div>
                                    </div>
                                    <div>{msg.group_name  || 'Unknown User'}</div>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {isSidebarOpen && chatId && (
                <div className="sidebar" style={{backgroundColor:'#2471a3'}}>
                    <div className="sidebar-content">
                        <div className="sidebar-header">
                        <div className="dropdown">
                            <button 
                                className="dropdown-toggle"
                                style={{marginLeft:'10px',padding:'5px'}}
                                type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <strong>{searchTerm}</strong>
                            </button>
                            <ul className="dropdown-menu px-1">
                                <li>{members}</li>
                            </ul>
                            </div>
                            <button onClick={handleCloseSidebar}><strong>Close</strong></button>
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
                                                    className={`message ${msg.sender === userInfo.id ? 'sent' : 'received'}`}
                                                    style={{
                                                        textAlign: msg.sender === userInfo.id ? 'right' : 'left'
                                                    }}
                                                >
                                                    <div style={{display:'flex',flexDirection:'row', justifyContent:'space-between', alignItems:'flex-end'}}>
                                                        <div >
                                                            {msg.sender === userInfo.id ? null : 
                                                                msg.author_profile_img && (
                                                                <UserImg profileImg={`http://127.0.0.1:8000${msg.author_profile_img}`} />
                                                                )
                                                            }
                                                        </div>
                                                        <div className='msg-content' style={{backgroundColor: msg.sender === userInfo.id ? '#d1f7c4' : '#f1f0f0',}}>
                                                            <p>{msg.content}</p>
                                                            <p className='conv-date'>{formatDateCon(msg.timestamp)}</p>
                                                        </div>
                                                    </div>
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
                    </div>
                </div>
            )}
        </div>
    </div>
  )
}

export default ChatListGroup
