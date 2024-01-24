import { useState } from "react";
import HomeLayout from "../layouts/HomeLayout";
import { BsPersonCircle } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {toast} from "react-hot-toast";
import { createAccount } from "../Redux/Slices/AuthSlice";
import { login } from "../Redux/Slices/AuthSlice";

function Signup(){
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const[previewImage,setPreviewImage]=useState("");
    const [signupData,setSignupData]=useState({
        fullName:"",
        email:"",
        password:"",
        avatar:"",
    });
    
    function handleUserInput(e){
        const {name,value}=e.target;
        setSignupData({
            ...signupData,
            [name]:value
        })
    }
    function getImage(e){
        e.preventDefault();
        const uploadedImage=e.target.files[0];//getting image
        if(uploadedImage){
            setSignupData({
                ...signupData,
                avatar:uploadedImage
            });
            const fileReader=new FileReader();
            fileReader.readAsDataURL(uploadedImage);
            fileReader.addEventListener("load",function(){
                setPreviewImage(this.result)
            })

        }

    }
    async function createNewAccount(event){
        event.preventDefault();
        if(!signupData.email || !signupData.password || !signupData.fullName || !signupData.avatar){
            toast.error("Please fill all details");
            return;

        }
        //checking name field length
        if(signupData.fullName.length<5){
            toast.error("name should be atleast of 5 characters");
            return;
        }
        //email validating
        if(!signupData.email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
            toast.error("Invalid email id");
            return;
        }
        //password validating
        if(!signupData.password.match( /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)){
            toast.error("password must be 6-16 character long with atleast one number and one special character")
        }
        
        const formData=new FormData();
        formData.append("fullName",signupData.fullName);
        formData.append("email",signupData.email);
        formData.append("password",signupData.password);
        formData.append("avatar",signupData.avatar);
        
        //dispatch create account action
        const response=await dispatch(createAccount(formData));
        if(response?.payload?.success){
            
           
                navigate("/");
        
           
        
        //once action is successful
        
        setSignupData({
                fullName:"",
                email:"",
                password:"",
                avatar:"",
        });
       
        setPreviewImage("")

            }
           
            


    }
    return(
        <HomeLayout>
            <div className="flex items-center justify-center h-[90vh] bg-gray-800">
                <form noValidate onSubmit={createNewAccount} className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black] bg-gray-800">
                    <h1 className="text-center text-2xl font-bold">Signup Page</h1>
                    <label htmlFor="image_uploads" className="cursor-pointer">
                        {previewImage?(
                            <img className="w-24 h-24 rounded-full m-auto" src={previewImage}/>
                        ):(
                            <BsPersonCircle className="w-24 h-24 rounded-full m-auto"/>
                        )//if preview pis is uploaded then that is shown else give upload option n default img
                    }
                    </label>
                    <input 
                        onChange={getImage}
                        className="hidden" 
                        type="file" 
                        id="image_uploads" 
                        accept=".jpg,.jpeg,.png,.svg"/>{/*hidden cus of the html for when u click on the label only it ll go to fileupload */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="fullName" className="font-semibold">Name</label>
                        <input 
                            type="text"
                            required
                            name="fullName"
                            id="fullName"
                            placeholder="Enter your full name"
                            className="bg-transparent px-2 py-1 border"
                            value={signupData.fullName}
                            onChange={handleUserInput}/>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="email" className="font-semibold">Email</label>
                        <input 
                            type="email"
                            required
                            name="email"
                            id="email"
                            placeholder="Enter your email"
                            className="bg-transparent px-2 py-1 border"
                            value={signupData.email}
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
                            value={signupData.password}
                            onChange={handleUserInput}/>
                    </div>
                    <button type="submit" className="mt-2 bg-yellow-600 hover:bg-yellow-400 transition-all ease-in-out duration-300 text-black font-semibold hover:text-blue-950 rounded-md py-1 text-lg cursor-pointer ">
                    Create Account
                    </button>
                    <p className="text-center">
                     Already have an account? <Link to="/login" className="link text-accent cursor-pointer">Login</Link>
                    </p>
                   
                    </form>
            </div>
        
        
        
        
        </HomeLayout>
    )

}
export default Signup;