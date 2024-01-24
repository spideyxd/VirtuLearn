import React,{ useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getRazorpayId, purchaseCourseBundle, verifyUserPayment } from "../../Redux/Slices/RazorpaySlice";
import {toast} from "react-hot-toast";
import HomeLayout from "../../layouts/HomeLayout";
import {BiRupee} from "react-icons/bi"

function Checkout(){
    const dispatch=useDispatch();
    const navigate=useNavigate();
   
    
    const razorpayKey=useSelector((state)=>state?.razorpay?.key);
    const subscription_id=useSelector((state)=>state?.razorpay?.subscription_id);
    const userData=useSelector((state)=>state?.auth?.data)
    const isPaymentVerified=useSelector((state)=>state?.razorpay?.isPaymentVerified)
    const paymentDetails={
        razorpay_payment_id:"",
        razorpay_subscription_id:"",
        razorpay_signature:""
    }
    async function handleSubscription(e){
        e.preventDefault();
        if(!razorpayKey||!subscription_id){
            toast.error("something went wrong");
            return;
        }
        const options={//passed to razorpay to process
            key:razorpayKey,
            subscription_id:subscription_id,
            name:"Coursify Pvt. Ltd",
            description:"Subscription",
            theme:{//razorpay pop ups theme
                color:"#F37254"
            },
            prefill:{
                email:userData.email,
                name:userData.fullName
            },
            handler:async function (response){//razorpay seh response object milega//once payment done this handler excecutes
                
                paymentDetails.razorpay_payment_id=response.razorpay_payment_id;
                paymentDetails.razorpay_signature=response.razorpay_signature;
                paymentDetails.razorpay_subscription_id=response.razorpay_subscription_id;
                toast.success("payment successful");
                const res=await dispatch(verifyUserPayment(paymentDetails));//checking in backend if verified
                
                res?.payload?.success ?navigate("/checkout/success"):navigate("/checkout/failed");
            }
        }
        const paymentObject=new window.Razorpay(options);
        paymentObject.open()
    }
    
    
    //when component is used some data has to load
    async function load(){
        await dispatch(getRazorpayId());//addcase will put the id in the state itself
        await dispatch(purchaseCourseBundle());
        
    }
    useEffect(()=>{
        load();
    },[])

    
    return(
        <HomeLayout>
        <div className="flex items-center justify-center h-[90vh] bg-gray-800">
        <form noValidate onSubmit={handleSubscription} className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black] bg-gray-800">
            <h1 className="text-center text-2xl font-bold">Subscription Bundle</h1>
           
            <div className="px-4 space-y-5 text-center">
                <p className="text-[17px]">
                This purchase will allow u to access all available course of our platform for {" "}
                <span className="text-yellow-500 font-bold">
                    
                1 Year duration
                </span>
                All the existing and new launched courses will also be available
                
                </p>
                <p className="flex items-center justify-center gap-1 text-2xl font-bold text-yellow-500">
                    <BiRupee/><span>499</span> only
                </p>
                <div className="text-gray-200">
                    <p>100% refund on cancellation</p>
                    <p>*terms and conditions applied*</p>
                </div>
                <button type="submit" className=" rounded-sm py-2 font-semibold text-lg cursor-pointer w-full bg-yellow-600 hover:bg-yellow-400 transition-all ease-in-out duration-300">
                Buy now
                </button>
            
            </div>
           
            </form>
    </div>
    </HomeLayout>
    );
}
export default Checkout;