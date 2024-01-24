import { useLocation, useNavigate } from "react-router-dom";
import HomeLayout from "../../layouts/HomeLayout";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { addCourseLectures } from "../../Redux/Slices/LectureSlice";
import { useEffect, useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";

function AddLecture(){
    const courseDetails=useLocation().state;
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const [userInput,setUserInput]=useState({
        id:courseDetails?._id,
        thumbnail:null,
        title:"",
        description:"",
        videoSrc:""
    })
    function handleUserInput(e){
        const {name,value}=e.target;
        setUserInput({
            ...userInput,
            [name]:value
        })
    }
    function handleVideoUpload(e){
        e.preventDefault();
        const uploadedVideo=e.target.files[0];//getting image
        if(uploadedVideo){
            
            const fileReader=new FileReader();
            fileReader.readAsDataURL(uploadedVideo);
            fileReader.addEventListener("load",function(){
                setUserInput({
                    ...userInput,
                    videoSrc:this.result,//this data url will be going to backend actually to get the pic
                    thumbnail:uploadedVideo,
                })
            })

        }
            

        }

    async function onFormSubmit(e){
        e.preventDefault();
        if(!userInput.thumbnail || !userInput.title || !userInput.description){
            toast.error("All fields mandatory");return;
        }
        const formData=new FormData();
        formData.append("title",userInput.title);
        formData.append("description",userInput.description);
        
        formData.append("thumbnail",userInput.thumbnail);
        const response=await dispatch(addCourseLectures([userInput.id,formData]));
        if(response?.payload?.success){
            setUserInput(
                {
                    id:courseDetails._id,
                    thumbnail:null,
                    title:"",
                    description:"",
                    videoSrc:""
                }
            )

        }

    }
    useEffect(()=>{
        if(!courseDetails)navigate("/courses")
       

    },[])
    return(
        <HomeLayout>
        <div className=" flex items-center justify-center h-[90vh] bg-gray-800">
            <div className=" flex relative flex-col justify-center gap-3 rounded-lg text-white p-4 shadow-[0_0_10px_black] bg-gray-800 w-[60vh]">
                <header className="flex items-center justify-center relative">
                <button onClick={()=>navigate(-1)} className="absolute left-2 text-xl text-green-500">
                    <AiOutlineArrowLeft/>
                </button>
                <h1 className="text-cl text-yellow-500 font-semibold">
                    Add new Lecture
                </h1>
                
                </header>
                <form onSubmit={onFormSubmit} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2 mb-3">
                    <label htmlFor="title" className="font-semibold">Lecture Title</label>
                    <input type="text"
                            name="title"
                            placeholder="enter title of lecture"
                            onChange={handleUserInput}
                            className="bg-transparent px-3 py-1 border"
                            value={userInput.title}/>
                    </div>
                    <div className="flex flex-col gap-2 mb-3">
                    <label htmlFor="description" className="font-semibold">Lecture description</label>
                    <textarea type="text"
                            name="description"
                            placeholder="enter title of description"
                            onChange={handleUserInput}
                            className="bg-transparent h-24 px-3 py-1 border resize-none overflow-y-scroll h-"
                            value={userInput.description}/>
                    </div>
                    {userInput.videoSrc?(
                        <video muted
                            src={userInput.videoSrc}
                            controls
                            controlsList="nodownload nofullscreen"
                            disablePictureInPicture
                            className="object-fill rounded-tl-lg rounded-tr-lg w-full">
                        
                        </video>
                    ):(
                        <div className="flex flex-col gap-3 items-center justify-center h-48 border cursor-pointer">
                            <label  className="font-semibold text-cl cursor-pointer hover:text-yellow-400" htmlFor="lecture">Choose Your Video</label>
                            <input type="file" className="hidden " 
                                    id="lecture"
                                    name="lecture"
                                    onChange={handleVideoUpload}
                                    accept="video/mp4 video/x-mpy video/*"></input>
                        
                        </div>

                    )}
                    <button type="submit" className="w-full mt-2 bg-yellow-600 hover:bg-yellow-400 transition-all ease-in-out duration-300 text-black font-semibold hover:text-blue-950 rounded-md py-1 text-lg cursor-pointer  ">
                    Create Lecture
                    
                    </button>
                
                </form>
            </div>

        </div>


        </HomeLayout>
    )

}
export default AddLecture;