
import React from 'react'

const CountLike = () => {

  const handleLike = async (postId) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          const newLikeCount = post.isLiked ? post.like_count - 1 : post.like_count + 1;
          return { ...post, isLiked: !post.isLiked, like_count: newLikeCount };
        }
        return post;
      })
    );

    try {
      await axios.post(`http://127.0.0.1:8000/api/posts/${postId}/like`, {
        isLiked: !isLiked,
      });
    } catch (error) {
      console.error("Failed to update like count:", error);
    }
  };
  return (
    <div>
      <button 
        onClick={() => handleLike(post.id)}>
          {post.isLiked ? <span style={{color: 'blue', fontSize: '18px'}}>👍</span> : <SlLike />} {post.likeCount} {post.likeCount === 1 ? 'Like' : 'Likes'}
      </button>
    </div>
  )
}

export default CountLike