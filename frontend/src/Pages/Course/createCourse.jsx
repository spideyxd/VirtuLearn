import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createNewCourse } from "../../Redux/Slices/CourseSlice";
import HomeLayout from "../../layouts/HomeLayout";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Link } from "react-router-dom";
function CreateCourse(){
    const dispatch=useDispatch();
    const navigate=useNavigate();
    //a state to hold form ka data
    const [userInput,setUserInput]=useState({
        title:"",
        category:"",
        createdBy:"",
        description:"",
        thumbnail:null,
        previewImage:""//holds the data url to get the image

    })
    function handleImageUpload(e){
        e.preventDefault();
        const uploadedImage=e.target.files[0];//getting image
        if(uploadedImage){
            
            const fileReader=new FileReader();
            fileReader.readAsDataURL(uploadedImage);
            fileReader.addEventListener("load",function(){
                setUserInput({
                    ...userInput,
                    previewImage:this.result,//this data url will be going to backend actually to get the pic
                    thumbnail:uploadedImage,
                })
            })

        }

    }
    function handleUserInput(e){
        const {name,value}=e.target;
        setUserInput({
            ...userInput,
            [name]:value
        })
    }
    async function onFormSubmit(e){
        e.preventDefault();//by default form submit karne par it refreshes usko we are avoiding
        if(!userInput.title||!userInput.description||!userInput.category||!userInput.createdBy||!userInput.thumbnail){
            toast.error("all fields are mandatory");
            return;
        }
        const formData=new FormData();
        formData.append("title",userInput.title);
        formData.append("description",userInput.description);
        formData.append("createdBy",userInput.createdBy);
        formData.append("category",userInput.category);
        formData.append("thumbnail",userInput.thumbnail);
        
        //dispatch create account action
        const response=await dispatch(createNewCourse(formData));
        if(response?.payload?.success){
            setUserInput({
                title:"",
        category:"",
        createdBy:"",
        description:"",
        thumbnail:null,
        previewImage:""//holds the data url to get the image

            })
            navigate("/courses");
        }


    }
    return(
        <HomeLayout>
            <div className="flex items-center justify-center h-[90vh] bg-gray-800">
                <form onSubmit={onFormSubmit}
                    className="flex relative flex-col justify-center gap-3 rounded-lg p-4 text-white w-120 shadow-[0_0_10px_black] bg-gray-800 ">
                    <Link onClick={()=>navigate(-1)} className=" absolute top-6 text-2xl link text-accent cursor-pointer">
                        <AiOutlineArrowLeft/>
                    </Link>
                    <h1 className="text-center text-2xl font-bold">Create New Course</h1>
                    <main className="grid grid-cols-2 gap-x-10">
                        <div className="gap-y-6">
                            <div>
                                <label htmlFor="image_uploads" className="cursor-pointer">
                                {userInput.previewImage?(
                                    <img className="w-full h-44 m-auto border"
                                    src={userInput.previewImage}/>
                                ):( 
                                    <div className="w-full h-44 m-auto mt-10 mb-8 flex items-center justify-center border">
                                        <h1 className="font-bold text-lg m-5">Upload your course thumbnail</h1>
                                    </div>
                                )}
                                
                                </label>
                                <input 
                                    className="hidden"
                                    type="file"
                                    id="image_uploads"
                                    accept=".jpg, .jpeg, .png"
                                    name="image_uploads"
                                    onChange={handleImageUpload}/>
                                
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="title" className="font-semibold">Course Title</label>
                                <input 
                                    type="text"
                                    required
                                    name="title"
                                    id="title"
                                    placeholder="Enter course title"
                                    className="bg-transparent px-2 py-1 border"
                                    value={userInput.title}
                                    onChange={handleUserInput}/>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 mt-5">
                            <div className="flex flex-col gap-2 mb-3">
                                <label htmlFor="createdBy" className="font-semibold">course instructor</label>
                                <input 
                                    type="text"
                                    required
                                    name="createdBy"
                                    id="createdBy"
                                    placeholder="Enter course instructor"
                                    className="bg-transparent px-2 py-1 border"
                                    value={userInput.createdBy}
                                    onChange={handleUserInput}/>
                            </div>
                            <div className="flex flex-col gap-2 mb-3">
                                <label htmlFor="category" className="font-semibold">course category</label>
                                <input 
                                    type="text"
                                    required
                                    name="category"
                                    id="category"
                                    placeholder="Enter course category"
                                    className="bg-transparent px-2 py-1 border"
                                    value={userInput.category}
                                    onChange={handleUserInput}/>
                            </div>
                            <div className="flex flex-col gap-2 mb-3">
                                <label htmlFor="description" className="font-semibold">course description</label>
                                <textarea 
                                    type="text"
                                    required
                                    name="description"
                                    id="description"
                                    placeholder="Enter course description"
                                    className="bg-transparent px-2 py-1 h-24 overflow-y-scroll border resize-none"
                                    value={userInput.description}
                                    onChange={handleUserInput}/>
                            </div>
                        </div>
                    
                    </main>
                    <button type="submit" className="w-full mt-2 bg-yellow-600 hover:bg-yellow-400 transition-all ease-in-out duration-300 text-black font-semibold hover:text-blue-950 rounded-md py-1 text-lg cursor-pointer  ">
                    Create Course
                    
                    </button>
                </form>
        
            </div>

        
        
        
        </HomeLayout>
    )

}
export default CreateCourse;