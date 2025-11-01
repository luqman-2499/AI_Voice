import jwt from "jsonwebtoken"

const genTokenAndSetCookie = async (userId, res) => {
    try {
        const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn:"10d"})
        
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS in production
            sameSite: 'none', // Cross-site cookies
            maxAge: 10 * 24 * 60 * 60 * 1000 // 10 days
        });

        return token;
    } catch (error) {
        console.log(error);
    }
};

export default genTokenAndSetCookie;