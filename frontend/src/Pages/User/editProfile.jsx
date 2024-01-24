import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getUserData, updateProfile } from "../../Redux/Slices/AuthSlice";
import { Link, useNavigate } from "react-router-dom";
import HomeLayout from "../../layouts/HomeLayout";
import { BsPersonCircle } from "react-icons/bs";
import { AiOutlineArrowLeft } from "react-icons/ai";

function EditProfile(){
    const dispatch=useDispatch();
    const navigate=useNavigate();
    
    const [data,setData]=useState({
        previewImage:"",
        fullName:"",
        avatar:null,
        userId:useSelector((state)=>state?.auth?.data?._id)

    });
function handleImageUpload(e){
        e.preventDefault();
        const uploadedImage=e.target.files[0];//getting image
        if(uploadedImage){
            
            const fileReader=new FileReader();
            fileReader.readAsDataURL(uploadedImage);
            fileReader.addEventListener("load",function(){
                setData({
                    ...data,
                    previewImage:this.result,//this data url will be going to backend actually to get the pic
                    avatar:uploadedImage,
                })
            })

        }

    }
    function handleUserInput(e){
        const {name,value}=e.target;
        setData({
            ...data,
            [name]:value
        })
    }
    async function onFormSubmit(e){
        console.log(data)
        e.preventDefault();
        if(!data.fullName||!data.avatar){
            toast.error("all fields mandatory,");
            return;
        }
        const formData=new FormData();
        formData.append("fullName",data.fullName);
        formData.append("avatar",data.avatar);
        await dispatch(updateProfile([data.userId,formData]));
        await dispatch(getUserData());
        navigate("/user/profile")

    }
    return(
        <HomeLayout>
        <div className="flex items-center justify-center h-[90vh] bg-gray-800">
                <form noValidate onSubmit={onFormSubmit} className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black] bg-gray-800">
                    <h1 className="text-center text-2xl font-bold">Edit Profile</h1>
                    <label htmlFor="image_uploads" className="cursor-pointer">
                        {data.previewImage ?(
                            
                            <img className="w-24 h-24 rounded-full m-auto" src={data.previewImage}/>
                        ):(
                            <BsPersonCircle className="w-24 h-24 rounded-full m-auto"/>
                        )
                    }
                    </label>
                    <input 
                        onChange={handleImageUpload}
                        className="hidden" 
                        name="image_uploads"
                        type="file" 
                        id="image_uploads" 
                        accept=".jpg,.jpeg,.png,.svg"/>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="fullName" className="font-semibold">Name</label>
                        <input 
                            type="text"
                            required
                            name="fullName"
                            id="fullName"
                            placeholder="Enter your full name"
                            className="bg-transparent px-2 py-1 border"
                            value={data.fullName}
                            onChange={handleUserInput}/>
                    </div>
                    
    
                    <button type="submit" className="mt-2 bg-yellow-600 hover:bg-yellow-400 transition-all ease-in-out duration-300 text-black font-semibold hover:text-blue-950 rounded-md py-1 text-lg cursor-pointer ">
                    Update Profile
                    </button>
                    <Link to="/user/profile">
                        <p className=" w-full gap-2 link text-accent cursor-pointer flex items-center justify-center">
                        <AiOutlineArrowLeft/>Go back to profile
                        </p>
                    </Link>
                    
                   
                    </form>
            </div>
        
        
        
        
        </HomeLayout>
    )


}
export default EditProfile;