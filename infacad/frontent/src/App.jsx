import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
//import { ToastContainer } from 'react-toastify';
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
import CommunityPage from "./components/Channel/CommunityPage";
import UserPage from "./components/Home/UserPage";
import ChannelPostAndCommentList from "./components/channel/ChannelPostAndCommentList";
import CreateChannel from "./components/Channel/CreateChannel";
import UpdateAccount from "./components/Account/UpdateAccount";
import ChatBox from "./components/Chat/ChatBox";
import Home from "./pages/Home";
import CreateOrUpdateAccount from "./components/Account/UpdateAccount";
import Activities from "./pages/Activities";
import CreateChannelTopic from "./components/Channel/CreateChannelTopic";


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/activate/:uid/:token" element={<ActivatePage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/password/reset/confirm/:uid/:token" element={<ResetPasswordPageConfirm />} />
          <Route path="/home" element={<PrivateRoute element={<Dashboard />} />}>
            <Route index element={<Home/>}/>
            <Route path="/home/account" element={<UpdateAccount />}/>
            <Route path="/home/profile" element={<UserPage />}/>
            <Route path="/home/:lookupField/:lookupValue" element={<UserProfile />} />
            <Route path="/home/create-profile" element={<CreateOrUpdateAccount/>}/>
            <Route path="/home/activities" element={<Activities/>}/>
            <Route path="/home/chat" element={<ChatBox/>}/>
            <Route path="/home/channels/mychannel/:channelId" element={<CreateChannelTopic />} />
            <Route path="/home/channels/mychannel/createchannel" element={<CreateChannel/>} />
            <Route path="/home/channels/mychannel/topics/:topicId" element={<ChannelPostAndCommentList />} />
            <Route path="/home/channels/joinedchannel/topics/:topicId" element={<ChannelPostAndCommentList />} />
            <Route path="/home/communitypage" element={<CommunityPage/>}/>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
      {/* <ToastContainer /> */}
    </>
  )
}

export default App
