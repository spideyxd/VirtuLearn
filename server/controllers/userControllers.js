import UserModel from '../models/userModels.js' 
import emailValidator from "email-validator"
import bcrypt from 'bcryptjs';
import AppError from '../utils/error.util.js';
import sendEmail from '../utils/sendEmail.js';
import cloudinary from 'cloudinary'
import fs from 'fs/promises'
import crypto from 'crypto'
import asyncHandler from '../middleware/asyncHandler.middleware.js'


const cookieOption={
    maxAge:7*24*60*60*1000,//7 days
    httpOnly:true
   
};


const register=async(req,res,next)=>{
console.log("hi");
    const {fullName,email,password}=req.body;
    if(!fullName|| !email || !password){
        //res.status(400).json({
           // success:false,
            //message:"every field is mandatory"
        //})
        //above lines are used everywhere so we use utils to optimize
        return next(new AppError("all fields mandatory",400));
        //we design a middleware when error occus we create an object of appError class
        //and send it forward it next andre
        //in app.use in app.js whichever route is going on it will go next to the last route ie middlewareerror wala and then display the errors

    }
    const validEmail=emailValidator.validate(email);
    if(!validEmail){
        return next(new AppError("email is not valid",400));
    }

    const userExists=await UserModel.findOne({email});
    if(userExists){
        return next(new AppError("email already exists",400));
    }
    //if user doesnt exist create user
    //2 step process this time we create first
    const user=await UserModel.create({
        fullName,
        email,
        password,
        avatar:{
            public_id:email,
            secure_url:'https://res.cloudinary.com/du9jzqlpt/image/upload/v16747316/avatar_user'
        }
    });
    //if user doesnt create error
    if(!user){
        return next(new AppError("user registration failed",400));
    }
    
    //to do:file upload whatver url comes at the end replace recure_url on the top with this and then save
    //we do not want dummy avatar
    if(req.file){
        try{
            const result=await cloudinary.v2.uploader.upload(req.file.path,{//arguments path to upload and configuration
                folder:'lms',
                width: 250,
                height:250,//the cloudinary image will be cropped 
                gravity:'faces',
                crop:'fill'
            });
            if(result){
                user.avatar.public_id=result.public_id;
                user.avatar.secure_url=result.secure_url;
                //remove file from uploads folder na
                fs.rm(`uploads/${req.file.filename}`);
            }

        }
        catch(error){
            new AppError(error || "file not uploaded please try again",500);

        }
    }

    await user.save();//saves the user to db
    
    //once signup is done directly let user signin
    //to signin first token generate then put to cookie
    const token= user.generateJWTToken();
    user.password=undefined;
    res.cookie('token',token,cookieOption);
    //automatic login will happen
    res.status(200).json({
        success:true,
        message:"user registered successfully",
        user
    });


};
const login=async(req,res,next)=>{
    try{
    const {email,password}=req.body;
    if(!email || !password){
        return next(new AppError("all fields mandatory",400));
    }
    const user=await UserModel.findOne({
        email
    }).select('+password');
    if(!user || !bcrypt.compare(user.password,password)){//used to compare encrypted passwords
        //if no such user or password no match
        return next(new AppError("email or password does not match",400));
    }

    const token= user.generateJWTToken();
    user.password=undefined;
    res.cookie('token',token,cookieOption);
    res.status(200).json({
        success:true,
        message:"user logged in successfully",
        user:user
    })}
    catch(error){
        return next(new AppError(error.message,500));
    }

};
const logout=(req,res)=>{
    try{
        const cookieOptions={
            expires:new Date(),
            secure:true,
            maxAge:0,
            httpOnly:true
        };
        res.cookie("token",null,cookieOptions);
        res.status(200).json({
            success:true,
            message:"logged out sucessfully"
            
        })

    }
    catch(error){
        return next(new AppError("error in logging out",400));
    }

};
const getProfile=async(req,res)=>{
    try{//gotta know who is user from cookie na
    const userId=req.user.id;
    const user=await UserModel.findById(userId);
    res.status(200).json({
        success:true,
        message:"user details",
        user
    })
    }
    catch(e){
        return next(new AppError("failed to fetch profile details",500));
    }


};
const forgotPassword=async(req,res,next)=>{
    const {email}=req.body;
    if(!email){
        return next(new AppError("email is needed",400));
    }
    const user=await UserModel.findOne({email});
    if(!user){
        return next(new AppError("email is not registered",400));
    }
    //generating url
    const resetToken=await user.generatePasswordResetToken();
    //save the updated user details within the method to db
    await user.save();
    const subject="changing password";
    const resetPasswordURL=`${process.env.FRONTEND_URL}/reset-password/${resetToken}`//in frontend create a route to this page this will navigate to that page
    //here /resetpassword is the route to reset password 
    //gotta send email to this url
    const message=`you can reset your password by clicking <a href=${resetPasswordURL} target="_blank"> Reset your password</a>`;
    try{
        await sendEmail(email,subject,message);
        res.status(200).json({
            success:true,
            message:`reset password token has been sent to ${email} successfully `
        })
    }
    catch(error){
        //if email is not being sent then we gotta undo the stuff we did na
        user.forgetPasswordExpiryDate=undefined;
        user.forgotPasswordToken=undefined;
        await user.save();//gotta save na cus it gotta be reflected in database
        return next(new AppError("could not send mail",400));
    }
};
const resetPassword=async(req,res)=>{
    //email seh token mil jayega
    //data is coming in param form
    //ie resetToken ya  we gave na reset/:resettoken
    const {resetToken}=req.params;
    const {password}=req.body;
    const forgotPasswordToken=crypto //decrypting the token
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    const user= await UserModel.findOne({
        forgotPasswordToken,//this will check if any user in the database has the same token 
        forgetPasswordExpiryDate:{$gt:Date.now()}//the token even though exists its expiry must be in the future to be valid
    });
    if(!user){
        return next(new AppError("token is expired",400));
    }
    user.password=password;
    //on reset the user ka parameters have to be set back to undefined
    user.forgotPasswordToken=undefined;
    user.forgetPasswordExpiryDate=undefined;
    user.save();
    res.status(200).json({
        success:true,
        message:"password changed suceessfully"
    })

};
const changePassword=async(req,res,next)=>{
    //if old password u get right then let him update
    console.log(req.body)
    const {oldPassword,newPassword}=req.body;
    const {id}=req.user;//in auth we put user info on login into req.user
    if(!oldPassword || !newPassword){
        return next(new AppError("all fields mandatory",400));
    }
    const user=await UserModel.findById(id).select("+password");
    if(!user){
        return next(new AppError("user doesnt exists",400));

    }
    if(!bcrypt.compare(user.password,oldPassword)){
        return next(new AppError("password is not right",400));
    }
    else{
        user.password=newPassword;
        await user.save();
        user.password=undefined;
        res.status(200).json({
            success:true,
            message:"password changed sucessfully",
            user:user
        })
    }

}
const updateUser=asyncHandler(async(req,res,next)=>{
    //edit fullname or pfp
    const {fullName}=req.body;
    const {id}=req.params;
    const user=await UserModel.findById(id);
    
    if(!user){
        return next(new AppError("user does not exist",400));
    }
    if(fullName){
        user.fullName=fullName;
   }
    if(req.file){
        //delete the file from cloudinary ie old pfp
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
        try{
            const result=await cloudinary.v2.uploader.upload(req.file.path,{//arguments path to upload and configuration
                folder:'lms',
                width: 250,
                height:250,//the cloudinary image will be cropped 
                gravity:'faces',
                crop:'fill'
            });
            if(result){
                user.avatar.public_id=result.public_id;
                user.avatar.secure_url=result.secure_url;
                //remove file from uploads folder na
                fs.rm(`uploads/${req.file.filename}`);
            }

        }
        catch(error){
            new AppError(error || "file not uploaded please try again",500);

        }
    }
    await user.save();
    res.status(200).json({
        success:true,
        message:"successfully updated",
        user
    })

})
//exporting multiple
export{
    register,
    login,
    logout,
    getProfile,
    forgotPassword,
    resetPassword,
    changePassword,
    updateUser
}