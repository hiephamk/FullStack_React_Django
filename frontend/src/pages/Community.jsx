
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch} from 'react-redux'
import { logout, reset } from '../auth/authSlice'
import CreateNewPost from './CreateNewPost';
import PostList from './PostList';
import Profile from './ProfileImg';

const Commnunity = () => {
  const navigate = useNavigate()
    const dispatch = useDispatch()
    
    const { userInfo } = useSelector((state) => state.auth)

    const handleLogout = () => {
        dispatch(logout())
        dispatch(reset())
        navigate("/")
    }

  return (
    <div className='page-container'>
      <div className="nav-content">
        <a href="/home">Home</a>
        <Profile/>
        <h1>Welcome, {userInfo.first_name} {userInfo.last_name} </h1>
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
            <div className='post-content'>
              <CreateNewPost/>
            </div>
          </div>
          <div >
            <PostList/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Commnunity;
