import { useState } from "react";
import HomeLayout from "../layouts/HomeLayout";
import { BsPersonCircle } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {toast} from "react-hot-toast";
import { changePassword } from "../Redux/Slices/AuthSlice";


function ChangePassword(){
    const dispatch=useDispatch();
    const navigate=useNavigate();
    
    const [passwordData,setPasswordData]=useState({
        oldPassword:"",
        newPassword:""
    });
    
    function handleUserInput(e){
        const {name,value}=e.target;
        setPasswordData({
            ...passwordData,
            [name]:value
        })
    }
  
    async function changeYourPassword(event){
        event.preventDefault();
        if(!passwordData.oldPassword || !passwordData.newPassword){
            toast.error("Please fill all details");
            return;

        }
       
        
        
        
        const response=await dispatch(changePassword(passwordData));
        if(response?.payload?.success){
            
           
                navigate("/user/profile");
        
           
        
        //once action is successful
        
        setPasswordData({
               newPassword:"",
               oldPassword:""
        });
       
        

            }
           
            


    }
    return(
        <HomeLayout>
            <div className="flex items-center justify-center h-[90vh] bg-gray-800">
                <form noValidate onSubmit={changeYourPassword} className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black] bg-gray-800">
                    <h1 className="text-center text-2xl font-bold">Change password Page</h1>
                    
                    <div className="flex flex-col gap-1">
                        <label htmlFor="oldPassword" className="font-semibold">Old Password</label>
                        <input 
                            type="password"
                            required
                            name="oldPassword"
                            id="oldPassword"
                            placeholder="Enter your old Password"
                            className="bg-transparent px-2 py-1 border"
                            value={passwordData.oldPassword}
                            onChange={handleUserInput}/>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="newPassword" className="font-semibold">New password</label>
                        <input 
                            type="password"
                            required
                            name="newPassword"
                            id="newPassword"
                            placeholder="Enter your new password"
                            className="bg-transparent px-2 py-1 border"
                            value={passwordData.newPassword}
                            onChange={handleUserInput}/>
                    </div>
                   
                    <button type="submit" className="mt-2 bg-yellow-600 hover:bg-yellow-400 transition-all ease-in-out duration-300 text-black font-semibold hover:text-blue-950 rounded-md py-1 text-lg cursor-pointer ">
                    Change Password
                    </button>
                    
                   
                    </form>
            </div>
        
        
        
        
        </HomeLayout>
    )

}
export default ChangePassword;