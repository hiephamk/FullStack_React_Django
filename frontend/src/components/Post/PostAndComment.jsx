
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useSelector } from 'react-redux';
import useAccessToken from '../../features/auth/token';
import axios from 'axios';
import CreateComment from './CreateComment';
import UserImg from '../UserImg';
import { MdOutlineComment } from "react-icons/md";
import { FaShareFromSquare } from "react-icons/fa6";
import { GrLike } from "react-icons/gr";
//import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import HandleLike from '../../features/HandleLike'
import formatDate from '../../features/formatDate';
import { FaUpload } from "react-icons/fa";


// eslint-disable-next-line react/prop-types
const PostAndComment = ({posts, setPosts, visibility}) => {
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);
  const { handleLike, like } = HandleLike({setPosts: setPosts})
  const fileInputRef = useRef();

  const [updateContent, setUpdateContent] = useState('')
  const [updateContentShared, setUpdateContentShared] = useState('')
  const [updatePostId, setUpdatePostId] = useState(null)
  const [updateFile, setUpdateFile] = useState(null);

  const [deletePostId, setDeletePostId] = useState(null)

  const [updatePostShow, setUpdatePostShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false)
  
  // const [createShareUpdate, setCreateShareUpdate] = useState('')
  const [createSharedContent, setCreateSharedContent] = useState('')
  const [sharePostId, setSharePostId] = useState(null)
  // const [shareUpdateId, setShareUpdateId] = useState(null)
  const [shareShow, setShareShow] = useState(false);


  const [comments, setComments] = useState([]);
  const [updateComment, setUpdateComment] = useState('')
  const [editingCommentId, setEditingCommentId] = useState(null)
  
  const [expandedPost, setExpandedPost] = useState(null);
  
  //const [visibility, setVisibility] = useState('public');
  

  const baseUrl = "http://127.0.0.1:8000";

  const fetchPosts = async () => {
    const postUrl = `${baseUrl}/api/posts/?visibility=${visibility}`;  // Add visibility to URL
    const commentUrl = `${baseUrl}/api/comments/`;
    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    try {
      const postRes = await axios.get(postUrl, config);
      const sortedPost = postRes.data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        setPosts(sortedPost);

      const commentRes = await axios.get(commentUrl, config);
      const sortedComment = commentRes.data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      setComments(sortedComment);
    } catch (error) {
      console.error('Error fetching posts or comments:', error);
    }
  };

    useEffect(() => {
      if (accessToken && userInfo) {
        fetchPosts()
      }
    }, [accessToken, visibility, userInfo]);


const handleClickUpdate = (post) => {
  setUpdatePostShow(true)
  setUpdatePostId(post.id)
  setUpdateContent(post.content)
  setUpdateContentShared(post.content_shared)
  setUpdateFile(post.file)
};
const handleUpdateCancel = () => {
  setUpdatePostShow(false);
  setUpdatePostId(null);
  setUpdateContent("");
  setUpdateContentShared("");
  setUpdateFile(null);
}
const handleUpdate = () => {
  if (!updatePostId) {
    console.error("Post ID is missing. Cannot update.");
    return;
  }
  const url = `http://127.0.0.1:8000/api/posts/${updatePostId}/`;
  const config = {
      headers: { 
          Authorization: `Bearer ${accessToken}`,
          // "Content-Type": "multipart/form-data",
      },
  };
  const formData = new FormData();
  formData.append("content", updateContent || "");
  formData.append("content_shared", updateContentShared || "");

  if (updateFile instanceof File) {
    formData.append("file", updateFile);
  } else if (updateFile) {
    formData.append('file_url', updateFile)
  }
    axios.put(url,formData,config)
    .then(response => {
      setPosts(posts.map(post => post.id === updatePostId ? response.data : post))
      setUpdatePostId(null)
      setUpdatePostShow(false)
      setUpdateContent("");
      setUpdateContentShared("");
      setUpdateFile(null)
    })
  .catch (error => {
    console.error("Error updating post:", error)
  })
}
const handleClickDelete = (post) => {
  setDeleteShow(true)
  setDeletePostId(post.id)
}
const handleDeleteCancel = () => {
  setDeleteShow(false)
}
const handleDelete = () => {
  const url = `http://127.0.0.1:8000/api/posts/${deletePostId}/`;
  const config = {
      headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
      },
  };
  axios.delete(url, config)
  .then(() => {
    setPosts(posts.filter(post => post.id !== deletePostId))
    setDeleteShow(false)
  })
  .catch(error => {
    console.error("Error deleting post:", error)
    // setShowModal(false)
  })
}

const handleClickShare = (post) => {
  setShareShow(true);
  setSharePostId(post);
  setCreateSharedContent(post.content_shared || "");
};
const handleShareCancel = () => {
  setShareShow(false)
}
const handleShare = async (postId) => {
    const url = `http://127.0.0.1:8000/api/posts/${postId}/share/`;

    const config = {
        headers: { 
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    };
    try {
      await axios.post(url, {content_shared:createSharedContent}, config);
      setShareShow(false)
      setCreateSharedContent('');
      fetchPosts()
        //toast.success('Post shared successfully!');
    } catch (error) {
        console.error('Error sharing the post:', error);
        setShareShow(false)
        //toast.error('Failed to share the post.');
    }finally {
      setSharePostId(null);
    }
};
  const handleCopyUrl = (postId) => {
    const postUrl = `${window.location.origin}/home/posts/${postId}/copy/`;
    navigator.clipboard
      .writeText(postUrl)
      //.then(() => toast.success('Post URL copied to clipboard!'))
      .catch((error) => {
        console.error('Error copying the link:', error);
        //toast.error('Failed to copy the post URL.');
      });
    setSharePostId(null); // Close the sharing options
  };

  const handleExpandPost = (postId) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  const renderPostContent = (file, file_shared) => {
    if (file || file_shared){
      const fileExtension = file.split('.').pop().toLowerCase();

      // Supported image formats
      const imageFormats = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'svg', 'webp'];
      // Supported video formats
      const videoFormats = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv', 'flv', 'wmv'];

      if (imageFormats.includes(fileExtension)) {
        return (
          <>
            {/* <p>{content_shared}</p> */}
            {file_shared && (
              <img
              src={`${file_shared}`}
              alt="Post content shared"
              style={{ maxWidth: '100%', height: 'auto', border:'1px solid #111', borderRadius:'7px' }}
              />
            )}
            {/* <p>{content}</p> */}
            <img
              src={`${file}`}
              alt="Post content"
              style={{ maxWidth: '100%', height: 'auto', border:'1px solid #111', borderRadius:'7px' }}
            />
          </>
        );
      }
      if (videoFormats.includes(fileExtension)) {
        return (
          <>
            {/* <p>{content}</p> */}
            {/* <p>{content_shared}</p> */}
            <video controls style={{ maxWidth: '100%', height: 'auto' }}>
              <source src={`${file}`} type={`video/${fileExtension}`} />
              Your browser does not support this video format.
            </video>
          </>
        );
      }
    }
    return (
      <>
      </>
    );
  };

  const renderComment = (text, file) => {
    if (file) {
      const fileExtension = file.split('.').pop().toLowerCase();

      // Supported image formats
      const imageFormats = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'svg', 'webp'];
      // Supported video formats
      const videoFormats = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv', 'flv', 'wmv'];

      if (imageFormats.includes(fileExtension)) {
        return (
          <>
            <p>{text}</p>
            <img
              src={`${file}`}
              alt="Comment text"
              style={{ maxWidth: '100%', height: 'auto', border:'1px solid #111', borderRadius:'7px' }}
            />
          </>
        );
      }
      if (videoFormats.includes(fileExtension)) {
        return (
          <>
            <p>{text}</p>
            <video controls style={{ maxWidth: '100%', height: 'auto' }}>
              <source src={`${file}`} type={`video/${fileExtension}`} />
              Your browser does not support this video format.
            </video>
          </>
        );
      }
    }
    return (
      <div>{text}</div>
    );
  };
  const handleFileUpload = () => {
    fileInputRef.current.click();
  };

  return (

    <div>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="rounded-3 my-3 p-2" style={{ backgroundColor:'#282727' }}>
            <div>
              {
                post.shared ? (
                  <div className='post-container px-3'>
                      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                        <div style={{display:'flex', alignItems:'center'}}>
                          <div style={{height:'40px',width:'40px', marginLeft:'10px'}}>
                            {post.author_profile_img && (
                              <UserImg profileImg={`http://127.0.0.1:8000${post.shared_owner_profile_img}`} />
                            )}
                          </div>
                          <span className="d-flex flex-column p-2">
                            <Link style={{textDecoration:'none'}} to={`/home/profile/${post.profile}`}>{post.shared_owner_name} <strong style={{paddingLeft:'5px', fontStyle:'italic'}}>shared the post: </strong></Link>
                            <span style={{ fontSize: '12px' }}>{formatDate(post.updated_at)}</span>
                          </span>
                        </div>
                        <div className="dropdown">
                          <button className="btn" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                            <p style={{color:'#fff'}}>...</p>
                          </button>
                          {post.shared_owner === userInfo.id ?(
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                              <li>
                                <Button onClick={() => handleClickUpdate(post)}>Update</Button>
                              </li>
                              <li>
                                <Button onClick={() => handleClickDelete(post)}>Delete</Button>
                              </li>
                            </ul>
                          ):(
                              <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <li>
                                  <Button  onClick={() => handleClickUpdate(post)} type="button" className="btn disabled">Update</Button>
                                </li>
                                <li>
                                  {/* <button onClick={() => handleDelete(post.id)}>Delete</button> */}
                                  <Button onClick={() => handleClickDelete(post.id)} type="button" className="btn disabled">Delete</Button>
                                </li>
                              </ul>
                            )
                          }
                        </div>
                      </div>
                      {deletePostId === post.id && (
                      <Modal
                        show = {deleteShow}
                        onHide={handleDeleteCancel}
                        backdrop="static"
                        keyboard="false"
                        style={{color:'#111'}}
                      >
                          <Modal.Header>
                          <Modal.Title>Confirm Delete</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <p>Are you sure you want to delete the post?</p>
                          </Modal.Body>
                          <Modal.Footer>
                            <button  onClick={handleDeleteCancel}>Cancel</button>
                            <button onClick={handleDelete}>Delete</button>
                          </Modal.Footer>
                      </Modal>
                      )}
                      {updatePostId === post.id && (
                        <Modal
                        show={updatePostShow}
                        onHide={handleUpdateCancel}
                        backdrop="static"
                        keyboard={false}
                        style={{color:'#111'}}
                      >
                        <Modal.Header closeButton>
                          <Modal.Title style={{color:'#111'}}>Update Post</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <textarea
                            type='text'
                            value={updateContentShared}
                            onChange={(e) => setUpdateContentShared(e.target.value)}
                            rows="4"
                            style={{ width: '100%' }}
                          />
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={handleUpdateCancel}>Cancel</Button>
                          <Button variant="primary" onClick={handleUpdate}>Update</Button>
                        </Modal.Footer>
                      </Modal>
                      )}
                      <div>
                        {post.content_shared}
                        {renderPostContent(post.file_shared)}
                      </div>
                      <div style={{ padding: '0 20px 0 20px', border:'1px solid #fff', borderRadius:'7px', margin:'10px 20px' }}>
                        <div style={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}>
                          <div style={{borderRadius:'100px',height:'40px',width:'40px'}}>
                            {post.author_profile_img && (
                              <UserImg profileImg={`http://127.0.0.1:8000${post.author_profile_img}`} />
                            )}
                          </div>
                          <div className="d-flex flex-column p-2">
                            <span>
                              <Link to={`/home/profile/${post.profile}`}>{post.author_name}</Link>
                            </span>
                            <span style={{ fontSize: '12px' }}>{formatDate(post.created_at)}</span>
                          </div>
                        </div>
                        
                        <div>
                          {renderPostContent(post.file)}
                          <p>{post.content}</p>
                        </div>
                        
                      </div>
                      <p style={{ borderBottom: '1px solid #1113', padding:'10px' }}>
                        <strong>{post.like_count} Like</strong>
                      </p>
                  </div>
                )
                :
                (
                  <div className="rounded-2" style={{ padding: '0 20px 0 20px' }}>
                    <div style={{ fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent:'space-between' }}>
                      <div style={{display:'flex', alignItems: 'center'}}>
                        <div style={{borderRadius:'100px',height:'40px',width:'40px'}}>
                          {post.author_profile_img && (
                            <UserImg profileImg={`http://127.0.0.1:8000${post.author_profile_img}`} />
                          )}
                        </div>
                        <div className="d-flex flex-column p-2">
                          <span>
                            <Link style={{textDecoration:'none'}} to={`/home/profile/${post.profile}`}>{post.author_name}</Link>
                          </span>
                          <span style={{ fontSize: '12px' }}>{formatDate(post.updated_at)}</span>
                        </div>
                      </div>
                      <div className="dropdown">
                      <button className="btn" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                        <p style={{color:'#fff'}}>...</p>
                      </button>
                      {post.author === userInfo.id ? (
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <button className='px-3' onClick={() => handleClickUpdate(post)}>Update</button>
                          <li>
                          </li>
                          <li>
                            <button className='px-3' onClick={() => handleClickDelete(post)}>Delete</button>
                          </li>
                        </ul>
                      ):(
                          <ul className="dropdown-menu " aria-labelledby="dropdownMenuButton">
                            <li>
                              <button onClick={() => handleClickUpdate(post)} type="button" className="disabled" data-bs-toggle="modal" data-bs-target="#updatemodalpost">
                                Update
                              </button>
                            </li>
                            <li>
                              <button onClick={() => handleClickDelete(post)} type="button" className="disabled" data-bs-toggle="modal" data-bs-target="#deleteModal">
                                Delete
                              </button>
                            </li>
                          </ul>
                      )}
                    </div>
                    </div>
                    {deletePostId === post.id && (
                      <Modal
                        show = {deleteShow}
                        onHide={handleDeleteCancel}
                        backdrop="static"
                        keyboard="false"
                        style={{color:'#111'}}
                      >
                          <Modal.Header>
                          <Modal.Title>Confirm Delete</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <p>Are you sure you want to delete the post?</p>
                          </Modal.Body>
                          <Modal.Footer>
                            <button  onClick={handleDeleteCancel}>Cancel</button>
                            <button onClick={handleDelete}>Delete</button>
                          </Modal.Footer>
                      </Modal>
                      )}
                      {updatePostId === post.id && (
                        <Modal
                        show={updatePostShow}
                        onHide={handleUpdateCancel}
                        backdrop="static"
                        keyboard={false}
                        style={{color:'#111'}}
                      >
                        <Modal.Header closeButton>
                          <Modal.Title>Update Post</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <div className='form-floating'>
                            <textarea
                              type='text'
                              value={updateContent}
                              onChange={(e) => setUpdateContent(e.target.value)}
                              className='form-control mb-2 fs-5'
                              style={{ width: '100%', height:'100px' }}
                            />
                            {/* <label htmlFor="floatingTextarea2">Write something</label> */}
                          </div>
                          {renderPostContent(post.file)}
                        </Modal.Body>
                        <Modal.Footer>
                          <button onClick={handleFileUpload} className="me-3">
                            <FaUpload
                              className="border rounded-5 border-black"
                              title="Upload file"
                              style={{width:'30px', height:'30px'}}
                            />
                                
                            <input
                                type="file"
                                id="file"
                                ref={fileInputRef}
                                onChange={(e) => setUpdateFile(e.target.files[0])}
                                accept="image/*,video/*"
                                style={{
                                    display:'none'
                                }}
                            />
                          </button>
                          <Button variant="secondary" onClick={handleUpdateCancel}>Cancel</Button>
                          <Button variant="primary" onClick={handleUpdate}>Update</Button>
                        </Modal.Footer>
                        <div className="px-4">
                          {updateFile && (
                            <div>
                              {updateFile.name}
                            </div>
                          )}
                        </div>
                      </Modal>
                      )}
                    <div>
                      {post.content}
                      <div className='m-3'>{renderPostContent(post.file)}</div>
                    </div>
                    <p style={{ borderBottom: '1px solid #1113' }}>
                      <strong>{post.like_count} Like</strong>
                    </p>
                  </div>
                )}
            </div>
            <div
              style={{
                display: 'flex',
                borderBottom: '1px solid #1113',
                justifyContent: 'space-between',
                alignItems: 'center',
                margin: '0 20px 20px',
                padding: '0 20px auto',
              }}
            >
              <button onClick={() => handleLike(post.id)}>
                {like[post.id] ? <strong>👍 Liked </strong>: <p><GrLike /> <strong>Like</strong></p>}
              </button>
              <div>
                <MdOutlineComment />
                <button onClick={() => handleExpandPost(post.id)}>
                  <strong>{expandedPost === post.id ? 'Collapse' : 'Comment'}</strong>
                </button>
              </div>

              <div className="dropup-center dropup">
                <FaShareFromSquare /> 
                <button onClick ={() => setSharePostId(post.id)} className="dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Share</button>
                <ul className="dropdown-menu">
                  <li><button className='btn' onClick={()=>handleClickShare(post.id)}>Circle</button></li>
                  <li><button className='btn' onClick={() => handleCopyUrl(post.id)}>Copy links</button></li>
                </ul>
              </div>

              {sharePostId === post.id && (
              <Modal
                show={shareShow}
                onHide={handleShareCancel}
                backdrop="static"
                keyboard={false}
                style={{color:'#111'}}
              >
                <Modal.Header>
                  <Modal.Title>Share the post with you circle</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <textarea
                    type='text'
                    value={createSharedContent}
                    onChange={(e)=>setCreateSharedContent(e.target.value)}
                    placeholder='Write something'
                    style={{width:'100%'}}
                  />
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleShareCancel}>Cancel</Button>
                  <Button onClick={() => handleShare(post.id)}>Share</Button>
                </Modal.Footer>
              </Modal>
                )}

            </div>
            {expandedPost === post.id && (
              <div>
                {comments
                  .filter((comment) => comment.post === post.id)
                  .map((comment) => (
                    <div key={comment.id} style={{ display: 'flex', padding: '20px' }}>
                            <div
                              className="d-flex flex-column rounded "
                              style={{ margin: '10px', padding: '10px', backgroundColor: '#f8f8f8', border:'1px solid #1113' }}
                            >
                              <div style={{display:'flex'}}>
                                <div style={{borderRadius:'100px',height:'40px',width:'40px',margin:'0 10px 10px 0'}}>
                                  {comment.author_profile_img && (
                                    <UserImg profileImg={`http://127.0.0.1:8000${comment.author_profile_img}`} />
                                  )}
                                </div>
                                <div>
                                  <strong>
                                    <Link to={`/home/profile/${comment.profile}`}>{comment.author_name}</Link>
                                  </strong>
                                  <p style={{ fontSize: '12px' }}>{formatDate(comment.created_at)}</p>
                                </div>
                              </div>
                            {renderComment(comment.text, comment.file)}
                            </div>
                    </div>
                  ))}
                <div style={{margin:'20px'}}>
                  <CreateComment postId={post.id} comments={comments} setComments={setComments} />
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        null
      )}
    </div>
  );
};
PostAndComment.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      author_profile_img: PropTypes.string,
      profile: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      author_name: PropTypes.string.isRequired,
      content: PropTypes.string,
      file: PropTypes.string,
      like_count: PropTypes.number,
      created_at: PropTypes.string.isRequired,
      visibility:PropTypes.string
    })
  ).isRequired,
  setPosts: PropTypes.func.isRequired,
};
export default PostAndComment;