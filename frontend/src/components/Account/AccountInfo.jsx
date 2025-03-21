import {useState, useEffect} from 'react'
import ProfileImg from '../profileImg'
import useAccessToken from '../../features/auth/token'
import { useSelector } from 'react-redux'
import axios from 'axios'


const AccountInfo = () => {
  const {user, userInfo} = useSelector((state) => state.auth)
  const accessToken = useAccessToken(user)

  const [aboutMe, setAboutMe] = useState('')

  useEffect(() => {
    const fetchAboutMe = async() => {
      if (!accessToken){
        console.error("cannot get accessToken");
        return;
      }
      const url = `http://127.0.0.1:8000/api/account/`
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
      try {
        const res = await axios.get(url,config);
        if (res.data.length > 0) {
          const userProfile = res.data.find(profile => profile.user === userInfo.id);
          if (userProfile) {
            setAboutMe(userProfile.aboutMe);
          } else {
            console.error("User profile image not found");
          }
        }
      }catch(error){
        console.error("cannot get aboutme", error.response || error.message)
      }
    }
    if(accessToken)
      fetchAboutMe()
  },[userInfo.id, accessToken])
  return (
    <div>
      <div>
        {aboutMe ?
          (
            <p>{aboutMe}</p>
          )
          :
          (
            <p>Plese update your information first to create channel or write a comment</p>
        )}
      </div>
      <h1>hello</h1>
    </div>
  )
}

export default AccountInfo