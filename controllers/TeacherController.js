const Teacher = require("../models/teacherDetailsModel");
const Student = require("../models/studentDetailsModel");
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { sendmail } = require("../middleware/middleware");
const createTeacher_Details = async (req, res) => {
    const newdata = {
        Teacher_id: req.body.teacher_id,
        Name: req.body.Name,
        fatherName: req.body.fatherName,
        motherName: req.body.motherName,
        dob: req.body.dob,
        Address: req.body.Address,
        bloodGroup: req.body.bloodGroup,
        mobile: req.body.mobile,
        picture: req.file.filename ? req.file.filename : ''
    }
    let result = await Teacher.create(newdata);
    res.json({
        succuss: 1,
        url: `http://localhost:4000/picture/'{filename}'`,
        result: result
    })
}


const editTeacherDetails = async (req, res) => {
    try {
        const id = req.params.id
        const newdata = {
            Name: req.body.Name,
            fatherName: req.body.fatherName,
            motherName: req.body.motherName,
            dob: req.body.dob,
            Address: req.body.Address,
            bloodGroup: req.body.bloodGroup,
            mobile: req.body.mobile,
            picture: req.file ? req.file.filename : req.body.picture,
        }
        console.log(req.file ? true : false)
        if (req.file ? true : false) {
            console.log("hello")
            let image = await Teacher.findOne({ _id: Object(id) })
            let url = `/public/upload/${image.picture}`
            const url_path = path.join(process.cwd(), url);
            console.log(url_path)
            if (fs.existsSync(url_path)) fs.unlinkSync(url_path);
        }
        const details = await Teacher.findOneAndUpdate({ _id: Object(id) }, newdata);
        res.send(details)
    } catch (error) {

    }
}
const DeleteTeacherDetails = async (req, res) => {
    try {
        const id = req.params.id
        const details = await Teacher.deleteOne({ _id: Object(id) });
        res.send(details)
    } catch (error) {

    }
}

const getSingle_TeacherDetails = async (req, res) => {
    try {
        const id = req.body.id
        const details = await Teacher.findOne({ teacher_id: id });
        res.send(details)
    } catch (error) {

    }
}
const Addclass = async (req, res) => {
    try {
        let role = req.body.role
        let obj = {
            "class": req.body.class,
            "subject": req.body.subject,
            "role": role
        }

        let push;
        if (role == 'Teacher') {
            push = { $push: { classes: obj } }
        }
        else if (role == 'Class Teacher') {
            push = { $push: { classTeacher: obj } }
        }
        else if (role == 'Both') {
            let classTeacher = {
                "class": req.body.class,
                "subject": req.body.subject,
                "role": 'Class Teacher'
            }
            obj.role = 'Teacher'
            push = { $push: { classTeacher: classTeacher, classes: obj } }
        }
        const id = req.body.teacher
        const details = await Teacher.findOneAndUpdate({ Teacher_id: id }, push);
        res.send(details)
    } catch (error) {

    }
}

const releaseResult = async (req, res) => {
    let id = req.body.student_id
    let result = await Student.findOne({ student_id: id }).then((res) => { return res.result })
    let resultToUpload = req.body.result
    let checkConditon = false;
    resultToUpload.map(async (data) => {
        let push = { $push: { result: data } }
        for (let i = 0; i < result.length; i++) {
            if (result[i].subjectName == data.subjectName && result[i].slot == data.slot && result[i].year == data.year) {
                checkConditon = true
                break;
            }
            else {
                checkConditon = false
            }
        } 
        if (checkConditon) {
            let a = await Student.findOneAndUpdate(
                {
                    student_id: id,
                    "result.subjectName": data.subjectName
                },
                {
                    $set: {
                        "result.$.marks":data.marks 
                    }
                }

            );
            // res.json("updated succefully")
        }
        else {
            const updateResult = await Student.updateOne({ student_id: id }, push);
            res.json(updateResult)
        }
    })

}

const allTeacher = async (req, res) => {
    let data = await Teacher.find()
    res.json(data)
}

const allTeacherImage = async (req, res) => {
    let data = await Teacher.find({}, { picture: 1, classes: 1, Name: 1 })
    res.json(data)
}
module.exports = {
    createTeacher_Details,
    editTeacherDetails,
    getSingle_TeacherDetails,
    DeleteTeacherDetails,
    Addclass,
    releaseResult,
    allTeacher,
    allTeacherImage
}