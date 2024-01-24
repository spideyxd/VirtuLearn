import { RxCrossCircled } from "react-icons/rx";
import HomeLayout from "../../layouts/HomeLayout";
import { Link } from "react-router-dom";

function CheckoutFail(){
return(
    <HomeLayout>
        <div className=" bg-gray-800 min-h-[90vh] flex items-center justify-center text-white">
            <div className="bg-gray-800 w-80 h-[26rem] flex flex-col justify-center items-center shadow-[0_0_10px_black] rounded-lg relative">
                <h1 className="bg-red-500 text-center absolute top-0 w-full py-4 text-2xl font-bold rounded-tl-lg rounded-tr-lg">
                Payment  Not SuccessFul
                </h1>
                <div className="px-4 flex flex-col items-center justify-center space-y-2">
                    <div className="text-center space-y-2">
                        <h2 className="font-semibold text-lg">
                        Failed to purchase the pro bundle
                        </h2>
                        <p className="text-left">
                        Please try again later to  enjoy all courses
                        </p>
                    </div>
                    <RxCrossCircled className="text-green-500 text-5xl"></RxCrossCircled>
                </div>
                <Link to="/" className="bg-red-500 hover:bg-red-400 transition-all ease-in-out duration-300 absolute bottom-0 w-full py-2 text-xl font-bold text-center rounded-md">
                    <button>
                    Go to dashboard
                    </button>
                </Link>
            </div>
        
        
        </div>
    
    
    
    </HomeLayout>
)
}
export default CheckoutFail;