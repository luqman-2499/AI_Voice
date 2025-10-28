import React, { useContext, useRef, useState } from 'react'
import Card from '../components/Card'
import image1 from "../assets/image1.png"
import image2 from "../assets/image2.jpg"
import image3 from "../assets/authBg.png"
import { LuImagePlus } from "react-icons/lu";
import {userDataContext} from "../context/UserContext.jsx"
import {useNavigate} from 'react-router-dom'
import { IoMdArrowRoundBack } from "react-icons/io";

function Customize() {

  const {serverUrl,
      userData,
      setUserData,
      backendImage,
      setBackendImage,
      frontendImage,
      setFrontendImage,
      selectedImage,
      setSelectedImage} = useContext(userDataContext)
  const navigate= useNavigate()
 
  const inputImage = useRef()
  
  const handleImage = (e)=>{
    const file=e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))

  }

  

  return (
    <div className='w-full min-h-screen bg-gradient-to-t from-black to-blue-900 flex flex-col items-center overflow-auto pt-10 pb-20'>

      <IoMdArrowRoundBack 
        onClick={()=>navigate("/")}
        className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer'/>

      <h1 className='text-white mb-10 text-[30px] text-center'>Select your <span className='text-blue-600'>Assistant Image</span> </h1>
      <div className='w-full max-w-[900px] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 justify-items-center'>

      <Card image={image1} />
      <Card image={image2} />
      <Card image={image3} />

       <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-blue-950 border-2 border-blue-600 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-800 hover:border-4 hover:border-white cursor-pointer flex items-center justify-center ${selectedImage=="input"? "border-4 border-white shadow-2xl shadow-blue-800": null}`} onClick={()=>{
        inputImage.current.click()
        setSelectedImage("input")
        
        }}> 
         {!frontendImage && <LuImagePlus className='text-white w-[40px] h-[40px] '/> }
        {frontendImage && <img src={frontendImage} className='w-full h-full object-cover' /> }
    </div>
    <input type="file" accept='image/*' ref={inputImage} hidden onChange={handleImage} />
      </div>
      {selectedImage && (
  <button
    onClick={() => navigate("/customize2")}
    className='min-w-[100px] h-[50px] bg-white rounded-2xl mt-20 text-black font-semibold cursor-pointer'
  >
    Next
  </button>
)}

    </div>
  )
}

export default Customize