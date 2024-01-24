const errorMiddleware=(err,req,res,next)=>{//the error object is stored in err and it has variables statuscode and message
    //incase statuscode and message not given
    err.statusCode=err.statusCode||500;
    err.message=err.message||"something went wrong"
    
    
    return res.status(err.statusCode).json({
        success:false,
        message:err.message,
        stack:err.stack
    })
}
export default errorMiddleware