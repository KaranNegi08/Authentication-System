 
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState({});

  // ✅ Get auth state
  const getAuthState = async () => {
  try {
    const res = await axios.get(`${backendUrl}/api/auth/is-auth`, {
      withCredentials: true
    });

    if (res.data.success) {
      setIsLoggedin(true);
      await getUserData(); // ✅ fetch user details if authenticated
    } else {
      setIsLoggedin(false);
      setUserData({});
    }
  } catch (error) {
    // 🔍 Handle errors based on type
    if (error.response) {
      const status = error.response.status;
      const msg = error.response.data?.message;
      
      // ⚠️ Handle session expiry or missing token gracefully
      if (status === 401) {
        if (msg === "Unauthorized: token not found") {
          // Silent initial unauthenticated state - expected for new sessions
          // Don't log to console or show toast
        } else {
          console.warn("Auth warning:", status, msg);
          toast.warning(msg || "Session expired. Please log in again.");
        }
      } else {
        console.error("Auth error:", status, msg);
        toast.error(msg || "Unauthorized / Token expired");
      }
    } else {
      console.error("Network error:", error.message);
      toast.error("Network error. Please try again.");
    }

    // Reset login state
    setIsLoggedin(false);
    setUserData({});
  }
};


  // ✅ Get user data
  const getUserData = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/user/data`, {
        withCredentials: true
      });

      if (res.data.success) {
        setUserData(res.data.userData);
      } else {
        toast.error(res.data.message);
        setUserData({});
      }
    } catch (error) {
      console.error("User data error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to fetch user data");
      setUserData({});
    }
  };

  useEffect(() => {
  // Call getAuthState on mount
  const fetchAuth = async () => {
    await getAuthState();
  };

  fetchAuth();
}, []);


  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
