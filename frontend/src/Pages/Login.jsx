import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../Redux/Slices/AuthSlice";
import { useState } from "react";
import HomeLayout from "../layouts/HomeLayout";

import { Link } from "react-router-dom";

import {toast} from "react-hot-toast";


function Login(){
    const dispatch=useDispatch();
    const navigate=useNavigate();
    
    const [loginData,setLoginData]=useState({
       
        email:"",
        password:"",
        
    });
    function handleUserInput(e){
        const {name,value}=e.target;
        setLoginData({
            ...loginData,
            [name]:value
        })
    }

    async function onLogin(event){
        event.preventDefault();
        if(!loginData.email || !loginData.password ){
            toast.error("Please fill all details");
            return;

        }
        //const formData=new FormData();
        //formData.append("email",loginData.email);
        //formData.append("password",loginData.password);
        //can do above also or pass the json object loginData only
        
        //dispatch create account action
        const response=await dispatch(login(loginData));
        if(response?.payload?.success){
            navigate("/");
        }
        //once action is successful
        
        setLoginData({
                
                email:"",
                password:"",
               
        });
        


    }
    return(
        <HomeLayout>
            <div className="flex items-center justify-center h-[90vh] bg-gray-800">
                <form noValidate onSubmit={onLogin} className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black] bg-gray-800">
                    <h1 className="text-center text-2xl font-bold">Login Page</h1>
                    
                    <div className="flex flex-col gap-1">
                        <label htmlFor="email" className="font-semibold">Email</label>
                        <input 
                            type="email"
                            required
                            name="email"
                            id="email"
                            placeholder="Enter your email"
                            className="bg-transparent px-2 py-1 border"
                            value={loginData.email}
                            onChange={handleUserInput}/>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="password" className="font-semibold">Password</label>
                        <input 
                            type="password"
                            required
                            name="password"
                            id="password"
                            placeholder="Enter password"
                            className="bg-transparent px-2 py-1 border"
                            value={loginData.password}
                            onChange={handleUserInput}/>
                    </div>
                    <button type="submit" className="mt-2 bg-yellow-600 hover:bg-yellow-400 transition-all ease-in-out duration-300 text-black font-semibold hover:text-blue-950 rounded-md py-1 text-lg cursor-pointer ">
                    Login
                    </button>
                    <p className="text-center">
                     Dont have an account? <Link to="/signup" className="link text-accent cursor-pointer">signup</Link>
                    </p>
                   
                    </form>
            </div>
        
        
        
        
        </HomeLayout>
    )

}
export default Login;