
import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import useAccessToken from '../../features/auth/token';
import axios from 'axios';

// eslint-disable-next-line react/prop-types
const NewChatGroup = ({ onChatStart }) => {
  const { user } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [group_name, setGroup_name] = useState('')

  const dropdownRef = useRef(null);

  const handleInputChange = async (e) => {
    const keyword = e.target.value;
    setSearchTerm(keyword);

    if (!accessToken || keyword.trim() === '') {
      setFilteredItems([]);
      setIsDropdownVisible(false);
      return;
    }

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/search-items/?q=${keyword}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const items = Array.isArray(response.data.items) ? response.data.items : [];
      setFilteredItems(items);
      setIsDropdownVisible(true);
    } catch (error) {
      console.error('Error fetching items:', error);
      setFilteredItems([]);
    }
  };

  const handleItemClick = (item) => {
    if (!selectedUsers.some((user) => user.id === item.id)) {
      setSelectedUsers([...selectedUsers, item]);
    }
    setSearchTerm('');
    setIsDropdownVisible(false);
  };

  const handleRemoveUser = (id) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id !== id));
  };

  const handleStartGroupChat = async () => {
    if(!accessToken){
      console.log("cannot get accesstoken");
      return;
    }
    if (!group_name.trim()) {
      alert('Group name cannot be empty.');
      return;
    }
    const url = `http://127.0.0.1:8000/api/start_chat_group/`;
    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    if (selectedUsers.length > 0) {
      const memberIds = selectedUsers.map((user) => user.id);

      try {
        const response = await axios.post(url, { members: memberIds, group_name: group_name }, config);

        if (response.data.id) {
          // New chat created successfully
          onChatStart(response.data.id);
        } else if (response.data.chat_id) {
          // Existing chat found
          alert(`Chat already exists (Chat ID: ${response.data.chat_id})`);
          onChatStart(response.data.chat_id);
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          const errorMessage = error.response.data.error;
          const existingChatId = error.response.data.chat_id;

          // Notify the user
          alert(`${errorMessage} (Chat ID: ${existingChatId})`);
          onChatStart(existingChatId);
        } else {
          console.error("Error starting group chat:", error);
        }
      }
    }
  };

  return (
    <div style={{ position: 'relative', width: '300px', margin: '20px auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '10px' }}>
        <input
          type="text"
          value={group_name}
          onChange={(e) => setGroup_name(e.target.value)}
          placeholder="Group name"
          style={{ width: '80%', padding: '8px', fontSize: '16px', border:'1px solid #1113', borderRadius:'7px'  }}
        />
      </div>
      <div style={{ display: 'flex',justifyContent:'space-evenly', alignItems: 'center', paddingLeft: '10px', marginTop:'10px' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Add members"
          style={{ width: '80%', padding: '8px', fontSize: '16px', marginRight:'10px', border:'1px solid #1113', borderRadius:'7px' }}
        />
        <button
        style={{border:'1px solid #3333', borderRadius:'7px', padding:'5px', background:'#138d75' }}
        onClick={handleStartGroupChat} 
        disabled={selectedUsers.length === 0}
        >
        Start
      </button>
      </div>
      {selectedUsers.length > 0 && (
        <div style={{ margin: '10px 0', color:'black' }}>
          {selectedUsers.map((user) => (
            <div key={user.id} style={{ display: 'inline-block', margin: '5px' }}>
              <span style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '5px' }}>
                {user.name}
                <button
                  onClick={() => handleRemoveUser(user.id)}
                  style={{ marginLeft: '5px', color: 'red', cursor: 'pointer' }}
                >
                  ×
                </button>
              </span>
            </div>
          ))}
        </div>
      )}
      {isDropdownVisible && filteredItems.length > 0 && (
        <ul
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: '0',
            right: '0',
            background: 'white',
            border: '1px solid #ccc',
            listStyle: 'none',
            padding: '0',
            margin: '0',
            zIndex: 1000,
          }}
          className='text-black'
        >
          {filteredItems.map((item) => (
            <li
              key={item.id}
              onClick={() => handleItemClick(item)}
              style={{
                padding: '8px',
                cursor: 'pointer',
                borderBottom: '1px solid #eee',
              }}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
      
    </div>
  );
};

export default NewChatGroup;
