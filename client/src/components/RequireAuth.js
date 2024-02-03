import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';


//logout user in mongodb 
export const LogoutUser = async (userId) => {
  try {
    const response = await axios.post('http://127.0.0.1:5050/user/logout', { userId });
    // console.log("logout user" + userId)
    if (response.data.error) {
      alert(response.data.error);
    }
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

export const CheckAdminJWTExpiryAndRole = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if JWT exists
    const storedToken = localStorage.getItem('token');

    if (!storedToken || typeof storedToken !== 'string') {
      // No token found or invalid token, redirect to "/"
      navigate("/", { replace: true });
      return;
    }

    // Decode to see user role and expiry status
    const decodedToken = jwtDecode(storedToken);
    const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
    const userId = decodedToken.userId;
    const userRole = decodedToken.role; // Get the user role

    // Check if the token is expired
    if (Date.now() > expirationTime) {
      localStorage.removeItem("token");
      alert("JWT Token expired. Please login again!");
      // Token is expired, navigate to the default page
      navigate("/", { replace: true });
      LogoutUser(userId);
    } else if (userRole === 'admin') {
      // If the user is an admin, stay on the current route or perform admin-specific logic
      console.log("User is an admin");
    } else {
      navigate("/", { replace: true });
    }
  }, [navigate]);
};

export const CheckMemberJWTExpiryAndRole = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if JWT exists
    const storedToken = localStorage.getItem('token');

    if (!storedToken || typeof storedToken !== 'string') {
      // No token found or invalid token, redirect to "/"
      navigate("/", { replace: true });
      return;
    }

    // Decode to see user role and expiry status
    const decodedToken = jwtDecode(storedToken);
    const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
    const userId = decodedToken.userId;
    const userRole = decodedToken.role; // Get the user role

    // Check if the token is expired
    if (Date.now() > expirationTime) {
      localStorage.removeItem("token");
      alert("JWT Token expired. Please login again!");
      // Token is expired, navigate to the default page
      navigate("/", { replace: true });
      LogoutUser(userId);
    } else if (userRole === 'member') {
      // If the user is an admin, stay on the current route or perform admin-specific logic
      console.log("User is a member");
    } else {
      navigate("/", { replace: true });
    }
  }, [navigate]);
};



// export const CheckMemberJWTExpiryAndRole = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Check if JWT exists
//     const storedToken = localStorage.getItem('token');

//     if (!storedToken || typeof storedToken !== 'string') {
//       // No token found or invalid token, redirect to "/"
//       navigate("/", { replace: true });
//       return;
//     }

//     // Decode to see user role and expiry status
//     const decodedToken = jwtDecode(storedToken);
//     const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
//     const userId = decodedToken.userId;

//     // Check if the token is expired
//     if (Date.now() > expirationTime) {
//       localStorage.removeItem("token");
//       alert("JWT Token expired. Please login again!");
//       // Token is expired, navigate to the default page
//       navigate("/", { replace: true });
//       LogoutUser(userId);
//     }
//   }, [navigate]);
// };


