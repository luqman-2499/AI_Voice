import User from "../models/user.model.js"
import uploadOnCloudinary from "../config/cloudinary.js";
import geminiResponse from "../gemini.js";
import moment from "moment"



export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(400).json({ message: "User not Found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ message: "Get current user Error", error: error.message });
  }
};

export const updateAssistant = async(req,res) => {
  try {
    const {assistantName, imageUrl}=req.body
    let assistantImage;

  if(req.file){
    assistantImage=await uploadOnCloudinary(req.file.path)
  } else{
    assistantImage = imageUrl
  }

  const user = await User.findByIdAndUpdate(req.userId,{
    assistantName,assistantImage
  },{new:true}).select("-password")
  return res.status(200).json(user)

  } catch (error) {
    return res.status(400).json({message: "updateAssistantError User Error"})
  }
}


export const askToAssistant = async (req,res) => {
  try {
    const {command} = req.body
    const user = await User.findById(req.userId);
    user.history.push(command)
    const updatedUser = await user.save() // Get the updated user
    
    const userName = user.name
    const assistantName = user.assistantName
    const result = await geminiResponse(command, assistantName, userName)

    const jsonMatch = result.match(/{[\s\S]*}/)
    if(!jsonMatch){
      return res.status(400).json({
        response: "sorry, I cant understand",
        updatedUser // Return updated user even on error
      }) 
    }
    const gemResult = JSON.parse(jsonMatch[0])
    console.log(gemResult);
    
    const type = gemResult.type

    switch(type) {
      case 'get_date' :
        return res.json({
          type,
          userInput : gemResult.userInput,
          response: `current date is ${moment().format("YYYY-MM-DD")}`,
          updatedUser 
        });

      case 'get_time':
        return res.json({
          type,
          userInput : gemResult.userInput,
          response: `current time is ${moment().format("hh:mm:A")}`,
          updatedUser 
        });

      case 'get_day':
        return res.json({
          type,
          userInput : gemResult.userInput,
          response: `Today is ${moment().format("dddd")}`,
          updatedUser 
        });

      case 'get_month':
        return res.json({
          type,
          userInput : gemResult.userInput,
          response: `Today is ${moment().format("MMMM")}`,
          updatedUser 
        });

      case 'google_search' :
      case 'youtube_search' :
      case 'youtube_play' :
      case 'general' :
      case 'calculator_open' :
      case 'facebook_open' :
      case 'weather_show' :
      case 'linkedin_open':
      case 'gmail_open':
      case 'whatsapp_open':
      case 'news_read':
        return res.json({
          type,
          userInput:gemResult.userInput,
          response:gemResult.response,
          updatedUser 
        });

      default:
        return res.status(400).json({
          response: "I didnt understand the command",
          updatedUser 
        })
    }
    
  } catch (error) {
     return res.status(500).json({
            response: "Assistant Error" })
  }
}