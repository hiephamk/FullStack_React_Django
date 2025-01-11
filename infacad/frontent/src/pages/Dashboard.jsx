import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import Nav from '../components/navigation/Nav'
import JoinedChanel from '../components/Channel/JoinedChanel'
import ChatWidget from './ChatWidget'
import ChatListGroup from '../components/Chat/ChatListGroup'
import useCircle from '../features/Hooks/useCircle'
import ChannelList from '../components/Channel/ChannelList'
import Circles from '../components/Circles/Circles'
import Circle_Notifications from '../components/Circles/Circle_Notifications'
import AddMembersToCircle from '../components/Circles/AddMembersToCircle'
import Channel_Notifications from '../components/Channel/Channel_Notifications'


const Dashboard = () => {
  const [setChatReceiverId] = useState(null);
  const [circles, setCircles] = useState([])

  // Define the function to handle chat start
  const handleChatStart = (receiverId) => {
    setChatReceiverId(receiverId);
  };

    return (
        <>
          <Nav/>
          <div className='page-container'>
            <div className='left-container'>
              <div className='left-content' style={{display:'flex', flexDirection:'column'}}>
                <Link className='linkTo'  to='/home/communitypage'>Channels</Link>
                <Link className='linkTo' to ='/home/profile'>Profile</Link>
              </div>
                <div className='left-content'>
                    <button className="btn " type="button" data-bs-toggle="collapse" data-bs-target="#mychannel" aria-expanded="false" aria-controls="mychannel">
                      My Channels
                    </button>
                    <div className="collapse" id="mychannel">
                      <ul >
                        <Link className='linkTo' to = '/home/channels/mychannel/createchannel'>Create new channels</Link>
                        <ChannelList/>
                      </ul>
                    </div>
                </div>
                <div className='left-content'>
                  <button className="btn " type="button" data-bs-toggle="collapse" data-bs-target="#communitychannel" aria-expanded="false" aria-controls="collapseExample">
                    Community Channels
                  </button>
                  <div className="collapse" id="communitychannel">
                    <ul >
                      <JoinedChanel/>
                    </ul>
                  </div>
                </div>
            </div>
            <div className="main-container">
                <div className='main-content'>
                  <Outlet/>
                </div>
            </div>
            <div className="right-container">
              
              <div className="right-content">
                <p>Add members to your cicle:</p>
                <AddMembersToCircle/>
              </div>
              <div className='right-content'>
                <p>Your Circle:</p>
                <Circles circles={circles} setCircles={setCircles}/>
              </div>
              <div className='right-content'>
                <Circle_Notifications/>
              </div>
              <div className='right-content'>
                <h5>Your channel request:</h5>
                <Channel_Notifications/>
              </div>
              <div className='right-content'>
                <div>
                  <button className="btn " type="button" data-bs-toggle="collapse" data-bs-target="#chatHistory" aria-expanded="false" aria-controls="collapseExample">
                    Chat history
                  </button>
                  <div className="collapse" id="chatHistory">
                    <ul >
                      <ChatListGroup onChatStart={handleChatStart}/>
                    </ul>
                  </div>
                </div>
              </div>
              <div>
                <ChatWidget/>
              </div>
            </div>
          </div>
        </>
    )
}

export default Dashboard