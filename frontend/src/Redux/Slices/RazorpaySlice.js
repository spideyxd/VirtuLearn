import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import toast from "react-hot-toast"
import axiosInstance from "../../helpers/axiosInstance"

const initialState={
    key:"",
    subscription_id:"",
    isPaymentVerified:false,
    allPayments:{},
    finalMonths:{},
    monthlySalesRecord:[]
}
export const getRazorpayId=createAsyncThunk("/razorpay/get",async()=>{
    try{
        const response=await axiosInstance.get("/payment/razorpay-key");
        return response.data;
    }
    catch(error){
        toast.error("failed to load data")
    }
})
export const purchaseCourseBundle=createAsyncThunk("/purchaseCourse",async()=>{
    try{
        const response=await axiosInstance.post("/payment/subscribe");

        return response.data;
    }
    catch(error){
        toast.error(error?.response?.data?.message)
    }
});
export const verifyUserPayment=createAsyncThunk("/payment/verify",async(data)=>{
    try{
        const response=await axiosInstance.post("/payment/verify",{
            razorpay_payment_id:data.razorpay_payment_id,
            razorpay_subscription_id:data.razorpay_subscription_id,
            razorpay_signature:data.razorpay_signature
        });
        return response?.data;
    }
    catch(error){
        toast.error(error?.response?.data?.message)
    }
})
export const getPaymentRecord=createAsyncThunk("/payment/record",async()=>{
    try{
        const response=await axiosInstance.get("/payment/count/100/skip/0");
        return (await response).data;
    }
    catch(error){
        toast.error("operation failed")
    }
})
export const cancelCourseBundle=createAsyncThunk("/payment/cancel",async()=>{
    try{
        const response=await axiosInstance.post("/payment/unsubscribe");
        
        return (await response).data;
    }
    catch(error){
        toast.error(error?.response?.data?.message)
    }
})

const RazorpaySlice=createSlice({
    name:"razorpay",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(getRazorpayId.fulfilled,(state,action)=>{
            state.key=action?.payload?.key;
        })
        .addCase(getRazorpayId.rejected,(state,action)=>{
            toast.error("failed to get razorpay key");
        })
        .addCase(purchaseCourseBundle.fulfilled,(state,action)=>{
            state.subscription_id=action?.payload?.subscription_id;
        })
        .addCase(verifyUserPayment.fulfilled,(state,action)=>{
            toast.success(action?.payload?.success)
            state.isPaymentVerified=action?.payload?.success;
        })
        .addCase(verifyUserPayment.rejected,(state,action)=>{
            toast.success(action?.payload?.success)
            state.isPaymentVerified=action?.payload?.success;
        })
        .addCase(getPaymentRecord.fulfilled,(state,action)=>{
            state.allPayments=action?.payload?.allPayments;
            state.finalMonths=action?.payload?.finalMonths;
            state.monthlySalesRecord=action?.payload?.monthlySalesRecord;
        })
        


    }
})
export default RazorpaySlice.reducer;