const multer = require("multer")
const path = require('path')
const jwt = require('jsonwebtoken')
const nodemailer=require('nodemailer');
require('dotenv').config();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/upload')
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }

}
)

// const filefilter=(req,file,cb)=>{
//     if(file.mimetype==='image/jpeg' ||file.mimetype==='image/jpg' ||file.mimetype==='image/png'){
//         cb(null,true)
//     }
//     else{
//         cb(null,false)
//     }
// }

var upload = multer({ storage: storage, }).fields([{ name: 'picture' }, { name: 'fatherImg' }, { name: 'motherImg' }]);
var uploadSingle = multer({ storage: storage }).single('picture');

const tokenvalidation = (req, resp, next) => {
    const token = req.headers['authorization'].split(" ")[1];
    const valid = jwt.verify(token, process.env.JWT_SECRET)
    if (valid) {
        next();
    }
    else {
        return resp.status(401).send({ msg: "unauthorized token expiresd", status: 0 })
    }

}
const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:"1d",
    })

};


const sendmail=async(name,email,randomstring,db)=>{
    try {
        console.log(process.env.email)
        console.log(process.env.NODEPORT)
        console.log(process.env.password)
        console.log(process.env.NODEPORT)
        const transport=nodemailer.createTransport({
         service:'gmail',
         host:process.env.NODEHOST,
         port:587,
            secure:true,
            requireTLS:true,
            auth:{
                user:process.env.email,
                pass:process.env.password
            }})
            const mailoption={
                from:'hellopubg2925@gmail.com',
                to:email,
                subject:"Click On link for password reset",
                html:`<p>Hi ${name} Please reset your password <a href="${process.env.URL}/auth/reset-password?string=${randomstring}&db=${db}">reset your password </a></p>`
            }

           await transport.sendMail(mailoption,(error,info)=>{
           if(error){
            console.log(error+"error")
           }
           else{
            console.log('mail send :' + info.response)
           }
           })
    } catch (error) {
        console.log(error)
    }
}


const emailValidation=function(emailString)
{
    return String(emailString)
    .toLowerCase()
    .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
}
module.exports = {
    Upload: upload,
    UploadSingle:uploadSingle,
    tokenvalidation: tokenvalidation,
    sendmail,
    generateToken

}