// import jwt from "jsonwebtoken"
// const isAuth = async(req,res, next) => {
//     try {
//         const token = req.cookies.token
//         if(!token) {
//             return res.status(400).json({
//                 message: "Token not Found"
//             })
//         }
//         const verifyToken = jwt.verify(token,process.env.JWT_SECRET)
//         req.userId=verifyToken.userId 

//         next()

//     } catch (error) {
//         console.log(error)
//         return res.status(500).json({
//             message: "Is Auth Error"
//         })       
        
//     }
// }

// export default isAuth



import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    console.log("🔍 Checking auth middleware...");
    const token = req.cookies?.token;
    console.log("🍪 Token from cookies:", token ? "Token found" : "No token");

    if (!token) {
      return res.status(401).json({ message: "Token not found in cookies" });
    }

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verifyToken.userId;
    console.log("✅ Token verified successfully, userId:", req.userId);

    next();
  } catch (error) {
    console.error("🚨 Token verification failed:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default isAuth;


