import asyncHandler from "../middleware/asyncHandler.middleware.js";
import Course from "../models/courseModels.js"
import AppError from '../utils/error.util.js';
import cloudinary from 'cloudinary'
import fs from 'fs/promises'
const getAllCourses=async (req,res,next)=>{
    try{
    const courses=await Course.find({}).select('-lectures');
    //all courses are obtained but their lecture list is not obtained
    res.status(200).json({
        success:true,
        message:"all courses obtained",
        courses:courses
    });}
    catch(error){
        return next(new AppError(error.message,400));

    }

};
const getLecturesByCourseId=async(req,res,next)=>{
    try{
        const {id}=req.params;
        const course=await Course.findById(id);
        if(!course){
            return next(new AppError("invalid course id",400));
        }
        res.status(200).json({
            success:true,
            message:"courses lectures are fetched",
            lectures:course.lectures
        })

    }
    catch(error){
        return next(new AppError(error.message,400));
    }

};

const createCourse=async(req,res,next)=>{
    //title,description,category,thumbnail,who is creating
    //form data posting cus of thumbnail
    const {title,description,category,createdBy}=req.body;
    if(!title || !description||!category||!createdBy){
        return next(new AppError("all fields are mandatory",400));
    }
    const course=await Course.create({//course model na model name used
        title,
        description,
        category,
        createdBy,
        thumbnail:{
            public_id:title,
            secure_url:'https://res.cloudinary.com/du9jzqlpt/image/upload/v16747316/avatar_user'
        }

    });
    if(!course){
        return next(new AppError("couse could not be created",400));
    }
    if(req.file){
        try{
            const result=await cloudinary.v2.uploader.upload(req.file.path,{//arguments path to upload and configuration
                folder:'lms',
                width: 250,
                height:250,//the cloudinary image will be cropped 
                gravity:"faces",
                crop:'fill'
            });
            if(result){
                course.thumbnail.public_id=result.public_id;
                course.thumbnail.secure_url=result.secure_url;
                //remove file from uploads folder na
                fs.rm(`uploads/${req.file.filename}`);
            }
            
            

        }
        catch(error){
            new AppError(error || "file not uploaded please try again",500);

        }
    }
    await course.save();
    res.status(200).json({
        success:true,
        message:"successfully created course",
        course
    })


};
const updateCourse=async(req,res,next)=>{
    try{
        const {id}=req.params;
        const course=await Course.findByIdAndUpdate(
            id,
            {
                $set:req.body//new way of updating
                //whatver is given in body to ovveride it goes on updating and overriding in course
                //if u wanna update thumbnail u can enter in form data or raw data if thumbnail beda

            },
            {
                runValidators:true//checks if new data is right or wrong

            }

        );
        if(!course){
            return next(new AppError("couse with given id doesnt exist",400));
        }
        res.status(200).json({
            success:true,
            message:"updated sucessfully",
            course
        })

    }
    catch(error){
        return next(new AppError(error.message,400));
    }

};
const removeCourse=async(req,res,next)=>{
    try{
        const {id}=req.params;
        const course=await Course.findById(id);
        if(!course){
            return next(new AppError("no such course",400));
    }
        await Course.findByIdAndDelete(id);
        res.status(200).json({
            success:true,
            message:"course deleted"
        })

        }

    
    catch(error){
        return next(new AppError(error.message,400));
    }

};
const addLectureToCourse=asyncHandler(async(req,res,next)=>{
    try{
    const{title,description}=req.body;
    const {id}=req.params;
    const course=await Course.findById(id);
    if(!title||!description){
        return next(new AppError("all fields mandatory",400));
    }
    if(!course){
        return next(new AppError("no such course",400));
        
    }
    const lectureData={}

    
    if(req.file){
        try{
            const result=await cloudinary.v2.uploader.upload(req.file.path,{//arguments path to upload and configuration
                folder:'lms',
                chunk_size:50000000,
                resource_type:"video"
            });
            if(result){
                lectureData.public_id=result.public_id; //like this if mentioned lecture data meh public id key will be added
                lectureData.secure_url=result.secure_url;
                //remove file from uploads folder na
                fs.rm(`uploads/${req.file.filename}`);
            }
            
            

        }
        catch(error){
            new AppError(error || "file not uploaded please try again",500);

        }
    }
    course.lectures.push({
        title,
        description,
        thumbnail:lectureData,
    });
    //gotta update number} of lectures
    course.numbersOfLectures=course.lectures.length;
    await course.save();
    res.status(200).json({
        success:true,
        message:"sucessfully added lecture"
    })}
    catch(error){
        return next(new AppError(error.message,400));
    }

})
const removeLectureFromCourse=asyncHandler(
    async (req, res, next) => {
        // Grabbing the courseId and lectureId from req.query
        const { courseId, lectureId } = req.params;
      
        console.log(courseId);
      
        // Checking if both courseId and lectureId are present
        if (!courseId) {
          return next(new AppError('Course ID is required', 400));
        }
      
        if (!lectureId) {
          return next(new AppError('Lecture ID is required', 400));
        }
      
        // Find the course uding the courseId
        const course = await Course.findById(courseId);
      
        // If no course send custom message
        if (!course) {
          return next(new AppError('Invalid ID or Course does not exist.', 404));
        }
      
        // Find the index of the lecture using the lectureId as lectures array meh we gotta know which index to delete
        const lectureIndex = course.lectures.findIndex(
          (lecture) => lecture._id.toString() === lectureId.toString()
        );
      
        // If returned index is -1 then send error as mentioned below
        if (lectureIndex === -1) {
          return next(new AppError('Lecture does not exist.', 404));
        }
      
        // Delete the lecture from cloudinary
        await cloudinary.v2.uploader.destroy(
          course.lectures[lectureIndex].thumbnail.public_id,
          {
            resource_type: 'video',
          }
        );
      
        // Remove the lecture from the array
        course.lectures.splice(lectureIndex, 1);
      
        // update the number of lectures based on lectres array length
        course.numbersOfLectures = course.lectures.length;
      
        // Save the course object
        await course.save();
      
        // Return response
        res.status(200).json({
          success: true,
          message: 'Course lecture removed successfully',
        });
      });

export{
    getAllCourses,
    getLecturesByCourseId,
    createCourse,
    updateCourse,
    removeCourse,
    addLectureToCourse,
    removeLectureFromCourse
}