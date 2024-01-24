import config from 'dotenv'
config.config();
import express from 'express';
const app=express();
import cors from 'cors'
//import connecttodb from './config/dbconfig.js';
//connecttodb();
//above lines are put in server.js in some other way...u dont want server to run on port if db only doesnt connect //alternate
import userRoutes from './routes/userroutes.js';
import courseRoutes from './routes/courseroutes.js'
import errorMiddleware from './middleware/error.middleware.js';
import paymentRoutes from './routes/paymentroutes.js'
import miscRoutes from './routes/miscellaneousroutes.js';

import cookieParser from 'cookie-parser';
import morgan from 'morgan';

app.use(express.json());//allowing json data to be sent
app.use(express.urlencoded({extended:true}))//allowing shit in url also to be sent
app.use(cors({//cors means cross origin resourse sharing
    origin:[process.env.FRONTEND_URL],//allowed localhost:3000 client the access
    credentials:true
}))
app.use(cookieParser());
app.use(morgan('dev'))//for log management
//all accesses will display on the console

app.use('/ping',(req,res)=>{//just to check if server running
    res.status(200).json({data:'JWTauth server hi pong'});
});
//routes of 3 modules
app.use('/api/v1/user',userRoutes);
app.use('/api/v1/courses',courseRoutes);
app.use("/api/v1/payment",paymentRoutes)
app.use('/api/v1', miscRoutes);


//if user hits some wierd url
app.all('*',(req,res)=>{
    res.status(404).send('OOPS!!! 404 page not found');

})
//generic error handler
app.use(errorMiddleware);//errorMiddleware will be a error object as it comes from next 
export default app;