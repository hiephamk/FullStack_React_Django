import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import useAccessToken from "../../features/auth/token";

const Channel_Notifications = () => {
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const url = `http://127.0.0.1:8000/api/channels/notifications/`;
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      try {
        const response = await axios.get(url, config);
        const filter = response.data.filter(
            (notif) => !notif.is_handled && notif.user === userInfo.id
          );
        //console.log('channel notif:', filter)
        setNotifications(filter);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    
    fetchNotifications();
  }, [accessToken, userInfo.id]);

  const handleAction = async (membershipId, action) => {
    const url = `http://127.0.0.1:8000/api/channels/notifications/${membershipId}/${action}/`;
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    try {
      const response = await axios.post(url, {}, config);
      //alert(response.data.detail);

      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif.membership !== membershipId)
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
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div key={notif.id}>
              {
                  !notif.is_handled && (
                  <div style={{display:'flex', justifyContent:'space-evenly', alignItems:'center'}}>
                      <div className="m-1"><strong>{notif.member_name}</strong></div>
                      <div>
                        <button
                            onClick={() => handleAction(notif.membership, "approve")}
                            style={{margin:'5px', padding:'5px', border:'1px solid #1113', borderRadius:'7px', backgroundColor:'#3333'}}
                        >
                            <strong>Accept</strong>
                        </button>
                        <button
                            onClick={() => handleAction(notif.membership, "reject")}
                            style={{margin:'5px', padding:'5px', border:'1px solid #1113', borderRadius:'7px', backgroundColor:'#3333'}}
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
          <p>No request</p>
        )}
      </div>
  );
}

export default Channel_Notifications;
