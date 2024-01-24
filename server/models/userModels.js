import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import JWT from "jsonwebtoken"
import crypto from 'crypto'
//defining the data model within databse or structure
const userSchema=new mongoose.Schema({
    fullName:{
        type:String,
        required:[true,"user name is required"],
        maxLength:[50,"name must be less than 50 character"],
        trim: true, //start and end spaces gone
        lowercase:true
    },
    email:{
        type:String,
        required:[true,"user email is required"],
        unique:[true,"already registered"],
        lowercase:true,//storing data as lowercase
        maxLength:[50,"name must be less than 50 character"],
    },
    password:{
        type:String,
        required:[true,"password needed"],
        minLength:[8,"password atleast 8 character"],
        select:false//means that while printing user info unless specifically mentioned like select(password) password wont be displayed for security
    },
    avatar:{
        public_id:{
            type:String
        },
        secure_url:{
            type:String
        }
    },
    role:{//need to login as user or admin
        type:String,
        enum:['USER','ADMIN'],
        default:'USER'
    },
    forgotPasswordToken:{
        type:String,
    },
    forgetPasswordExpiryDate:{
        type:Date,
    },
    subscription:{
        id:String,
        status:String,
    }},
    {timestamps:true//each entry must have a timestamp 
    
});

//this is used to encrypt or hash password before saving or pre saving to database
userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next();
    }//if no change in password then just move to next
    this.password=await bcrypt.hash(this.password,10);//an encrypted 10 digit form is made and assigned to this.password
    return next();
})
userSchema.methods={
    generateJWTToken(){
        return JWT.sign({
            id:this._id,
            email:this.email,
            subscription:this.subscription,
            role:this.role
            
        },//content of token is this
        process.env.JWT_SECRET,//secret key
        {expiresIn:process.env.JWT_EXPIRY}//for security dont keep permanent tokens
        )
    },
    generatePasswordResetToken(){
        const resetToken=crypto.randomBytes(20).toString('hex');//used to generate a token randomly 20 bytes converted to hex string
        
        //ooper we have mentioned these 2 in the schema
        this.forgotPasswordToken=crypto.createHash('sha256')//using crypto to encrypt
                                    .update(resetToken)
                                    .digest('hex');
        this.forgetPasswordExpiryDate=Date.now()+15*60*1000;//15 min converted to miliseconds
        //token valid for 15 min only
        return resetToken

    }
}
export default mongoose.model("User",userSchema)
