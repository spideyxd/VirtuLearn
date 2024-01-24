import nodemailer from "nodemailer";
const sendEmail=async function(email,subject,message){
    try{
        
    //create reusable transporter object using the SMTP transport
    let transporter=nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port:process.env.SMTP_PORT,
        secure:false,//true for current port false for all others
        auth:{
            user:process.env.SMTP_USERNAME,
            pass:process.env.SMTP_PASSWORD,
        },
        tls: {
            ciphers:'SSLv3'
        }
    });
    //send mail with defined trasport object
    await transporter.sendMail({
        from:process.env.SMTP_FROM_EMAIL,//sender email
        to:email,
        
        subject:subject,
        html:message,//html body
        });}
        catch(error){
            console.log(error);
        }
};
export default sendEmail;

//if any issues with mail backend go to vdo
//10th july vid 3 around 40 min 