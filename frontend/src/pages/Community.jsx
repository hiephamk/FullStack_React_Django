import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosInstance from '../context/Axios';
import { AuthContext } from '../context/AuthContext';

const Commnunity = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComment ] = useState([])
  const { logout, username } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const GetPost = () => {
      AxiosInstance.get('posts/')
        .then((res) => {
          setPosts(res.data);
          console.log(res.data);  // Check if comments are included
        })
        .catch((err) => {
          console.error("Error fetching posts:", err);
        });
      AxiosInstance.get('comments/')
        .then((res) => {
          setComment(res.data);
          console.log(res.data);  // Check if comments are included
        })
        .catch((err) => {
          console.error("Error fetching posts:", err);
        });
    };
    GetPost();
  }, []);
  const handleLogout = () => {
    logout();
    navigate('/')
  }
  const submission = () => {
    console.log("Sending data:", { title, content })
    AxiosInstance.post( `posts/`,
      {
        title: title,
        content: content,
      })
    .then(() =>{
      navigate(`/`)
    })
  }
  return (
    <div className='page-container'>
      <div className="nav-content">
        <a href="/home">Home</a>
        <a href="/home/profile">{username ? <h2>Welcome, {username}!</h2> : <h2>Welcome, Guest!</h2>}</a>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div className='body-container'>
        <div className='left-nav-container'>
          <div className='left-nav-content'>
            <ul>
              <li>Topic 1</li>
              <li>Topic 2</li>
              <li>Topic 3</li>
              <li>Topic 4</li>
            </ul>
          </div>
        </div>
        <div className='right-nav-container'>
          <div className='right-nav-content'>
            <ul>
              <li>Topic 1</li>
              <li>Topic 2</li>
              <li>Topic 3</li>
              <li>Topic 4</li>
            </ul>
          </div>
        </div>
        <div className='main-container'>
          <div className='post-container'>
            <div>
              <div>
                <label>Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div>
                <label>Content</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)}></textarea>
              </div>
              
              <button onClick={submission}>Create Post</button>
            </div>
            {posts.map((post) => (
              <div key={post.id} >
                <div className='post-content'>
                  <div className='post-text'>
                    <h2>{post.title}</h2>
                    <p>By {post.author_username}</p>
                    <p>{post.content}</p>
                  </div>
                  <div className='comment-text'>
                    <h4>Comments</h4>
                    {comments
                      .filter((comment) => comment.post === post.id) // Filter comments for the current post
                      .map((comment) => (
                        <div key={comment.id}>
                          <p><strong>{comment.author_username}: {comment.text}</strong></p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Commnunity;
