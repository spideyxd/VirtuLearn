import { useState } from "react";
import HomeLayout from "../layouts/HomeLayout";
import toast from "react-hot-toast";
import axiosInstance from "../helpers/axiosInstance";


function Contact(){
    const [userInput,setUserinput]=useState({
        name:"",
        email:"",
        message:"",
    });
    function handleInputChange(e){
        const {name,value}=e.target;
        setUserinput({
            ...userInput,
            [name]:value
        })
    }
    async function onFormSubmit(e){
        e.preventDefault();
        if(!userInput.email || !userInput.name || !userInput.message){
            toast.error("all fields mandatory!!");return;
        }
        //email validating
        if(!userInput.email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
            toast.error("Invalid email id");
            return;
        }
        try{
            const response=axiosInstance.post("/contact",{...userInput});
            toast.promise(response,{
                loading:"submitting your message",
                success:"form submitted successfully",
                error:"could not submit"
            })
            const contactResponse=await response;
            if(contactResponse?.data?.success){
                setUserinput({
                    name:"",
                    email:"",
                    message:"",
                })
            }
        }
        catch(error){
            toast.error("operation failed");

        }

    
    
    }
    return(
        <HomeLayout>
            <div className="flex items-center justify-center h-[90vh] bg-gray-800">
                <form noValidate onSubmit={onFormSubmit} className="flex flex-col items-center justify-center gap-2 p-5 rounded-md text-white shadow-[0_0_10px_black] bg-gray-800 w-[22rem]">
                <h1 className="text-3xl font-semibold">
                    Contact Form
                </h1>
                <div className="flex flex-col w-full gap-1">
                    <label htmlFor="name" className="text-xl font-semibold">Name</label>
                    <input value={userInput.name} onChange={handleInputChange} className="bg-transparent border px-2 py-1 rounded-sm" id="name" type="text" name="name" placeholder="Enter your name"/>
                </div>
                <div className="flex flex-col w-full gap-1">
                    <label htmlFor="email" className="text-xl font-semibold">Email</label>
                    <input value={userInput.email} onChange={handleInputChange} className="bg-transparent border px-2 py-1 rounded-sm" id="email" type="email" name="email" placeholder="Enter your email"/>
                </div>
                <div className="flex flex-col w-full gap-1">
                    <label htmlFor="message" className="text-xl font-semibold">Message</label>
                    <textarea value={userInput.message} onChange={handleInputChange} className="bg-transparent border px-2 py-1 rounded-sm resize-none h-40" id="message"  name="message" placeholder="Enter your message"/>
                </div>
                <button type="submit" className=" rounded-sm py-2 font-semibold text-lg cursor-pointer w-full bg-yellow-600 hover:bg-yellow-400 transition-all ease-in-out duration-300">
                Submit
                </button>
        
        
        
                </form>
            
            
            </div>
        
        
        
        </HomeLayout>

    );

}
export default Contact;