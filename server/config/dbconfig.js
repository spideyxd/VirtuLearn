import mongoose from 'mongoose';
mongoose.set('strictQuery',false)
//sets a config to mongoose such that it doesnt give error if we send something wrong way

const connecttodb=async()=>{
    mongoose.connect(process.env.MONGO_URL)
    .then((conn)=>{
        console.log("connected to db:",conn.connection.host);
    })
    .catch((err)=>{
        console.log(err.message);
        process.exit();//if db only doesnt connect then nothing must happen

    })
};
export default connecttodb;