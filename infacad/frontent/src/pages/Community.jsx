
import { Outlet, Link } from 'react-router-dom'
import TopicList from '../components/Post/TopicList'
import { useSelector } from 'react-redux'
import CreateTopic from '../components/Topic/CreateTopic'

import Nav from '../components/navigation/Nav'


const Community = () => {
  const {user } = useSelector((state) =>state.auth)
  return (
    <>
      {user?
        (<>
          <Nav/>
          <div >
            <div className='left-container'>
              <div>
                <Link to='/home/communitypage'>Community</Link>
              </div>
              <div>
                <CreateTopic/>
              </div>
            </div>
              <div className="main-container">
                <Outlet/>
              </div>
              <div className="right-container">
                <h1>this is right contents</h1>
              </div>
          </div>
        </>
      ):(
        <p>Pleae Login to use the website!</p>
      )
    }
    </>
  )
}

export default Community