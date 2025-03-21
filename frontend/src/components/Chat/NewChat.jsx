import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import useAccessToken from '../../features/auth/token';
import axios from 'axios';

// eslint-disable-next-line react/prop-types
const NewChat = ({ onChatStart }) => {  // onChatStart as a prop
  const { user } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const dropdownRef = useRef(null);

  // Fetch filtered items when search term changes
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

  // Handle item selection from the dropdown
  const handleItemClick = async (item) => {
    setSearchTerm(item.name);  // Set the name of the clicked user
    setIsDropdownVisible(false);  // Close the dropdown after selection

    // Call onChatStart to start a chat with the selected user
    onChatStart(item.id);  // Just pass the receiver's id
  };

  const handleInputFocus = () => {
    setIsDropdownVisible(true);
  };

  return (
    <div style={{ position: 'relative', width: '300px', margin: '20px auto' }}>
      <div style={{display:'flex', alignItems:'center', paddingLeft:'10px'}}>
        <span>To: </span>
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus} // Show dropdown on focus
          placeholder="Search..."
          style={{ width: '80%', padding: '8px', fontSize: '16px' }}
        />
      </div>
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
        >
          {filteredItems.map((item) => (
            <li
              key={item.id}
              onClick={() => handleItemClick(item)} // Handle item click
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

export default NewChat;
