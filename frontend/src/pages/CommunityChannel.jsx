import React from 'react'
import Nav from '../components/navigation/NavChannel'
import SearchChannel from '../components/Channel/Search_Channels'
import { Outlet, Link} from 'react-router-dom'
import ChannelList from '../components/Channel/ChannelList'
import JoinedChannel from '../components/Channel/JoinedChanel'
// import CommunityPage from '../components/Channel/CommunityPage'

const CommunityChannel = () => {
  return (
    <div className='page-bg-black d-flex flex-column'>
      <Nav/>
      <div className='py-2'>
        <SearchChannel/>
      </div>
      <div className='page-container'>
        <div className='left-container col-3 border rounded'>
          <div className='left-content text-bg-light'>
            <button className="btn " type="button" data-bs-toggle="collapse" data-bs-target="#mychannel" aria-expanded="false" aria-controls="mychannel">
              My Channels
            </button>
            <div className="collapse" id="mychannel">
              <ul style={{color:'#fff'}}>
                <Link className='linkTo' to = '/home/channels/mychannel/createchannel'>Create new channels</Link>
                <ChannelList/>
              </ul>
            </div>
          </div>
          <div className='left-content'>
            <button className="btn text-bg-light " type="button" data-bs-toggle="collapse" data-bs-target="#communitychannel" aria-expanded="false" aria-controls="collapseExample">
              Community Channels
            </button>
            <div className="collapse" id="communitychannel">
              <ul >
                <JoinedChannel/>
              </ul>
            </div>
          </div>
        </div>
        <div className='main-container border rounded'>
          <Outlet/>
        </div>

      </div>
    </div>
  )
}

export default CommunityChannel