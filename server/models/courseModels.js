import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import JWT from "jsonwebtoken"
import crypto from 'crypto'
//defining the data model within databse or structure
//this is the page which holds list of courses
//each course ka model is defined here ie what model ke aadhar par courses stored in db
//title of course,thumbnail,number of lectures etc

const courseSchema=new mongoose.Schema({
    title:{
        type:String,
        required:[true,"title is needed"],
        maxlength:[50,"title can be max 50 characters"],
        trim:true,

    },
    description:{
        type:String,
        required:[true,"description is needed"],
        maxlength:[200,"description can be max 200 characters"],
        trim:true,
    },
    category:{
        type:String,
        required:[true,"category is needed"],
    },
    thumbnail:{//course ka thumbnail needed
        public_id:{
            type:String,
           
        },
        secure_url:{
            type:String,
            
        }
    },
    lectures:[//list of lectures
        //now defining structure of individual lectures
        {
            title:{
                type:String,
                required:[true,"title is needed"],
            },
            description:{
                type:String,
                required:[true,"description is needed"],
            },
            thumbnail:{//each lecture has a thumbnail
                public_id:{
                    type:String,
                    required:true,
                },
                secure_url:{
                    type:String,
                    required:true,
                }
            }

        }

    ],
    numbersOfLectures:{
        type:Number,
        default:0,//if no lectures then 0 must be shown na


    },
    createdBy:{
        type:String,
        required:true,
    }


      
},{
timestamp:true
});
export default mongoose.model("Course",courseSchema)//this creates separate section in the db with heading courses