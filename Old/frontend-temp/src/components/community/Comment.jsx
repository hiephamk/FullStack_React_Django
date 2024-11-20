//import PropTypes from 'prop-types';
import PropTypes from 'prop-types';
import AxiosInstance from '../context/Axios';
import { useEffect, useState } from 'react'

const Comment = ({commentId}) => {
  const [comments, setComment] = useState([])
  const GetComment = () =>{
    AxiosInstance.get(`comments/`).then((res) => {
      setComment(res.data)
      console.log(res.data, 'comment')
    })
    .catch((err) => {
      console.error("Error fetching posts:", err);
    });
  };
  useEffect(() => {
    GetComment();
  },[commentId])
  return (
    <div>
      <h3>Comments</h3>
      <div>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id}>
              <p><strong>{comment.author_username}</strong>:</p>
              <p>{comment.text}</p>
              <p>{comment.post}</p>
            </div>
          ))
        ) : (
          <p>No comments available.</p>
        )}
      </div>
    </div>
  );
};

// Comment.propTypes = {
//   comment: PropTypes.shape({
//     id: PropTypes.number.isRequired,
//     author: PropTypes.string.isRequired,
//     text: PropTypes.string.isRequired,
//   }).isRequired, // Ensures that comment is an object with the expected properties
// };
Comment.propTypes = {
  commentId: PropTypes.number.isRequired
}
export default Comment;
