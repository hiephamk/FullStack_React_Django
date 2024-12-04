import { useParams } from 'react-router-dom';
import PostAndCommentList from './PostAndCommentList';
import UserProfile from '../Account/UserProfile';

const TopicContent = () => {
  const { subtopicId} = useParams(); // Retrieve the dynamic subtopicId from the route

  return (
    <>
    {
      subtopicId ? 
      (<div>
        <PostAndCommentList subTopicId={subtopicId} />
      </div>)
      :<div>Please select a subtopic to view content.</div>
    }
    </>
  );
};

export default TopicContent;
