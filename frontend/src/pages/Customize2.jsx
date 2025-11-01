import { useContext, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import axios from 'axios'
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

function Customize2() {

    const {userData, backendImage, selectedImage, serverUrl, setUserData} = useContext(userDataContext)
    
    const [assistantname, setAssistantName] = useState(userData?.assistantname || "")

    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleUpdateAssistant = async ()=> {
        setLoading(true)
        try {
            let formData = new FormData()
            formData.append("assistantName", assistantname)

            if(backendImage){
                formData.append("assistantImage", backendImage)
            } else{
                formData.append("imageUrl", selectedImage)
            }
            const result = await axios.post(`${serverUrl}/api/user/update`, formData, {withCredentials:true})

            setLoading(false)
            console.log(result.data);
            setUserData(result.data)
            navigate("/")
        } catch (error) {
            setLoading(false)
            console.log(error);
            
        }
    }

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-black to-blue-900 flex justify-center items-center flex-col p-20px relative'>

        <IoMdArrowRoundBack 
        onClick={()=>navigate("/customize")}
        className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer'/>

        <h1 className='text-white mb-10 text-[30px] text-center'>Select your <span className='text-blue-600'>Assistant Name</span> </h1>

        <input type="text" placeholder='Eg: Jarvis' className='w-full max-w-[500px] h-[60px]  outline-none border-2 border-white bg-transparent text-white placeholder-gray-400 px-[20px] py-[10x] rounded-full text-[18px]' required onChange={(e)=>setAssistantName(e.target.value)} value={assistantname} />

        {assistantname && <button onClick={()=>{
            handleUpdateAssistant()}} 
            className='min-w-[250px] h-[50px] bg-white rounded-full mt-5 text-black font-semibold cursor-pointer' disabled={loading} > { !loading?" Create Your Assistant":"Loading..." }</button> }
    </div>
  )
}

export default Customize2
