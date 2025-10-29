import { useContext, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import axios from 'axios'
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

function Customize() {

  const { userData, setUserData, serverUrl, setBackendImage, selectedImage, setSelectedImage } = useContext(userDataContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle image upload from user’s system
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("assistantImage", file);

    try {
      setLoading(true);
      const res = await axios.post(`${serverUrl}/api/user/upload`, formData, {
        withCredentials: true,
      });

      // Save uploaded image from backend (Cloudinary URL)
      setBackendImage(res.data.imageUrl);
      setLoading(false);
      navigate("/customize2");

    } catch (error) {
      console.error("Error uploading image:", error);
      setLoading(false);
    }
  };

  // Handle pre-selected default image click
  const handleDefaultSelect = (imageUrl) => {
    setSelectedImage(imageUrl);
    navigate("/customize2");
  };

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-blue-900 flex flex-col items-center justify-center p-5 relative">

      <IoMdArrowRoundBack
        onClick={() => navigate("/")}
        className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer"
      />

      <h1 className="text-white mb-10 text-[30px] text-center">
        Choose your <span className="text-blue-600">Assistant Avatar</span>
      </h1>

      <div className="flex flex-wrap justify-center gap-6 mb-8">
        {/* Example default images */}
        <img
          src="/src/assets/avatar1.jpg"
          alt="avatar1"
          onClick={() => handleDefaultSelect("/src/assets/avatar1.jpg")}
          className={`w-[120px] h-[120px] rounded-full border-4 cursor-pointer hover:scale-110 transition-all ${selectedImage === "/src/assets/avatar1.jpg" ? "border-blue-600" : "border-transparent"}`}
        />
        <img
          src="/src/assets/avatar2.jpg"
          alt="avatar2"
          onClick={() => handleDefaultSelect("/src/assets/avatar2.jpg")}
          className={`w-[120px] h-[120px] rounded-full border-4 cursor-pointer hover:scale-110 transition-all ${selectedImage === "/src/assets/avatar2.jpg" ? "border-blue-600" : "border-transparent"}`}
        />
      </div>

      <label
        htmlFor="fileUpload"
        className="cursor-pointer bg-white text-black px-5 py-3 rounded-full font-semibold hover:bg-gray-300 transition-all"
      >
        {loading ? "Uploading..." : "Upload Your Own Image"}
      </label>
      <input
        type="file"
        id="fileUpload"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
    </div>
  );
}

export default Customize;
