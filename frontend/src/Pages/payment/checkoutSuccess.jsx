import { AiFillCheckCircle } from "react-icons/ai";
import HomeLayout from "../../layouts/HomeLayout";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useDebugValue, useEffect } from "react";
import { getUserData } from "../../Redux/Slices/AuthSlice";

function CheckoutSuccess(){
    const dispatch=useDispatch();
    useEffect(()=>{
        dispatch(getUserData());
    })//this is done as soon as successpage is loaded
    //basically we have changed the subscription stutus to active na so that must be updated in the state and localstorage as well so we do
    //getuserdata so that it updates its there  in addcase

return(
    <HomeLayout>
        <div className=" bg-gray-800 min-h-[90vh] flex items-center justify-center text-white">
            <div className="bg-gray-800 w-80 h-[26rem] flex flex-col justify-center items-center shadow-[0_0_10px_black] rounded-lg relative">
                <h1 className="bg-green-500 text-center absolute top-0 w-full py-4 text-2xl font-bold rounded-tl-lg rounded-tr-lg">
                Payment SuccessFul
                </h1>
                <div className="px-4 flex flex-col items-center justify-center space-y-2">
                    <div className="text-center space-y-2">
                        <h2 className="font-semibold text-lg">
                        Welcome to the pro bundle
                        </h2>
                        <p className="text-left">
                        Now you can enjoy all courses
                        </p>
                    </div>
                    <AiFillCheckCircle className="text-green-500 text-5xl"></AiFillCheckCircle>
                </div>
                <Link to="/" className="bg-green-500 hover:bg-green-400 transition-all ease-in-out duration-300 absolute bottom-0 w-full py-2 text-xl font-bold text-center rounded-md">
                    <button>
                    Go to dashboard
                    </button>
                </Link>
            </div>
        
        
        </div>
    
    
    
    </HomeLayout>
)
}
export default CheckoutSuccess;