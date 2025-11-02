import { createContext, useEffect, useState } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;

export const userDataContext = createContext();

function UserContext({ children }) {

  const serverUrl = import.meta.env.VITE_API_URL;  // deployment and local link in .env file
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  const handleCurrentUser = async () => {
    console.log("🔹 Checking current user status...");
    console.log("🍪 Current cookies:", document.cookie);
    
    setLoading(true);

    try {
      console.log("🟢 Fetching current user...");
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });

      console.log("✅ Current user data received:", result.data);
      setUserData(result.data);
      localStorage.setItem("userData", JSON.stringify(result.data));
      
      // 🔄 Clear any logout flags on successful login
      localStorage.removeItem("justLoggedOut");
      
    } catch (error) {
      console.error("🚨 Error while fetching current user:", error?.response?.data || error.message);
      setUserData(null);
      localStorage.removeItem("userData");
    } finally {
      setLoading(false);
    }
  };

  const getGeminiResponse = async (command) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/asktoassistant`,
        { command },
        { withCredentials: true }
      );
      return result.data;
    } catch (error) {
      console.log("Gemini API Error:", error);
      throw error;
    }
  };

  useEffect(() => {
    console.log("🔄 UserContext mounted - checking authentication");
    handleCurrentUser();
  }, []);

  const value = {
    serverUrl,
    userData,
    setUserData,
    backendImage,
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
    getGeminiResponse,
    setIsLoggingOut,
    loading, // Expose loading state
    handleCurrentUser, // Expose for manual refresh if needed
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;
