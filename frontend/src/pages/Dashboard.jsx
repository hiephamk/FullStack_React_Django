import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import Nav from '../components/navigation/Nav'
import ChatWidget from './ChatWidget'
import ChatListGroup from '../components/Chat/ChatListGroup'
import Circle_Notifications from '../components/Circles/Circle_Notifications'
import AddMembersToCircle from '../components/Circles/AddMembersToCircle'
import Channel_Notifications from '../components/Channel/Channel_Notifications'
import useCircle from '../features/Hooks/useCircle'
import Feedback from 'react-bootstrap/esm/Feedback'


const Dashboard = () => {
  const [setChatReceiverId] = useState(null);
  const {Circle} = useCircle()
  // const [circles, setCircles] = useState([])

  // Define the function to handle chat start
  const handleChatStart = (receiverId) => {
    setChatReceiverId(receiverId);
  };

  return (
      <>
        <Nav/>
        <div className='page-container page-bg-black'>
          <div className='left-container'>
            <div className="left-content">
              <AddMembersToCircle/>
            </div>
            <ul>
              <div className='left-content'>
                <ul className="bg-light text-black border rounded fs-5 fw-bold p-1 text-center " type="button" data-bs-toggle="collapse" data-bs-target="#collapseCircle" aria-expanded="false" aria-controls="collapseCircle">
                  Circle members
                </ul>
                <ul className="collapse" id="collapseCircle">
                  {
                    Circle.map((circle)=>(
                      <li key={circle.id}>
                        {circle.member_name}
                      </li>
                    ))
                  }
                </ul>
              </div>
              <div className='left-content'>
                <ul className='bg-light text-center rounded-2 mt-3'>
                  <Link className='text-black text-decoration-none fw-bold fs-5 text-center' to ='/home/profile'>Profile</Link>
                </ul>
              </div>
            </ul>
          </div>
          <div className="main-container">
              <div className='main-content'>
                <Outlet/>
              </div>
          </div>
          <div className="right-container">
            <div className='right-content mt-3'>
              <h6>Notifications</h6>
              <Circle_Notifications/>
              <Channel_Notifications/>
            </div>
            <div className='right-content'>
              <div>
                <button className="border border-white rounded p-2 shadow mb-5" type="button" data-bs-toggle="collapse" data-bs-target="#chatHistory" aria-expanded="false" aria-controls="collapseExample">
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