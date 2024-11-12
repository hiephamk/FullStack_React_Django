
import { ImProfile } from 'react-icons/im';
import PropTypes from 'prop-types';

const Profile = ({ profileImg }) => {
  return (
    <div>
      {profileImg ? (
        <img className="profile-img" src={profileImg} alt="User Profile" />
      ) : (
        <ImProfile />
      )}
    </div>
  );
};
Profile.propTypes = {
    profileImg: PropTypes.string, // Expect profileImg to be a string (URL)
  };
export default Profile;
