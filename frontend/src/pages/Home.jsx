import { useContext, useEffect, useRef, useState } from 'react';
import { userDataContext } from "../context/UserContext";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import userImg from "../assets/User_Voice.gif";
import aiImg from "../assets/AI_Voice.gif";
import { RiMenuFold3Fill } from "react-icons/ri";
import { IoClose } from "react-icons/io5";

function Home() {
  const { userData, serverUrl, getGeminiResponse, setUserData, setIsLoggingOut } = useContext(userDataContext);
  const navigate = useNavigate();
  const recognitionRef = useRef(null);
  const isSpeakingRef = useRef(false);
  const [ttsUnlocked, setTtsUnlocked] = useState(false);
  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [ham, setHam] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false);
  const synth = window.speechSynthesis;


  
//  const handleLogOut = async () => {
//   try {
//     // Set flag in localStorage to prevent auto-login
//     localStorage.setItem('justLoggedOut', 'true');
    
//     // Clear user data from localStorage
//     localStorage.removeItem('userData');
    
//     setUserData(null);
//     navigate("/signin"); // This will now work correctly with the fixed routes
//   } catch {
//     localStorage.setItem('justLoggedOut', 'true');
//     localStorage.removeItem('userData');
//     setUserData(null);
//     navigate("/signin"); 
//   }
// };


// START SPEECH RECOGNITION

const handleLogOut = async () => {
  try {
    // Call the server logout endpoint to clear the token cookie
    await axios.post(`${serverUrl}/api/auth/logout`, {}, {
      withCredentials: true
    });
  } catch (error) {
    console.log("Logout API error:", error);
  } finally {
    // Always clear client-side data
    localStorage.setItem('justLoggedOut', 'true');
    localStorage.removeItem('userData');
    setUserData(null);
    navigate("/signin");
  }
};


  const startRecognition = () => {
    try {
      recognitionRef.current?.start();
      setListening(true);
    } catch (error) {
      if (!error.message.includes("start")) console.error("Recognition error:", error);
    }
  };

  // TEXT TO SPEECH
  const speak = (text) => {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(v => v.lang === 'hi-IN');
    if (hindiVoice) utterance.voice = hindiVoice;
    isSpeakingRef.current = true;
    utterance.onend = () => {
      setAiText("")
      isSpeakingRef.current = false;
      startRecognition();
    };
    synth.speak(utterance);
  };

  // HANDLE COMMAND ACTIONS
  const handleCommand = (data) => {
    const { type, userInput, response } = data || {};
    if (response) speak(response);

    if (type === 'google_search') {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(userInput)}`, '_blank');
    } 
    else if (type === 'calculator_open') {
      window.open('https://www.google.com/search?q=calculator', '_blank');
    } 
    else if (type === 'facebook_open') {
      window.open('https://www.facebook.com/', '_blank');
    } 
    else if (type === 'linkedin_open') {
      window.open('https://www.linkedin.com/', '_blank');
    } 
    else if(type === 'gmail_open') {
      window.open('https://mail.google.com/', '_blank');
    }
    else if (type === "whatsapp_open") {
      window.open("https://web.whatsapp.com", "_blank");
    }
    else if (type === 'weather_show') {
      window.open('https://www.google.com/search?q=weather', '_blank');
    } 
    else if (type === 'youtube_search' || type === 'youtube_play') {
      window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`, '_blank');
    }
  };

  // SPEECH RECOGNITION HANDLER
  useEffect(() => {
    if (!userData || !ttsUnlocked) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.lang = 'en-US';

    const isRecognizingRef = { current: false };

    const safeRecognition = () => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
        } catch (error) {
          if (error.name !== "InvalidStateError") console.error("Start error:", error);
        }
      }
    };

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      if (!isSpeakingRef.current) setTimeout(() => safeRecognition(), 1000);
    };

    recognition.onerror = (event) => {
      isRecognizingRef.current = false;
      setListening(false);
      if (event.error !== "aborted" && !isSpeakingRef.current) {
        setTimeout(() => safeRecognition(), 1000);
      }
    };

    recognition.onresult = async (e) => {
  const transcript = e.results[e.results.length - 1][0].transcript.trim();

  if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
    try {
      setAiText("")
      setUserText(transcript)
      recognition.stop();
      isRecognizingRef.current = false;
      setListening(false);
      const data = await getGeminiResponse(transcript);
      
      // ✅ DEBUG: Check what data we're getting
      console.log("Full response data:", data);
      console.log("Updated user history:", data.updatedUser?.history);
      
      handleCommand(data);
      setAiText(data.response)
      setUserText("")
      
      // ✅ Update user data with new history
      if (data.updatedUser) {
        setUserData(data.updatedUser);
        localStorage.setItem("userData", JSON.stringify(data.updatedUser));
        console.log("User data updated in context");
      }
      
    } catch (err) {
      console.error("Error fetching Gemini response:", err);
    }
  }
};

    const fallback = setInterval(() => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) safeRecognition();
    }, 10000);

    safeRecognition();

    return () => {
      recognition.stop();
      setListening(false);
      isRecognizingRef.current = false;
      clearInterval(fallback);
    };
  }, [userData, ttsUnlocked]);

  return (
    <div className='w-full min-h-[100vh] bg-gradient-to-t from-black from-30% to-blue-900 flex flex-col lg:flex-row justify-center items-center relative p-4'>

      {/* Hamburger Menu Icon - Visible only on mobile */}
      <RiMenuFold3Fill 
        onClick={() => setHam(true)}
        className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px] cursor-pointer z-20' 
      />

      {/* Sidebar for Large Devices - Visible only on lg screens and above */}
      <div className='hidden lg:flex absolute right-0 top-0 w-[300px] h-full bg-black/10 backdrop-blur-lg p-6 flex-col gap-6 items-start z-10'>
        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogOut}
          className='w-full max-w-[200px] h-[50px] cursor-pointer bg-white rounded-full text-black font-semibold hover:bg-blue-800 transition-colors'
        >
          Log Out
        </button>
        
        {/* CUSTOMIZE BUTTON */}
        <button
          onClick={() => navigate("/customize")}
          className='w-full max-w-[200px] h-[50px] cursor-pointer bg-white rounded-full text-black font-semibold hover:bg-blue-800 transition-colors'
        >
          Customize Your Assistant
        </button>

      {/* HISTORY BUTTON */} 
      <button
        onClick={() => setHistoryOpen(!historyOpen)}
        className='w-full max-w-[200px] h-[50px] cursor-pointer bg-white rounded-full text-black font-semibold hover:bg-blue-800 transition-colors'
      > History ({userData.history?.length || 0}) </button>
        
      {/* HISTORY CONTENT - Only show when open */}
      {historyOpen && (
        <div className='w-full mt-4'>
          <h1 className='text-white font-semibold text-[20px] mb-4'>Your History</h1>
            <div className='w-full h-[400px] overflow-y-auto flex flex-col gap-3 border-2 border-black-500 p-2 bg-gradient-to-t from-black from-20% to-blue-950'>
            {userData.history?.slice().reverse().map((his, index) => (
              <span key={index} className='text-white text-[16px] bg-red-500 p-1 rounded-2xl'>
                {index + 1}. {his}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>

      {/* Mobile Menu Overlay - Visible only on mobile when hamburger is clicked */}
      {ham && (
        <div className='lg:hidden fixed inset-0 w-full h-full bg-black/10 backdrop-blur-lg z-30 p-6 flex flex-col gap-6 items-start'>
          {/* Close Icon */}
          <IoClose 
            onClick={() => setHam(false)}
            className='text-white absolute top-[20px] right-[20px] w-[25px] h-[25px] cursor-pointer' 
          />
          
          {/* LOGOUT BUTTON */}
          <button
            onClick={handleLogOut}
            className='w-full max-w-[200px] h-[50px] cursor-pointer bg-white rounded-full mt-8 text-black font-semibold hover:bg-blue-800 transition-colors'
          >
            Log Out
          </button>
          
          {/* CUSTOMIZE BUTTON */}
          <button
            onClick={() => {
              navigate("/customize");
              setHam(false);
            }}
            className='w-full max-w-[200px] h-[50px] cursor-pointer bg-white rounded-full text-black font-semibold hover:bg-blue-800 transition-colors'
          >
            Customize Your Assistant
          </button>

          <button
        onClick={() => setHistoryOpen(!historyOpen)}
        className='w-full max-w-[200px] h-[50px] cursor-pointer bg-white rounded-full text-black font-semibold hover:bg-blue-800 transition-colors'
      > History ({userData.history?.length || 0}) </button>
        
      {/* HISTORY CONTENT - Only show when open */}
      {historyOpen && (
        <div className='w-full mt-4'>
          <h1 className='text-white font-semibold text-[20px] mb-4'>Your History</h1>
            <div className='w-full h-[400px] overflow-y-auto flex flex-col gap-3 border-2 border-black-500 p-2 bg-gradient-to-t from-black from-20% to-blue-950'>
            {userData.history?.slice().reverse().map((his, index) => (
              <span key={index} className='text-white text-[16px] bg-red-500 p-1 rounded-2xl'>
                {index + 1}. {his}
              </span>
            ))}
          </div>
        </div>
      )}
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className='w-full max-w-[400px] lg:max-w-[500px] flex flex-col justify-center items-center gap-6 lg:mr-[300px] mt-10'>
        {/* ASSISTANT CARD */}
        <div className='w-full max-w-[300px] lg:max-w-[350px] flex flex-col justify-center items-center overflow-hidden shadow-lg gap-4'>
          <img
            className='w-full h-auto object-cover rounded-4xl'
            src={userData?.assistantImage}
            alt="Assistant"
          />
          <h1 className='text-white text-lg text-center mt-2'>
            I am {userData?.assistantName}.<br />
            <span className='text-red-400 text-sm'>*Say Assistant Name BEFORE or AFTER while giving a Command !!!</span> 
          </h1>

          {/* ENABLE VOICE BUTTON */}
          <button
            onClick={() => {
                if (!ttsUnlocked) {
                  window.speechSynthesis.speak(new SpeechSynthesisUtterance(""));
                  setTtsUnlocked(true);
                } else {
                // Add your speak functionality here
                window.speechSynthesis.speak(new SpeechSynthesisUtterance("Already Activated and waiting for command"));
                }
              }}
            className={`w-full max-w-[250px] h-[60px] lg:h-[70px] rounded-full text-white font-semibold cursor-pointer mt-3 transition-colors ${
            !ttsUnlocked ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
            >
            {!ttsUnlocked ? 'Enable Voice' : 'Now Speak'}
          </button>

          <div className='w-full max-w-[250px] mt-1 flex justify-center items-center rounded-xl overflow-hidden'>
            {!aiText && <img src={userImg} alt="User Voice" className='w-full' />}
            {aiText && <img src={aiImg} alt="AI Voice" className='w-full' />}
          </div>
          <h1 className='text-white text-[15px] font-bold text-center text-wrap min-h-[40px]'>
            {userText ? userText : aiText ? aiText : null}
          </h1>
        </div>
      </div>
    </div>
  );
}

export default Home;

