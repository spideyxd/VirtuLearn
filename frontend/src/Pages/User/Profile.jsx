import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import HomeLayout from "../../layouts/HomeLayout";
import { Link, useNavigate } from "react-router-dom";
import { cancelCourseBundle } from "../../Redux/Slices/RazorpaySlice";
import { getUserData } from "../../Redux/Slices/AuthSlice";
import toast from "react-hot-toast";

function Profile(){
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const userData=useSelector((state)=>state?.auth?.data);
    async function handleCancellation(){
        toast("initiating cancellation!")
        await dispatch(cancelCourseBundle());
        //once cancelled data will update to get it
        await dispatch(getUserData());
        toast.success("cancellation completed!!");
        navigate("/")

    }
    return(
        <HomeLayout>
            <div className=" bg-gray-800 min-h-[90vh] flex items-center justify-center">
                <div className="w-[70vh] flex flex-col justify-center gap-3 rounded-lg p-4 text-white shadow-[0_0_10px_black] bg-gray-800">
                    <img
                        src={userData?.avatar?.secure_url}
                        className="w-40 m-auto rounded-full border border-yellow-500"/>
                    <h3 className="text-xl font-semibold text-center capitalize">{userData.fullName}
                    </h3>
                    <div className="grid grid-cols-2">
                        <p>Email: </p><p>{userData?.email} </p>
                        
                        <p>Role:</p><p>{userData?.role}</p>
                        
                        <p>Subscription:</p><p>{userData?.subscription?.status=="active"?"active":"inactive"}</p>

                    </div>
                    <div className="flex items-center justify-between gap-2">
                        <Link to="/changepassword" className="w-1/2 mt-2 bg-yellow-600 hover:bg-yellow-400 transition-all ease-in-out duration-300 text-black font-semibold hover:text-blue-950 rounded-md py-1 text-lg cursor-pointer  text-center ">   Change Password</Link>
                        <Link to="/user/editprofile" className="w-1/2 mt-2 bg-yellow-600 hover:bg-yellow-400 transition-all ease-in-out duration-300 text-black font-semibold hover:text-blue-950 rounded-md py-1 text-lg cursor-pointer  text-center ">   Edit Profile</Link>
                    </div>
                    { userData?.subscription?.status=="active" &&(
                        <button onClick={handleCancellation} className="w-full mt-2 bg-red-600 hover:bg-red-400 transition-all ease-in-out duration-300 text-white font-semibold hover:text-blue-100 rounded-md py-1 text-lg cursor-pointer  text-center">
                        Cancel Subscription
                        </button>
                    )}
                </div>
            </div>
        
        
        </HomeLayout>
    )
}
export default Profile;