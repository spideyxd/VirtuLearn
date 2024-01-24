import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HomeLayout from "../../layouts/HomeLayout";
import { useSelector } from "react-redux";

function CourseDescription(){
    const locator=useLocation();
    const Navigate=useNavigate();
    
    const {role,data}=useSelector((state)=>state.auth);
    const isVerified=useSelector((state)=>state.razorpay.isPaymentVerified);
    return(
        <HomeLayout>
            <div className="min-h-[90vh] pt-12 px-20 flex flex-col items-center justify-center text-white">
                <div className="grid grid-cols-2 gap-10 py-10 relative ">
                    <div className="space-y-5">
                        <img src={locator.state?.thumbnail?.secure_url} alt="thumbnail" className="w-full h-64"/>
                        <div className="space-y-4">
                            <div className="flex flex-col items-center justify-between text-xl">
                                <p className="font-semibold">
                                    <span className="text-yellow-500 font-bold">
                                        Total lectures is :{" "}
                                    </span>
                                    
                                    {locator.state?.numbersOfLectures}
                                    
                                </p>
                                
                                <p className="font-semibold">
                                <span className="text-yellow-500 font-bold">
                                    
                                Instructor is  :{" "}
                                </span>
                                {locator.state?.createdBy}
                            </p>
                        
                            </div>
                            {
                                role=="ADMIN" ||  data?.subscription?.status=="active" ?(
                                    <button onClick={()=>Navigate("/course/displaylecture",{state:{...locator.state}})} className="bg-yellow-600 text-xl rounded-md font-bold px-5 py-3 w-full hover:bg-yellow-400 transition-all ease-in-out duration-300">
                                        watch lectures
                                    
                                    </button>
                                ):(
                                    <button onClick={()=>Navigate("/checkout")} className="bg-yellow-600 text-xl rounded-md font-bold px-5 py-3 w-full hover:bg-yellow-400 transition-all ease-in-out duration-300">
                                        subscribe
                                    </button>
                                )
                            }

                    
                        
                        
                        </div>
                        </div>
                        <div className="space-y-2 text-xl">
                            <h1 className="text-3xl font-bold text-yellow-500 text-center">{locator?.state?.title}</h1>
                            <p className="text-yellow-500">Course description:
                            </p>
                            <p>{locator?.state?.description}</p>
                        </div>
                    </div>
                
                </div>
            
            
            
        
        
        
        
        </HomeLayout>



    )

}
export default CourseDescription;