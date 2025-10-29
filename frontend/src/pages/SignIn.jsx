import { useContext, useState } from 'react'
import bg_img from "../assets/authBg.png"
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/UserContext';
import axios from "axios"

function SignIn() {

  // If Eye Open Show Password Else Hide Password
  const [showPassword, setShowPassword] = useState(false)

  const {serverUrl,userData, setUserData} = useContext(userDataContext)
  
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [err, setErr] = useState("")
  const [loading, setLoading] = useState(false);
 

  const handleSignIn = async (e) => {
  e.preventDefault();
  setErr("");
  setLoading(true);
  try {
    const result = await axios.post(
      `${serverUrl}/api/auth/signin`,
      { email, password },
      { withCredentials: true }
    );

    // Update context AND localStorage
    setUserData(result.data);
    localStorage.setItem("userData", JSON.stringify(result.data));
    setLoading(false);
    navigate("/"); // Redirect to Home or Customize based on routes
  } catch (error) {
    console.log(error);
    setUserData(null);
    localStorage.removeItem("userData"); // Clear if login failed
    setLoading(false);
    setErr(error?.response?.data?.message || "Invalid credentials. Please try again.");

  }
};



  return (
    <div className='w-full h-[100vh] bg-cover flex justify-center items-center' style={{backgroundImage: `url(${bg_img})`}} >

      <form className='w-[90%] flex flex-col items-center justify-center gap-[20px] h-[600px] max-w-[500px] rounded-2xl bg-black/60 backdrop-blur shadow-lg shadow-black px-[20px]' onSubmit={handleSignIn}>

        <h1 className='text-white text-[30px] font-semibold mb-[30px]'> Sign In to 
          <span className='text-blue-500'> Virtual Assistant</span>
        </h1>

        <input type="email" placeholder='email' className='w-full h-[60px]  outline-none border-2 border-white bg-transparent text-white placeholder-gray-400 px-[20px] py-[10x] rounded-full text-[18px]' required onChange={(e) => setEmail(e.target.value)} value={email}/>

        <div className='w-full h-[60px] border-2 border-white text-white rounded-full text-[18px] relative'>
          <input type={showPassword ? "text" : "password"} placeholder='password' className='w-full h-full rounded-full outline-none bg-transparent placeholder-gray-400 px-[20px] py-[10px]' required onChange={(e) => setPassword(e.target.value)} value={password}/>

           {!showPassword && <IoIosEyeOff onClick={()=> setShowPassword(true)} className='cursor-pointer absolute top-[20px] right-[18px] text-[white] w-[25px] h-[25px]' />}

          {showPassword && <IoIosEye onClick={()=> setShowPassword(false)} className='cursor-pointer absolute top-[20px] right-[18px] text-[white] w-[25px] h-[25px]'/>}
        </div>

        <button className='min-w-[150px] h-[50px] bg-white rounded-full mt-5 text-black font-semibold cursor-pointer' disabled={loading}>{loading? "Loading...":"Sign In"}</button>

        {err.length>0 && <p className='text-red-600'>
        *{err}  
        </p>}
        <p onClick={()=>navigate("/signup")} className='text-white text-[18px] cursor-pointer'>Want to create a new account?<span className='text-blue-500 font-bold'> Sign Up</span></p>
      </form>

    </div>
  )
}

export default SignIn


