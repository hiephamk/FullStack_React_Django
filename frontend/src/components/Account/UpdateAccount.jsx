import { useState } from "react";
import { useSelector } from "react-redux";
import useAccessToken from "../services/token";
import axios from "axios";
import {
  Box,
  Input,
  Textarea,
  VStack,
  Button,
} from "@chakra-ui/react";
import { FileUpload } from "@spipe/chakra-file-upload";
import { LuUpload } from "react-icons/lu";
import useProfile from "../services/ProfileHook";

const UpdateProfile = () => {
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);
  const { accounts } = useProfile(userInfo?.id);

  const [profile_img, setProfileImg] = useState(null);
  const [birth_date, setBirthDate] = useState("");
  const [bio, setBio] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [accountId, setAccountId] = useState(null);

  const url = `${import.meta.env.VITE_ACCOUNT_URL}${accountId}`;
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const handleUpdateProfile = async () => {
    if (!accessToken && user) {
      alert("Please login again to update profile");
      return;
    }

    const formData = new FormData();
    formData.append("user", userInfo.id);
    formData.append("phone_number", phone_number);
    formData.append("birth_date", birth_date);
    formData.append("bio", bio);

    if (profile_img instanceof File) {
      formData.append("profile_img", profile_img);
    }

    try {
      await axios.put(url, formData, config);

      // Reset state
      setAccountId(null);
      setPhoneNumber("");
      setBio("");
      setBirthDate("");
      setProfileImg(null);
    } catch (error) {
      alert("Update was not successful: " + error.message);
    }
  };

  return (
    <Box>
      {accounts && accounts.length > 0 &&
        accounts.map((account) => (
          <Box key={account.id}>
            <Box>{account.first_name}</Box>
            
          </Box>
        ))}
    </Box>
  );
};

export default UpdateProfile;
