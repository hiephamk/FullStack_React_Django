import { Link, Outlet } from 'react-router-dom'
import Nav from '../navigation/Nav'
import TopicList from './TopicList'
import JoinedChanel from './JoinedChanel'

const MyPosts = () => {
  return (
    <>
          <Nav/>
          <div className='page-container'>
            <div className='left-container'>
              <div style={{display:'flex', flexDirection:'column'}}>
                <Link to='/home/communitypage'>Community</Link>
                <Link to='/home/mychannel'>My Chanels</Link>
              </div>
              <div>
                <TopicList/>
              </div>
              <div>
                <JoinedChanel/>
              </div>
            </div>
            <div className="main-container">
              <Outlet/>
            </div>
          </div>
        </>
  )
}

export default MyPosts