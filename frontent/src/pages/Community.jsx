import React from 'react'
import { Link, Outlet,  } from 'react-router-dom'
import TopicList from '../components/Post/TopicList'


const Community = () => {
  return (
    <div className='page-container'>
      <div>
        <TopicList/>
      </div>
        <div className="main-container">
          <Outlet/>
        </div>
        <div className="right-container">
          <h1>this is right contents</h1>
        </div>
    </div>
  )
}

export default Community