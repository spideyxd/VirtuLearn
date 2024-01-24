//payment related information in db
import mongoose from "mongoose"
const paymentSchema=new mongoose.Schema({
    razorpay_payment_id :{
        type:String,
        rrquired:true,
    },
    razorpay_subscription_id:{
        type:String,
        required:true,
    },
    razorpay_signature:{//used to verify
        type:String,
        required:true,
    } 
},{timestamps:true});
export default mongoose.model("Payment",paymentSchema);