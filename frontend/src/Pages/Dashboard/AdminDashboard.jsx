import { useDispatch, useSelector } from "react-redux";
import HomeLayout from "../../layouts/HomeLayout";
import {BarElement,Chart as ChartJS,ArcElement,Tooltip,Legend,CategoryScale,LinearScale,Title} from "chart.js"
import { useNavigate } from "react-router-dom";
import { useDebugValue, useEffect } from "react";
import { getStatsData } from "../../Redux/Slices/StatSlice";
import { getPaymentRecord } from "../../Redux/Slices/RazorpaySlice";
import {Pie,Bar} from "react-chartjs-2"
import { FaUsers } from "react-icons/fa6";
import {FcSalesPerformance} from "react-icons/fc"
import {GiMoneyStack} from "react-icons/gi"
import { BsCollectionPlayFill ,BsTrash} from "react-icons/bs";
import { deleteCourse, getAllCourses } from "../../Redux/Slices/CourseSlice";
ChartJS.register(ArcElement,BarElement,CategoryScale,Legend,LinearScale,Title,Tooltip);
function AdminDashboard(){
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const {allUsersCount,subscribedUsersCount}=useSelector((state)=>state.stat)
    const {allPayments,finalMonths,monthlySalesRecord}=useSelector((state)=>state.razorpay)
    const userData={
        labels:["Registered User","Enrolled Users"],
        datasets:[
            {
                label:"User Details",
                data:[allUsersCount,subscribedUsersCount],//it goes to labels respectively
                backgroundColor:["yellow","green"],
                borderWidth:1,
                borderColor:["yellow","green"]

            }
        ]
        
       
    }
    const salesData={
        labels:["jan","feb","mar","apr","may","jun","jul","aug","sept","oct","nov","dec"],
        fontcolor:"white",
        datasets:[
            {
                label:"sales / month",
                data:monthlySalesRecord,
                backgroundColor:["rgb(255,99,132)"],
                borderColor:"white",
                borderWidth:2,
            }
        ]
    }
    const myCourses=useSelector((state)=>state?.course?.courseData);
    async function onCourseDelete(id){
        if(window.confirm("Are you sure you want to delete course?")){
            const res=await dispatch(deleteCourse(id));
            if(res?.payload?.success){
                await dispatch(getAllCourses());
            }
        }
    }
    useEffect(()=>{
        (
            async()=>{
                await dispatch(getAllCourses());
                await dispatch(getStatsData());
                await dispatch(getPaymentRecord());
            }

        )()
    },[])
    return(
        <HomeLayout>
            <div className="min-h-[90vh] pt-5 flex flex-col flex-wrap gap-10 text-white bg-gray-800">
                <h1 className="text-center text-5xl font-semibold text-yellow-500">
                    ADMIN DASHBOARD
                </h1>
                <div className="grid grid-cols-2 gap-5 m-auto mx-10 shadow-[0_0_10px_black]">
                    <div className="flex flex-col items-center gap-10 shadow-[0_0_10px_black] p-5  rounded-md">
                        <div className="w-80 h-80">
                            <Pie data={userData}/>
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                            <div className="flex items-center shadow-[0_0_10px_black] justify-between p-5 gap-5 rounded-md ">
                                <div className="flex flex-col items-center justify-center">
                                <FaUsers className="text-yellow-500 text-5xl"/>
                                    <p className="font-semibold">
                                    Registered Users
                                    </p>
                                    <h3 className="text-4xl font-bold">{allUsersCount}</h3>
                                    
                                </div>
                               
                               
                            </div>
                            <div className="flex items-center justify-between p-5 gap-5 rounded-md shadow-[0_0_10px_black]">
                                <div className="flex flex-col items-center justify-center">
                                <FaUsers className="text-green-500 text-5xl"/>
                                <p className="font-semibold">
                                    Enrolled Users
                                    </p>
                                    <h3 className="text-4xl font-bold">{subscribedUsersCount}</h3>
                                    
                                </div>
                               
                               
                            </div>
                        </div>
                    
                    </div>
                    <div className="flex flex-col items-center gap-10 p-5 shadow-[0_0_10px_black] rounded-md">
                        <div className="h-80 w-full relative">
                            <Bar className="absolute bottom-0 h-80 w-full" data={salesData}/>
                        
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                            <div className="flex items-center shadow-[0_0_10px_black] justify-between p-5 gap-5 rounded-md ">
                                <div className="flex flex-col items-center justify-center">
                                <FcSalesPerformance className="text-yellow-500 text-5xl"/>
                                    <p className="font-semibold">
                                    Subscription Count
                                    </p>
                                    <h3 className="text-4xl font-bold">{allPayments?.count}</h3>
                                    
                                </div>
                               
                               
                            </div>
                            <div className="flex items-center justify-between p-5 gap-5 rounded-md shadow-[0_0_10px_black]">
                                <div className="flex flex-col items-center justify-center">
                                <GiMoneyStack className="text-green-500 text-5xl"/>
                                <p className="font-semibold">
                                    Total Revenue
                                    </p>
                                    <h3 className="text-4xl font-bold">{allPayments?.count*499}</h3>
                                    
                                </div>
                               
                               
                            </div>
                        </div>
                    
                        
                        
                            

                        
                      
                    
                    
                    </div>
                
                </div>
            
                <div className="  mx-[10%] my-10 w-[80%] self-center flex flex-col items-center justify-center gap-10 mb-10">
                    <div className="flex w-full items-center justify-between">
                        <h1 className="text-center font-semibold text-3xl">
                        Courses Overview
                        </h1>
                        <button onClick={()=>navigate("/course/create")}
                        className="w-fit bg-yellow-500 hover:bg-yellow-300 transition-all ease-in-out duration-300 rounded py-2 px-4 font-semibold text-lg cursor-pointer ">
                        Create Course
                        </button>
                    </div>
                    
                    <table className="table overflow-x-scroll text-white">
                        <thead className="text-white">
                            <tr>
                                <th>Sl No</th>
                                <th>Course Title</th>
                                <th>Course Category</th>
                                <th>Instructor</th>
                                <th>Total lectures</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        
                        </thead>
                        <tbody>
                            {myCourses?.map((course,idx)=>{
                                return(
                                    <tr key={course._id}>
                                        <td>{idx+1}</td>
                                        <td>
                                            <textarea readOnly value={course?.title} className="hover:border w-40 h-1uto bg-transparent resize-none"/>
                                        </td>
                                        <td>{course?.category}</td>
                                        <td>{course?.createdBy}</td>
                                        <td>{course?.numbersOfLectures}</td>
                                        <td className="max-w-28 overflow-hidden text-ellipsis whitespace-nowrap">
                                            <textarea value={course?.description} readOnly className="w-80 h-1uto bg-transparent resize-none"/>
                                        </td>
                                        <td className="flex items-center gap-4">
                                            <button
                                                className="bg-green-500 hover:bg-green-300 transition-all ease-in-out text-xl py-2 px-4 rounded-md font-bold"
                                                onClick={()=>navigate("/course/displaylecture",{state:{...course}})}><BsCollectionPlayFill/></button>
                                                <button
                                                className="bg-red-500 hover:bg-red-300 transition-all ease-in-out text-xl py-2 px-4 rounded-md font-bold"
                                                onClick={()=>onCourseDelete(course?._id)}><BsTrash/></button>
                                        </td>
                                    </tr>
                                )
                            })}
                        
                        </tbody>
                    
                    
                    
                    </table>
                
                </div>
            </div>
        </HomeLayout>
    )
}
export default AdminDashboard;