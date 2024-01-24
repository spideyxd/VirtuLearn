import {Router} from 'express';
import { getAllCourses,getLecturesByCourseId,createCourse,updateCourse, removeCourse,addLectureToCourse,removeLectureFromCourse } from '../controllers/courseControllers.js';
import  {authorizedRoles,isLoggedIn,authorizedSubscriber}  from "../middleware/auth.middleware.js";

import {upload } from "../middleware/multer.middleware.js"
const router=Router();
//router.get('/',getAllCourses);
//alternate way of writing the above
router.route('/').get(getAllCourses)
.post(isLoggedIn,authorizedRoles("ADMIN"),upload.single('thumbnail'),createCourse);//upload thingy for the file upload of thumbnail
 
router.route("/:courseId/lectures/:lectureId")
.delete(isLoggedIn, authorizedRoles('ADMIN'), removeLectureFromCourse);

router.route("/:id").get(isLoggedIn,authorizedSubscriber,getLecturesByCourseId)
.put(isLoggedIn,authorizedRoles("ADMIN"),updateCourse)
.delete(isLoggedIn,authorizedRoles("ADMIN"),removeCourse)//kise route ka andhar agar id is sent then call this 
.post(isLoggedIn,authorizedRoles("ADMIN"),upload.single("thumbnail"),addLectureToCourse)
//assignment:update and delete lectures
//can veiw lectures only if logged in
//to update and delete id of course will be needed na from url

export default router;