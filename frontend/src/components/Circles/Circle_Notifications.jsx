import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import useAccessToken from "../../features/auth/token";

const Circle_Notifications = () => {
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const url = `http://127.0.0.1:8000/api/circles/notifications/`;
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      try {
        const response = await axios.get(url, config);
        const filter = response.data.filter(
            (notif) => notif.receiver == userInfo.id
          );
          
        setNotifications(filter);
        console.log("notify: ", notifications)
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
      if(accessToken){

        fetchNotifications();
      }
  }, [accessToken, userInfo.id]);

  const handleAction = async (notifId, action) => {
    const url = `http://127.0.0.1:8000/api/circles/notifications/${action}/`;
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
  
    const data = {
      sender: notifications.sender,
      receiver: userInfo.id,
      message:'hello'
    };
  
    try {
      const response = await axios.post(url, data, config);
      //alert(response.data.detail);
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif.id !== notifId)
      );
    } catch (error) {
      if (error.response) {
        console.error("API Error:", error.response.data);
        alert(error.response.data.detail || "An error occurred");
      } else {
        console.error("Error:", error.message);
      }
    }
  };
  

  return (
    <div>
      <div className="dropdown">
        <h5>People who want to add you into their circle:</h5>
        <ul>
          <li>
            <div>
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div key={notif.id}>
                    { !notif.is_handled && (
                      <div style={{display:'flex', textAlign:'center'}}>
                      <div className="m-1"><strong>{notif.sender_name}:</strong></div>
                      <div>
                        <button 
                          className=" m-1"
                          onClick={() => handleAction(notif.id, "approve")}>
                            <strong>Accept</strong>
                        </button>
                        <button
                            className="m-1"
                            onClick={() => handleAction(notif.id, "reject")}
                        >
                            <strong>Reject</strong>
                        </button>
                      </div>
                      </div>
                    )
                    }
                  </div>
                ))
              ) : (
                <p>No notifications</p>
              )}
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
export default Circle_Notifications;
