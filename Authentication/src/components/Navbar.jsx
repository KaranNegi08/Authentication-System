import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';

// const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Navbar = () => {
  const navigate = useNavigate();
  const { userData,backendUrl, isLoggedin, setUserData, setIsLoggedin } = useContext(AppContext);

  

  // Ensure axios sends cookies in all requests
  axios.defaults.withCredentials = true;

  const sendVerificationOtp = async () =>{
    try{
      const {data} = await axios.post(backendUrl + '/api/auth/send-verify-otp');
      console.log(data);
      if(data.success){
        navigate('/email-verify');
        toast.success("Verification OTP sent to your email.");
        
      } else {
        toast.error( "Failed to send verification OTP.");
      }
    } catch (error) {
      console.error("Error sending verification OTP:", error);
      toast.error(error.message);
    }
  }


  const logout = async () => {
    try {
      console.log("Logging out...");
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);

      if (data.success) {
        // Clear state instantly
        setIsLoggedin(false);
        setUserData(null);

        toast.success("Logged out successfully");
        navigate('/');
      } else {
        toast.error("Failed to logout. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>
      <img 
        src={assets.logo} 
        alt="Logo" 
        className='w-28 sm:w-32 cursor-pointer' 
        onClick={() => navigate('/')}
      />

      {isLoggedin && userData?.name ? (
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-medium relative group cursor-pointer">
          {userData.name[0].toUpperCase()}
          <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10'>
            <ul className='list-none m-0 p-2 bg-gray-100 text-sm shadow-md rounded'>
              {!userData.isAccountVerified && (
                <li onClick={sendVerificationOtp} className='py-1 px-2 hover:bg-gray-200 cursor-pointer'>Verify email</li>
              )}
              <li 
                onClick={logout} 
                className='py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10'
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => navigate('/login')} 
          className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all'
        >
          LOGIN 
          <img src={assets.arrow_icon} alt="" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
