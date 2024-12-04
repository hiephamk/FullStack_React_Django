import { Link, Outlet } from 'react-router-dom'
import Nav from '../components/navigation/Nav'
import TopicList from '../components/Post/TopicList'
import JoinedChanel from '../components/Post/JoinedChanel'


const Dashboard = () => {
    return (
        <>
          <Nav/>
          <div className='page-container'>
            <div className='left-container'>
              <div style={{display:'flex', flexDirection:'column'}}>
                <Link to='/home/communitypage'>Community</Link>
                <Link to ='/home/account'>account</Link>
              </div>
              <div>
                <Link to = '/home/channels/mychannel/createchannel'>Create new channel</Link>
                <h4>My Channels</h4>
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

export default Dashboard