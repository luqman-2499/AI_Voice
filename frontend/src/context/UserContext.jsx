// import React, { createContext, useEffect, useState } from "react";
// import axios from "axios";

// export const userDataContext = createContext();

// function UserContext({ children }) {
//   const serverUrl = "http://localhost:8000"
//   const [frontendImage, setFrontendImage] = useState(null)
//   const [backendImage, setBackendImage] = useState(null)
//   const [selectedImage, setSelectedImage] = useState(null)
//   const [userData, setUserData] = useState(null);
//   const [isLoggingOut, setIsLoggingOut] = useState(false); // Add this flag


// //  const handleCurrentUser = async () => {
// //   // Check if we just logged out
// //   if (localStorage.getItem('justLoggedOut') === 'true') {
// //     console.log("Skipping auto-login due to recent logout");
// //     // Remove the flag now so it doesn't affect future sessions
// //     localStorage.removeItem('justLoggedOut');
// //     return;
// //   }
  
// //   try {
// //     const result = await axios.get(`${serverUrl}/api/user/current`, {
// //       withCredentials: true,
// //     });
// //     setUserData(result.data);
// //     localStorage.setItem("userData", JSON.stringify(result.data));
// //     console.log("Current user loaded:", result.data);
// //   } catch (error) {
// //     console.log("No logged-in user or error fetching user:", error);
// //     setUserData(null);
// //     localStorage.removeItem("userData");
// //   }
// // };

// const handleCurrentUser = async () => {
//   // Check if we just logged out - remove flag only after successful check
//   if (localStorage.getItem('justLoggedOut') === 'true') {
//     console.log("Skipping auto-login due to recent logout");
//     // Remove the flag now so it doesn't affect future sessions
//     localStorage.removeItem('justLoggedOut');
//     return;
//   }
  
//   try {
//     const result = await axios.get(`${serverUrl}/api/user/current`, {
//       withCredentials: true,
//     });
//     setUserData(result.data);
//     localStorage.setItem("userData", JSON.stringify(result.data));
//     console.log("Current user loaded:", result.data);
//   } catch (error) {
//     console.log("No logged-in user or error fetching user:", error);
//     setUserData(null);
//     localStorage.removeItem("userData");
//   }
// };

//   const getGeminiResponse = async (command) => {
//     try {
//       const result = await axios.post(`${serverUrl}/api/user/asktoassistant`, {command}, {withCredentials:true})
//       return result.data
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   useEffect(() => {
//     handleCurrentUser();
//   }, []);

//   const value = {
//     serverUrl,
//     userData,
//     setUserData,
//     backendImage,
//     setBackendImage,
//     frontendImage,
//     setFrontendImage,
//     selectedImage,
//     setSelectedImage,
//     getGeminiResponse,
//     setIsLoggingOut // Expose this to your logout function
//   };

//   return (
//     <userDataContext.Provider value={value}>
//       {children}
//     </userDataContext.Provider>
//   );
// }

// export default UserContext;




import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const userDataContext = createContext();

function UserContext({ children }) {

  // 🔸 Local version (commented for reference)
  // const serverUrl = "http://localhost:8000"

  // ✅ Deployed backend URL (Render)
  const serverUrl = "https://ai-voice-8y2m.onrender.com";

  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Add this flag


  const handleCurrentUser = async () => {
    // Check if we just logged out - remove flag only after successful check
    if (localStorage.getItem('justLoggedOut') === 'true') {
      console.log("Skipping auto-login due to recent logout");
      // Remove the flag now so it doesn't affect future sessions
      localStorage.removeItem('justLoggedOut');
      return;
    }
    
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      setUserData(result.data);
      localStorage.setItem("userData", JSON.stringify(result.data));
      console.log("Current user loaded:", result.data);
    } catch (error) {
      console.log("No logged-in user or error fetching user:", error);
      setUserData(null);
      localStorage.removeItem("userData");
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
      console.log(error);
    }
  };

  useEffect(() => {
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
    setIsLoggingOut, // Expose this to your logout function
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;
