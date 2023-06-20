const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const authRoutes = require("./routes/authRoute");
const studentRoute = require("./routes/StudentRoute");
const teacherRoute = require("./routes/TeacherRoute");
const resultRoute = require("./routes/resultRoute");
const path =require('path')
require("dotenv").config();
app.use('/picture',express.static(path.join(__dirname, 'public/upload')));
app.use(cors());
app.use(express.json());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Content-Security-Policy-Report-Only', "default-src 'self'; script-src 'self'; style-src 'self'; font-src 'self'; img-src 'self'; frame-src 'self'")
    next();
});
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("db is connected")
}).catch((err)=>{
console.log(err)
})

app.use("/api/auth", authRoutes);
app.use("/api/student",studentRoute)
app.use("/api/teacher",teacherRoute)
app.use("/api/result",resultRoute)
const server = app.listen(process.env.PORT,()=>{
    console.log(`server is on ${process.env.PORT}`)
})


