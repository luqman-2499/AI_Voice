import genTokenAndSetCookie from "../config/token.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const signUp = async (req,res) => {
    try {
        const {name, email, password} = req.body

        const existEmail = await User.findOne({email})
        if(existEmail) {
            return res.status(400).json({message: "Email already exists!!"})
        }

        if(password.length <6) {
            return res.status(400).json({message: "Password must be atleast 6 Characters!!"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,password:hashedPassword,email
        })

        const token = await genTokenAndSetCookie(user._id, res)

        return res.status(201).json(user)

    } catch (error) {
        return res.status(500).json({message: `sign up error ${error}`})
    }
}

export const login = async (req,res) => {
    try {
        const {email, password} = req.body

        const user = await User.findOne({email})
        if(!user) {
            return res.status(400).json({message: "Email does not exists!!"})
        }

        const isMatch =  await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.status(400).json({message: "Incorrect Password!!"})
        }

        const token = await genTokenAndSetCookie(user._id, res)

        return res.status(201).json(user)

    } catch (error) {
        return res.status(500).json({message: `Login  error ${error}`})  
    }
}

export const logOut = async (req,res) => {
    try {
        res.clearCookie("token", {
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: process.env.NODE_ENV === 'production'
        })
        return res.status(200).json ({message: "Logged out Successfully"})

    } catch (error) {
        return res.status(500).json({message: `logout error ${error}`})
    }
}



