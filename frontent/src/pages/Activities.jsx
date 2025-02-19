import React from 'react'
import CreateStatus from '../components/Post/CreateStatus'
import PostAndComment from '../components/Post/PostAndComment'

const Activities = () => {
    const [posts, setPosts] = React.useState([]);
    const [visibility, setVisibility] = React.useState('public');

    const handlePostCreated = (newPost) => {
        setPosts((prevPosts) => [newPost, ...prevPosts]); // Add new post to the top
    };
  return (
    <>
        <div style={{margin:'10px 20px auto', }}>
            <CreateStatus onPostCreated={handlePostCreated}/>
        </div>
        <div className='main-content'>
        <PostAndComment posts={posts} setPosts={setPosts} visibility={visibility} />
        </div>
    </>
  )
}

export default Activities