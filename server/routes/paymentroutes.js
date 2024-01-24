import express from "express";
import {getRazorpayApiKey,buySubscription,verifySubscription,cancelSubscription,allPayments} from "../controllers/paymentControllers.js"
const router=express.Router();
import { isLoggedIn,authorizedRoles, authorizedSubscriber} from "../middleware/auth.middleware.js";
router
    .route("/razorpay-key")
    .get(isLoggedIn,getRazorpayApiKey);
router
    .route("/subscribe")
    .post(isLoggedIn,buySubscription);
router
    .route("/verify")
    .post(isLoggedIn,verifySubscription);
router 
    .route("/unsubscribe")
    .post(isLoggedIn,authorizedSubscriber,cancelSubscription);
//routes for admin
router//only admin can see all the payments made by users
    .route("/count/:count/skip/:skip")
    .get(isLoggedIn,authorizedRoles("ADMIN"),allPayments);

export default router;