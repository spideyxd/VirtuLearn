import Payment from "../models/paymentModels.js"
import AppError from '../utils/error.util.js';
import User from '../models/userModels.js' 
import crypto from "crypto"
import {razorpay} from "../server.js"
import asyncHandler from "../middleware/asyncHandler.middleware.js";
const getRazorpayApiKey=asyncHandler(async(req,res,next)=>{
    try{
    res.status(200).json({
        success:true,
        message:"razarpay Api Key",
        key:process.env.RAZORPAY_KEY_ID
    });}
    catch(error){
        return next(new AppError(error.message,400));
    }

});
const buySubscription=asyncHandler(async(req,res,next)=>{
    //verification that user exists
    try{
    const{id}=req.user;
    const user=await User.findById(id);
    if(!user){
        return next(new AppError("unauthorised please login",400));
    }
    if(user.role==="ADMIN"){
        return next(new AppError("Admin cannot purchase a subscription",400));
    }
    //gotta create a subscription in razorpay
    const subscription=await razorpay.subscriptions.create({
        plan_id:process.env.RAZORPAY_PLAN_ID,
        customer_notify:1,
        total_count:12,
    });
    user.subscription.id=subscription.id;
    user.subscription.status=subscription.status;
    await user.save();
    res.status(200).json({
        success:true,
        message:"subscribed successfully",
        subscription_id:subscription.id,})
    //this will generate a subscription id in razorpay and once u pay status be set to active
    //after status set to active we gotta verify it
    //data u get after subscription
    //->razorpay ka payment id -> razorpay signature ->subscription id
    //this is used to verify
    }
    catch(error){
        return next(new AppError(error.message,400));
    }
});
const verifySubscription=asyncHandler(async(req,res,next)=>{
    try{
    const{id}=req.user;//user related
    const{razorpay_payment_id,razorpay_signature,razorpay_subscription_id}=req.body;
    const user=await User.findById(id);
    if(!user){
        return next(new AppError("unauthorised please login",400));

    }
    const subscriptionId=user.subscription.id;
    //signature obtained is compared to the signature made by us using the secret key
    const generatedSignature=crypto
        .createHmac('sha256',process.env.RAZORPAY_SECRET)
        .update(`${razorpay_payment_id}|${subscriptionId}`)
        .digest('hex');
    if(generatedSignature!==razorpay_signature){
        return next(new AppError("payment not verified please try again",400));
    }
    //if verified//add entry to payment wala db
    await Payment.create({
        razorpay_payment_id,
        razorpay_signature,
        razorpay_subscription_id,
    });
    //user level peh we need to activate the status 
    user.subscription.status="active";
    await user.save()
    res.status(200).json({
        success:true,
        message:"payment verified successfully"
    })}
    catch(error){
        return next(new AppError(error.message,400));
    }


});
const cancelSubscription = asyncHandler(async (req, res, next) => {
    try{
  const { id } = req.user;
  
    // Finding the user
    const user = await User.findById(id);
  
    // Checking the user role
    if (user.role === 'ADMIN') {
      return next(
        new AppError('Admin does not need to cannot cancel subscription', 400)
      );
    }
  
    // Finding subscription ID from subscription
    const subscriptionId = user.subscription.id;
  
    // Creating a subscription using razorpay that we imported from the server
    
      const subscription = await razorpay.subscriptions.cancel(
        subscriptionId // subscription id
      );
  
      // Adding the subscription status to the user account
      user.subscription.status = subscription.status;
  
      // Saving the user object
      await user.save();
    
  
    // Finding the payment using the subscription ID
    const payment = await Payment.findOne({
      razorpay_subscription_id: subscriptionId,
    });
    
  
  
    
  
    // If refund period is valid then refund the full amount that the user has paid
    await razorpay.payments.refund(payment.razorpay_payment_id, {
      speed: 'optimum', // This is required
    });
  
    user.subscription.id = undefined; // Remove the subscription ID from user DB
    user.subscription.status = undefined; // Change the subscription Status in user DB
  
    await user.save();
    
    await payment.deleteOne();
   
    // Send the response
    res.status(200).json({
      success: true,
      message: 'Subscription canceled successfully',
    });}
    catch (error) {
      // Returning error if any, and this error is from razorpay so we have statusCode and message built in
      return next(new AppError(error.description, error.statusCode));
    }
  });
const allPayments=asyncHandler(async(req,res,next)=>{
    const {count,skip}=req.params;//kitna records u wanna see
    const allPayments=await razorpay.subscriptions.all({
        count:count ||10,
        skip:skip?skip:0
    })
    
    //from payment database assignment
    //we can use the data to find out monthly transactions etc and create a report
    
    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
    
      const finalMonths = {
        January: 0,
        February: 0,
        March: 0,
        April: 0,
        May: 0,
        June: 0,
        July: 0,
        August: 0,
        September: 0,
        October: 0,
        November: 0,
        December: 0,
      };
    
      const monthlyWisePayments = allPayments.items.map((payment) => {
        // We are using payment.start_at which is in unix time, so we are converting it to Human readable format using Date()
        const monthsInNumbers = new Date(payment.start_at * 1000);
    
        return monthNames[monthsInNumbers.getMonth()];
      });
    
      monthlyWisePayments.map((month) => {
        Object.keys(finalMonths).forEach((objMonth) => {
          if (month === objMonth) {
            finalMonths[month] += 1;
          }
        });
      });
    
      const monthlySalesRecord = [];
    
      Object.keys(finalMonths).forEach((monthName) => {
        monthlySalesRecord.push(finalMonths[monthName]);
      });
    
      res.status(200).json({
        success: true,
        message: 'All payments',
        allPayments,
        finalMonths,
        monthlySalesRecord,
      });

});
export{
    getRazorpayApiKey,
    buySubscription,
    verifySubscription,
    cancelSubscription,
    allPayments
}