import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import useAccessToken from "../../features/auth/token";

function Notifications() {
  const {user} = useSelector((state) => state.auth)
  const accessToken = useAccessToken(user)

  const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
          const url = `http://127.0.0.1:8000/api/notifications/`
          const congfig = {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
            try {
                const response = await axios.get(url, congfig); // API endpoint for fetching notifications
                setNotifications(response.data);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();
    }, [accessToken]);

    const handleAction = async (membershipId, action) => {
      const url = `http://127.0.0.1:8000/api/membership/${membershipId}/${action}/`;
      const config = {
          headers: {
              Authorization: `Bearer ${accessToken}`,
          },
      };
  
      try {
          const response = await axios.post(url, {}, config); // Correct argument order
          alert(response.data.detail);
  
          // Optionally, refresh notifications or update state
          const updatedNotifications = notifications.filter(
              (notif) => notif.membership !== membershipId
          );
          setNotifications(updatedNotifications);
      } catch (error) {
          if (error.response) {
              console.error('API Error:', error.response.data);
              alert(error.response.data.detail || 'An error occurred');
          } else {
              console.error('Error:', error.message);
          }
      }
  };
  

    return (
        <div>
            <h2>Notifications</h2>
            {notifications.length > 0 ? (
                notifications.map((notif) => (
                    <div key={notif.id} style={{ backgroundColor: notif.is_read ? "#111" : "#1113" }}>
                        <p>{notif.message}</p>
                        <small>{new Date(notif.created_at).toLocaleString()}</small>
                        
                        {/* Show Approve/Reject buttons for join requests */}
                        {notif.membership ? (
                            <div>
                                <button
                                    onClick={() => handleAction(notif.membership, "approve")}
                                    style={{ border: "1px solid #111", margin: "5px" }}
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleAction(notif.membership, "reject")}
                                    style={{ border: "1px solid #111", margin: "5px" }}
                                >
                                    Reject
                                </button>
                            </div>
                        ) : (
                            <p>Membership information missing</p>
                        )}

                    </div>
                ))
            ) : (
                <p>No notifications</p>
            )}
        </div>
    );
}

export default Notifications;
