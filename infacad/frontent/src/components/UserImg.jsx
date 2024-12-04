
import { ImProfile } from 'react-icons/im';
import PropTypes from 'prop-types';

const UserImg = ({ profileImg }) => {
  return (
    <div>
      {profileImg ? (
        <img style={{width:'40px', height:'40px', borderRadius:'40px'}} src={profileImg} alt="User Profile" />
      ) : (
        <ImProfile />
      )}
    </div>
  );
};
UserImg.propTypes = {
    profileImg: PropTypes.string, // Expect profileImg to be a string (URL)
  };
export default UserImg;
