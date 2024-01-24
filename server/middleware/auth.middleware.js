import AppError from "../utils/error.util.js";
import jwt from 'jsonwebtoken'
import User from "../models/userModels.js";

const isLoggedIn=(req,res,next)=>{
    const token=(req.cookies && req.cookies.token)||null;;
    if(!token){
        return next(new AppError("unauthenticated,please login again",401));

    }
    try{
    const userDetails= jwt.verify(token,process.env.JWT_SECRET);
    req.user=userDetails;
    }
    catch(error){
        return next(new AppError(error.message,400));
    }
    next();
}
//roles is the list of roles permitted to the user
const authorizedRoles=(...roles)=>async(req,res,next)=>{
    //roles is sent as "admin"
    //if user role has admin only then give access
    //all information about logged in user is being sent in the token or cookie
    const currentUserRoles=req.user.role;
    if(!roles.includes(currentUserRoles)){
        //roles is the list kaun kaun se users kaun kaun seh roles permitted hain check if 
        //the user ka role is included
        return next(new AppError("no permission to access this route",408));
        //408 is for authentication error



    }
    next();
}
const authorizedSubscriber=async(req,res,next)=>{
    const user1=await User.findById(req.user.id);
    

    if(user1.role!=="ADMIN" && user1.subscription.status !=="active"){
        return next(new AppError("please subscribe to access",408));

    }
    next();

};
export {authorizedRoles,
 isLoggedIn,
authorizedSubscriber}
