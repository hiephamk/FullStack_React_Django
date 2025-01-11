// import { useState, useRef, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import useAccessToken from '../../features/auth/token';
// import axios from 'axios';



// const AddMembersToCircle = () => {
//   const { user, userInfo } = useSelector((state) => state.auth);
//   const accessToken = useAccessToken(user);

//   const [circles, setCircles] = useState([]); // List of user's circles
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredItems, setFilteredItems] = useState([]);
//   const [isDropdownVisible, setIsDropdownVisible] = useState(false);
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [notifications, setNotifications] = useState([])

//   const dropdownRef = useRef(null);

//   const fetchCircles = async () => {
//     if (!accessToken) return;
  
//     try {
//       const response = await axios.get('http://127.0.0.1:8000/api/circles/', {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });
//       const userCircles = response.data.filter(
//         (circle) =>
//           circle.owner === userInfo.id
//       );
  
//       setCircles(userCircles);
//     } catch (error) {
//       console.error('Error fetching circles:', error);
//     }
//   };
//   const fetchNotification = async () => {
//     try {
//       const response = await axios.get('http://127.0.0.1:8000/api/circles/notifications/',{
//         headers: { Authorization: `Bearer ${accessToken}` },
//       })
//       setNotifications(response)
//     }catch (error) {
//       console.error('Error fetching circles:', error);
//     }
//   }
//   useEffect(() => {
//     if (accessToken){
//       fetchCircles();
//       fetchNotification()
//     }
//   }, [accessToken, setCircles]);

//   const handleInputChange = async (e) => {
//     const keyword = e.target.value;
//     setSearchTerm(keyword);

//     if (!accessToken || keyword.trim() === '') {
//       setFilteredItems([]);
//       setIsDropdownVisible(false);
//       return;
//     }

//     try {
//       const response = await axios.get(
//         `http://127.0.0.1:8000/api/search-items/?q=${keyword}`,
//         {
//           headers: { Authorization: `Bearer ${accessToken}` },
//         }
//       );
//       const items = Array.isArray(response.data.items) ? response.data.items : [];
//       setFilteredItems(items);
//       setIsDropdownVisible(true);
//     } catch (error) {
//       console.error('Error fetching items:', error);
//       setFilteredItems([]);
//     }
//   };

//   const handleItemClick = (item) => {
//     if (!selectedUsers.some((user) => user.id === item.id)) {
//       setSelectedUsers([...selectedUsers, item]);
//     }
//     setSearchTerm('');
//     setIsDropdownVisible(false);
//   };

//   const handleRemoveUser = (id) => {
//     setSelectedUsers(selectedUsers.filter((user) => user.id !== id));
//   };

//   const handleAddMembersToCircle = async () => {
//     if (!accessToken) {
//       console.log('Cannot get access token');
//       return;
//     }
  
//     const url = `http://127.0.0.1:8000/api/circles/`;
//     const config = {
//       headers: { Authorization: `Bearer ${accessToken}` },
//     };
  
//     if (selectedUsers.length > 0) {
//       try {
//         if (circles.length === 0) {
//           const memberIds = selectedUsers.map((user) => user.id).filter((id) => id != null);
//           console.log("Creating Circle with Members:", memberIds);
//           await axios.post(
//             url,
//             { members: memberIds, owner: userInfo.id },
//             config
//           );
//           // for (const nofif of notifications){
//           //   if(nofif.status === 'approved') {
//           //   }
//           // }
//           alert('New circle created and members added successfully!');
//         } else {
//           const existingCircle = circles[0]; // Assuming one circle
//           const existingMemberIds = (existingCircle.members || []).map((member) =>
//             typeof member === 'object' && member.id ? member.id : member
//           ).filter((id) => id != null);
//           const newMemberIds = selectedUsers.map((user) => user.id).filter((id) => id != null);
//           const updatedMemberIds = Array.from(new Set([...existingMemberIds, ...newMemberIds]));
          
//           // Assume the first selected user will become the new owner (user B)
//           const newOwnerId = selectedUsers[0].id;
  
//           await axios.patch(
//             `${url}${existingCircle.id}/`,
//             {
//               members: updatedMemberIds,
//               new_owner: newOwnerId,  // Pass the new owner when updating
//             },
//             config
//           );
//           alert('New members added and ownership transferred successfully!');
//         }
  
//         fetchCircles(); // Refresh circles after successful operation
//         setSelectedUsers([]); // Clear selected users
//       } catch (error) {
//         console.error('Error adding members to circle:', error.response?.data || error.message);
//       }
//     }
//   };

//   return (
//     <div style={{ position: 'relative', width: '300px', margin: '20px auto' }}>
//       <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '10px' }}>
//         <span>To: </span>
//         <input
//           type="text"
//           value={searchTerm}
//           onChange={handleInputChange}
//           placeholder="Search..."
//           style={{ width: '80%', padding: '8px', fontSize: '16px' }}
//         />
//       </div>

//       {selectedUsers.length > 0 && (
//         <div style={{ margin: '10px 0' }}>
//           {selectedUsers.map((user) => (
//             <div key={user.id} style={{ display: 'inline-block', margin: '5px' }}>
//               <span style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '5px' }}>
//                 {user.name}
//                 <button
//                   onClick={() => handleRemoveUser(user.id)}
//                   style={{ marginLeft: '5px', color: 'red', cursor: 'pointer' }}
//                 >
//                   ×
//                 </button>
//               </span>
//             </div>
//           ))}
//         </div>
//       )}

//       {isDropdownVisible && filteredItems.length > 0 && (
//         <ul
//           ref={dropdownRef}
//           style={{
//             position: 'absolute',
//             top: '100%',
//             left: '0',
//             right: '0',
//             background: 'white',
//             border: '1px solid #ccc',
//             listStyle: 'none',
//             padding: '0',
//             margin: '0',
//             zIndex: 1000,
//           }}
//         >
//           {filteredItems.map((item) => (
//             <li
//               key={item.id}
//               onClick={() => handleItemClick(item)}
//               style={{
//                 padding: '8px',
//                 cursor: 'pointer',
//                 borderBottom: '1px solid #eee',
//               }}
//             >
//               {item.name}
//             </li>
//           ))}
//         </ul>
//       )}

//       <button
//         onClick={handleAddMembersToCircle}
//         disabled={selectedUsers.length === 0}
//         style={{ marginTop: '10px' }}
//       >
//         Add Member
//       </button>
//       <div>
//         {circles.length > 0 ? (
//           circles.map((member) => (
//             <div key={member.id}>
//               <p>Members: {member.member_name}</p>
//             </div>
//           ))
//         ): (null)}
//       </div>
//     </div>
//   );
// };

// export default AddMembersToCircle;

import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useAccessToken from '../../features/auth/token';
import axios from 'axios';

const AddMembersToCircle = () => {
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);

  const [circles, setCircles] = useState([]); // List of user's circles
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const dropdownRef = useRef(null);

  const fetchCircles = async () => {
    if (!accessToken) return;

    try {
      const response = await axios.get('http://127.0.0.1:8000/api/circles/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const userCircles = response.data.filter(
        (circle) => circle.owner === userInfo.id
      );

      setCircles(userCircles);
    } catch (error) {
      console.error('Error fetching circles:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/circles/notifications/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchCircles();
      fetchNotifications();
    }
  }, [accessToken]);

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

  const handleAddMembersToCircle = async () => {
    if (!accessToken) {
      console.log('Cannot get access token');
      return;
    }

    const notificationUrl = `http://127.0.0.1:8000/api/circles/notifications/`;
    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    if (selectedUsers.length > 0) {
      try {
        // if (circles.length === 0) {
          // Create a new circle with selected members
          const memberIds = selectedUsers.map((user) => user.id).filter((id) => id != null);
          // Create notifications for members
          for (const memberId of memberIds) {
            await axios.post(
              notificationUrl,
              { receiver: memberId, sender: userInfo.id, message:`${userInfo.first_name} want to add you to the circle!`},
              config
            );
          }
        // } else {
        //   // Update the existing circle
        //   const existingCircle = circles[0]; // Assuming one circle
        //   const existingMemberIds = (existingCircle.members || []).map((member) =>
        //     typeof member === 'object' && member.id ? member.id : member
        //   ).filter((id) => id != null);
        //   const newMemberIds = selectedUsers.map((user) => user.id).filter((id) => id != null);
          //const updatedMemberIds = Array.from(new Set([...existingMemberIds, ...newMemberIds]));

          // Patch the circle with updated members
          // await axios.patch(
          //   `${url}${existingCircle.id}/`,
          //   { members: updatedMemberIds },
          //   config
          // );

          // Create notifications for new members
          // for (const memberId of newMemberIds) {
          //   if (!existingMemberIds.includes(memberId)) {
          //     await axios.post(
          //       notificationUrl,
          //       { member: memberId, circle: existingCircle.id, type: 'invite' },
          //       config
          //     );
          //   }
          // }

          alert('New members added and notifications sent successfully!');
        

        fetchCircles(); // Refresh circles
        setSelectedUsers([]); // Clear selected users
      } catch (error) {
        console.error('Error adding members to circle:', error.response?.data || error.message);
      }
    }
  };

  return (
    <div style={{ position: 'relative', width: '300px', margin: '20px auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '10px' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search..."
          style={{ width: '80%', padding: '8px', fontSize: '16px', border:'1px solid #1113', borderRadius:'7px' }}
        />
        <button
        onClick={handleAddMembersToCircle}
        disabled={selectedUsers.length === 0}
        className='btn btn-primary m-1' style={{borderRadius:'7px'}}
      >
        Add
      </button>
      </div>

      {selectedUsers.length > 0 && (
        <div style={{ margin: '10px 0' }}>
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

export default AddMembersToCircle;
