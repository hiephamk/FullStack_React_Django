import axios from 'axios'
import {useState, useEffect}from 'react'
import { useSelector } from 'react-redux'
import useAccessToken from '../../features/auth/token'
import UserImg from '../UserImg'
import formatDate from '../../features/formatDate';
import { Link } from 'react-router-dom'
import anonymous from '../../assets/anonymous.png'

// eslint-disable-next-line react/prop-types
const FetchContent = ({contents, setContent, topic}) => {
  const [loading, setLoading] = useState(true)

  const fetchContent = async () => {
    try {
      const url = `http://127.0.0.1:8000/api/publiczone/`;
      const response = await axios.get(url);
      const filteredContent = response.data.filter((item) => item.topics === topic); // Corrected filter
      const sortedPost = filteredContent.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      setContent(sortedPost);
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchContent()
  },[topic, contents])

  if (loading) return <div>Loading content...</div>;
  
  const renderContent = (content, media) => {
    if(media) {
      const fileExtension  = media.split('.').pop().toLowerCase();
      const imageFormats = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'svg', 'webp'];
      const videoFormats = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv', 'flv', 'wmv'];
      
      if(imageFormats.includes(fileExtension)) {
        return (
          <>
            <div>{content}</div>
            <img src={media} alt="image" style={{maxWidth:'100%', height:'auto', borderRadius:'10px'}}/>
          </>
        )
      }
      if(videoFormats.includes(fileExtension)) {
        return (
          <>
            <div>{content}</div>
            <video src={media}></video>
          </>
        )
      }
    }
    return (
      <div>{content}</div>
    )
    }
  
  return (
    <div>
      {
        contents.map((item) => (
          <div key={item.id}>
            <div style={{boxSizing:'border-box', margin:'5px', borderRadius:'10px', backgroundColor:'#282727'}}>
              <div style={{display:'flex', alignItems:'center', boxSizing:'border-box', marginTop:'5px'}}>
                <div style={{marginTop:'7px'}}>
                  {item.isDisplayName ?
                  (<div style={{display:'flex'}}>
                    <div>
                      <img style={{width:'40px', height:'40px', border:'1px solid #111', borderRadius:'40px',background:'#111'}} src={anonymous} alt="img" />
                    </div>
                    <div style={{marginLeft:'7px'}}>
                      <strong>{item.display_name}</strong>
                      <p style={{ fontSize: '12px' }}>{formatDate(item.created_at)}</p>
                    </div>
                  </div>)
                  :(<div style={{display:'flex'}}>
                      <div style={{height:'40px',width:'40px', marginLeft:'10px'}}>
                        {item.owner_profile_img && (
                          <UserImg profileImg={`http://127.0.0.1:8000${item.owner_profile_img}`} />
                        )}
                      </div>
                      <div style={{marginLeft:'7px'}}>
                        <Link style={{textDecoration:'none'}} to={`/home/profile/${item.profile}`}>{item.owner_name}</Link>
                        <p style={{ fontSize: '12px' }}>{formatDate(item.created_at)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div style={{margin:'0 20px', padding:'7px'}}>{renderContent(item.content, item.media)}</div>
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default FetchContent

