import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllCourses } from "../../Redux/Slices/CourseSlice";
import HomeLayout from "../../layouts/HomeLayout";
import CourseCard from "../../components/CourseCard";

function CourseList(){
    const dispatch=useDispatch();
    const navigate=useNavigate();
    //in login and signup we made state here itself as auth slice has state having state of authentication
    //here the course slice has our state and course data
    const {courseData}=useSelector((state)=>state.course)
    //on first load of component useeffect will load the course Data
    async function loadCourses(){
        await dispatch(getAllCourses());

    }
    //you want
    useEffect(()=>{
        loadCourses();
    },[]);

    return(
        <HomeLayout>
            <div className="min-h-[90vh] pt-12 pl-20 flex flex-col gap-10 text-white  bg-gray-800">
                <h1>
                    Explore the courses made by 
                    <span className="font-bold text-yellow-500">
                        Industry Experts
                    </span>
                    <div className="mb-10 flex flex-wrap gap-10">
                        {courseData?.map((element)=>{
                            return <CourseCard key={element._id} data={element}/>
                        })}
                    
                    
                    </div>
                
                </h1>
            
            
            
            </div>
        
        
        
        
        </HomeLayout>
    )

}
export default CourseList;