import path from 'path'
import multer from 'multer'
const upload=multer({
    dest:'uploads/', //where file must upload
    limits:{fileSize:500*1024*1024},//max 50 mb
    storage:multer.diskStorage({ //store kaha peh 
        destination:'uploads/',
        filename:(_req,file,cb)=>{
            cb(null,file.originalname);//storing as its original name
        },

    }),
    fileFilter:(_req,file,cb)=>{//filtering what all files are gonna be accepted
        let ext=path.extname(file.originalname);
        if(
            ext !== ".jpg" &&
            ext !== ".jpeg" &&
            ext !== ".webp" &&
            ext !== ".png" &&
            ext !== ".mp4" 
        ){
            cb(new Error("unsupported file type ! ${ext}"),false);
            return;
        }
        cb(null,true);
    },
})
export{ upload};