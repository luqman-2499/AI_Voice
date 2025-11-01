import {Route, Routes, Navigate} from "react-router-dom"
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Customize from "./pages/Customize"
import { useContext } from "react"
import { userDataContext } from "./context/UserContext"
import Home from "./pages/Home"
import Customize2 from "./pages/Customize2"

function App() {
  const {userData, loading} = useContext(userDataContext)
  
  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="w-full h-screen bg-gradient-to-t from-black from-30% to-blue-900 flex justify-center items-center">
        <div className="text-white text-xl">Loading your assistant...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path='/' element={
        userData ? (
          userData.assistantImage && userData.assistantName ? <Home/> : <Navigate to={"/customize"}/>
        ) : (
          <Navigate to={"/signin"}/>
        )
      } />
      <Route path='/signup' element={!userData ? <SignUp/> : <Navigate to={"/"}/>} />
      <Route path='/signin' element={!userData ? <SignIn/> : <Navigate to={"/"}/> } />
      <Route path='/customize' element={userData ? <Customize/> : <Navigate to={"/signin"}/>}/>
      <Route path='/customize2' element={userData ? <Customize2/> : <Navigate to={"/signin"}/>}/>
    </Routes>
  )
}

export default App