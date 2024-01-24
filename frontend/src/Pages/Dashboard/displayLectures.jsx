import { useEffect, useState } from "react";
import HomeLayout from "../../layouts/HomeLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteCourseLectures, getCourseLectures } from "../../Redux/Slices/LectureSlice";

function DisplayLectures(){
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const {state}=useLocation();
    const {lectures}=useSelector((state)=>state.lecture);//once loaded lectures are put into state
    const {role}=useSelector((state)=>state.auth);
    //we maintain a localstate to know which vdo the user was playing so that when u reopen that vdo can play
    const [currentVideo,setCurrentVideo]=useState(0);
    async function onLectureDelete(courseId,lectureId){
        await dispatch(deleteCourseLectures({
            courseId:courseId,
            lectureId:lectureId
        }))
        //now we gotta get course lectures to update state
        await dispatch(getCourseLectures(courseId))
    }
    useEffect(()=>{//on component load this is excecuted
        //this is the state received from the course description which has course information
        if(!state)navigate("/courses")//when u open in new tab the state comes as null thats why as state is sent to this particular route
        dispatch(getCourseLectures(state._id)); //this puts the lectures list into the lectures state
        console.log(state);
    },[])
return(
    <HomeLayout>
        <div className="flex flex-col items-center gap-10 justify-center min-h-[90vh] py-10 text-white  bg-gray-800">
            <div className="text-center text-2xl font-semibold text-yellow-500 ">
                Course Name:{state?.title}
            </div>
            {(lectures &&  lectures.length>0)?
                (<div className="flex justify-center gap-10 w-full ">
                {/*left section for videos and course details for admin */}
                <div className="py-5 space-y-5 w-[28rem] p-2 rounded-lg shadow-[0_0_10px_black]">
                
                    <video src={lectures && lectures[currentVideo]?.thumbnail?.secure_url}
                            className="object-fill rounded-tl-lg rounded-tr-lg w-full  "
                            controls
                            disablePictureInPicture
                            muted
                            controlsList="nodownload">
                    </video>
                    <div>
                        <h1>
                        <span className="text-yellow-500">Title is:{" "}
                        
                        </span>
                        {lectures[currentVideo]?.title}
                        
                        </h1>
                        <p>
                        <span className="text-yellow-500 ">
                            Description:{" "}
                        </span>
                        <div>
                        {lectures[currentVideo]?.description}</div>
                        </p>
                    </div>
                </div>
                {/*right section for list of lectures */}
                <ul className=" py-5 text-center font-bold w-[28rem] p-2 rounded-lg shadow-[0_0_10px_black] space-y-4">   
                    <li className=" text-xl text-yellow-500 flex items-center justify-between">
                        <p>
                        Lectures List
                        </p>
                        {role==="ADMIN"&&(
                            <button onClick={()=>navigate("/course/addLecture",{state:{...state}})} className="hover:bg-yellow-300 border text-black bg-yellow-500 px-2 py-1 rounded-md  text-s,">
                            Add new lecture
                            </button>
                        )}
                    
                    </li>
                    {lectures&& lectures.map((lecture,idx)=>{
                        return(
                            <li key={lecture.id} className="space-y-2 ">
                                <p className="hover:scale-105 hover:bg-gray-500 text-left px-5 h-10 border cursor-pointer py-1" onClick={()=>setCurrentVideo(idx)}>
                                    <span>
                                        {" "}Lecture {idx+1}:{" "}
                                    </span>
                                    {lecture?.title}
                                </p>
                                
                                    {role==="ADMIN"&&(
                                        <button onClick={()=>onLectureDelete(state?._id,lecture?._id)} className="border text-white bg-red-700 hover:bg-red-500 px-2 py-1 rounded-md font-semibold text-s,">
                                        delete {" "}Lecture {idx+1}:{" "}
                                        </button>
                                    )}
                                

                            
                            </li>
                        )
                    })}
                
                
                </ul>
            </div>):( 
                role && role==="ADMIN"&&(
                <button onClick={()=>navigate("/course/addLecture",{state:{...state}})} className="hover:bg-yellow-300 border text-black bg-yellow-500 px-2 py-1 rounded-md  text-s,">
                Add new lecture
                </button>
            ))}
        </div>
    
    </HomeLayout>
)
}
export default DisplayLectures;