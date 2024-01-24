

import { Route, Routes } from 'react-router-dom'
import './App.css'
import Footer from './components/footer'
import HomePage from "./Pages/HomePage"
import AboutUs from "./Pages/AboutUs"
import NotFound from './Pages/NotFound'
import Signup from './Pages/SignupPage'
import Login from './Pages/Login'
import CourseList from './Pages/Course/courseList'
import Contact from './Pages/contact'
import Denied from './Pages/denied'
import CourseDescription from './Pages/Course/courseDescription'
import RequireAuth from './components/RequireAuth'
import CreateCourse from './Pages/Course/createCourse'
import Profile from './Pages/User/Profile'
import EditProfile from './Pages/User/editProfile'
import Checkout from './Pages/payment/checkout'
import CheckoutSuccess from './Pages/payment/checkoutSuccess'
import CheckoutFail from './Pages/payment/checkoutFail'
import DisplayLectures from './Pages/Dashboard/displayLectures'
import AddLecture from './Pages/Dashboard/addLecture'
import AdminDashboard from './Pages/Dashboard/AdminDashboard'
import ChangePassword from './Pages/ChangePassword'


function App() {
  

  return (
    <>
    
    <Routes>
      <Route path="/" element={<HomePage/>}></Route>
      <Route path="/about" element={<AboutUs/>}></Route>
      <Route path="/signup" element ={<Signup/>}></Route>
      <Route path="/login" element ={<Login/>}></Route>
      <Route path="/courses" element ={<CourseList/>}></Route>
      <Route path="/contact" element ={<Contact/>}></Route>
      <Route path="/denied" element ={<Denied/>}></Route>
      <Route path="/course/description" element ={<CourseDescription/>}></Route>
      
      <Route element ={<RequireAuth allowedRoles={["ADMIN"]}/>}>
          <Route path="/course/create" element ={<CreateCourse/>}/>
          <Route path="/admin/dashboard" element ={<AdminDashboard/>}/>
          <Route path="/course/addLecture" element ={<AddLecture/>}/>
      </Route>
      
      <Route element ={<RequireAuth allowedRoles={["ADMIN","USER"]}/>}>
      <Route path="/user/profile" element ={<Profile/>}/>
      <Route path="/user/editprofile" element ={<EditProfile/>}/>
      <Route path="/checkout" element ={<Checkout/>}/>
      <Route path="/checkout/success" element ={<CheckoutSuccess/>}/>
      <Route path="/checkout/fail" element ={<CheckoutFail/>}/>
      <Route path="/course/displaylecture" element ={<DisplayLectures/>}/>
      <Route path="/changepassword" element ={<ChangePassword/>}/>

      </Route>

      <Route path="*" element ={<NotFound/>}></Route>
    </Routes>
    </>
  )
}

export default App
