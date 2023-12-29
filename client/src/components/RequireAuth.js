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


//if jwt token isnt valid or does not exist it redirects to landing page & logs user out 
export const UseRequireAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    //check if jwt exists
    const storedToken = localStorage.getItem('token');

    if (!storedToken) {
      navigate('/');
    } else {
      //decode to see user role & expiry status
      const decodedToken = jwtDecode(storedToken);
      const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
      const userId = decodedToken.userId

      // Check if the token is expired
      if (Date.now() > expirationTime) {
        localStorage.removeItem("token");

        alert("JWT Token expired. Please login again!")
        // Token is expired, navigate to the default page
        navigate("/", { replace: true });

        LogoutUser(userId);
      }
    }
  }, [navigate]);
};

