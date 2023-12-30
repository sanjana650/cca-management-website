import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router';

export const EditProfile = (userId) => {
  const [form, setForm] = useState({
    email: "",
    name: "",
    age: "",
    diploma: "",
    about: "",
    password: ""
  });
  const [profilePic, setProfilePic] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function editProfile() {
      const response = await axios.patch(`http://127.0.0.1:5050/user/edit-profile/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Send the token in the Authorization header
        },
      });
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      
    }

  })

}