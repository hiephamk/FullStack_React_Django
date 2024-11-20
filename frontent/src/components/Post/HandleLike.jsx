import { useEffect } from "react";
import axios from "axios";

const LikeHandler = ({ postId, user }) => {
  useEffect(() => {
    const handleLike = async () => {
      let currentAccessToken = user.access;

      const refreshAccessToken = async () => {
        const refreshUrl = `http://127.0.0.1:8000/api/token/refresh/`;
        try {
          const res = await axios.post(refreshUrl, { refresh: user.refresh });
          return res.data.access;
        } catch (error) {
          console.error("Error refreshing token:", error.response || error.message);
          return null;
        }
      };

      // Refresh the token if necessary
      if (!currentAccessToken) {
        currentAccessToken = await refreshAccessToken();
      }

      if (!currentAccessToken) {
        console.error("Unable to proceed: No valid access token.");
        return;
      }

      // Send the like request
      try {
        const response = await axios.post(
          `http://127.0.0.1:8000/api/posts/${postId}/like/`,
          { like_count: 1 },
          {
            headers: {
              Authorization: `Bearer ${currentAccessToken}`,
            },
          }
        );
        console.log("Post liked successfully:", response.data);
      } catch (error) {
        console.error("Error liking the post:", error.response || error.message);
      }
    };

    // Run the like function
    if (postId && user) {
      handleLike();
    }
  }, [postId, user]); // Dependency array includes postId and user
};

export default LikeHandler;
