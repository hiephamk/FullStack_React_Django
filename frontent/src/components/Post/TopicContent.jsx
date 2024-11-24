import { useParams } from 'react-router-dom';
import PostAndCommentList from './PostAndCommentList';

const TopicContent = () => {
  const { subtopicId } = useParams(); // Retrieve the dynamic subtopicId from the route

  if (!subtopicId) return <div>Please select a subtopic to view content.</div>;

  return (
    <div>
      <PostAndCommentList subTopicId={subtopicId} />
    </div>
  );
};

export default TopicContent;
