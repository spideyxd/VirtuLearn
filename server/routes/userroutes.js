import express from "express";
import {register,login,logout,getProfile,resetPassword, forgotPassword,changePassword,updateUser} from "../controllers/userControllers.js";
import { isLoggedIn}  from "../middleware/auth.middleware.js";
import {upload } from "../middleware/multer.middleware.js"
const router=express.Router();
router.post('/register',upload.single("avatar"),register);//single file uploading with key avatar na
//avatar meh jo bhi data aaraha middleware store the file in destinations and then generate the path

router.post('/login',login);
router.get('/logout',isLoggedIn,logout);
router.get('/me',isLoggedIn,getProfile);
router.post('/reset',forgotPassword);
router.post('/reset/:resetToken',resetPassword);
//here :represents a token which comes from step 1
router.post("/change-password",isLoggedIn,changePassword)
//for updation use put method
router.put('/update/:id',isLoggedIn,upload.single("avatar"),updateUser)
export default router;