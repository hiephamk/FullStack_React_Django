import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Nav from "./components/navigation/Nav"
import HomePage from "./pages/HomePage"
import Dashboard from "./pages/Dashboard"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"
import ResetPasswordPageConfirm from "./pages/ResetPasswordPageConfirm";
import ActivatePage from "./pages/ActivatePage";
import NotFoundPage from "./pages/NotFoundPage";
import PrivateRoute from "./components/navigation/PrivateRoute";
import UserProfile from "./components/Account/UserProfile";
import CommunityPage from "./components/Topic/CommunityPage";
import UserPage from "./components/Home/UserPage";
import PostAndCommentList from "./components/Post/PostAndCommentList";
import CreateSubTopic from "./components/Post/CreateSubTopic";
import CreateTopic from "./components/Topic/CreateTopic";
import UpdateAccount from "./components/Account/UpdateAccount";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* <Route path="/account" element={<CreateNewAccount />} /> */}
          <Route path="/activate/:uid/:token" element={<ActivatePage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/password/reset/confirm/:uid/:token" element={<ResetPasswordPageConfirm />} />
          
          <Route path="/home" element={<PrivateRoute element={<Dashboard />} />}>
            <Route index element={<UserPage/>}/>
            <Route path="/home/channels/mychannel/:topicId" element={<CreateSubTopic />} />
            <Route path="/home/channels/mychannel/posts/:subtopicId" element={<PostAndCommentList />} />
            <Route path="/home/channels/mychannel/createchannel" element={<CreateTopic/>} />
            <Route path="/home/channels/joinedchannel/posts/:subtopicId" element={<PostAndCommentList />} />
            <Route path="/home/account" element={<UpdateAccount />}/>
            {/* <Route path=":subtopicId" element={<CreateChannelTopicPost />} /> */}
            <Route path="/home/:lookupField/:lookupValue" element={<UserProfile />} />
            <Route path="/home/communitypage" element={<CommunityPage/>}/>
            {/* <Route path="/home/channels/mychannel/:topicId" element={<CreateChannelTopicPost/>}/> */}
            {/* <Route path="/home/mychannels2" element={<MyChannels2/>}/> */}
          </Route>
          {/* <Route path="/community" element={<PrivateRoute element={<Community />} />}>
            <Route index element={<TopicList />} />
            <Route path=":subtopicId" element={<TopicContent />} />
            <Route path="/community/:lookupField/:lookupValue" element={<UserProfile />} />
          </Route> */}
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  )
}

export default App
