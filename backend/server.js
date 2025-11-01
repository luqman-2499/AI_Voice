import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connectDb from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes.js"



const app = express()
app.set("trust proxy", 1); // trust Render’s proxy so secure cookies work

app.use(
  cors({
      origin: [
      // "http://localhost:5173",  // LOCAL TESTING
      "https://ai-voice-theta.vercel.app"  // DEPLOYMENT
      ],
      credentials: true
  })
);

const port = process.env.PORT || 5000
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)



app.listen(port, () => {
  connectDb();
  console.log(`✅ Server started on port ${port}`);
});


