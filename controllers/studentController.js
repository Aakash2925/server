
const Student = require("../models/studentDetailsModel");
const studentTimetable = require("../models/StudentTimeTableModel")
const fs = require("fs")
const path = require('path');
const createStudentDetails = async (req, res) => {
    const newdata = {
        student_id: req.body.student_id,
        Name: req.body.Name,
        fatherName: req.body.fatherName,
        motherName: req.body.motherName,
        dob: req.body.dob,
        Address: req.body.Address,
        bloodGroup: req.body.bloodGroup,
        class: req.body.class,
        section: req.body.section,
        mobile: req.body.mobile,
        picture: req.files.picture ? req.files.picture[0].filename : '',
        fatherImg: req.files.fatherImg ? req.files.fatherImg[0].filename : "",
        motherImg: req.files.motherImg ? req.files.motherImg[0].filename : ""

    }
    let result = await Student.create(newdata);
    res.json({
        succuss: 1,
        url: `http://localhost:4000/picture/'{filename}'`,
        result: result
    })
}

const getStudent = async (req, res) => {
    try {
        const { section, cls } = req.body;
        const details = await Student.find({ class: cls, section: section });
        res.send(details)
    } catch (error) {

    }
}

const editStudentDetails = async (req, res) => {
    try {
        const id = req.params.id
        const newdata = {
            Name: req.body.Name,
            fatherName: req.body.fatherName,
            motherName: req.body.motherName,
            dob: req.body.dob,
            Address: req.body.Address,
            bloodGroup: req.body.bloodGroup,
            class: req.body.class,
            section: req.body.section,
            mobile: req.body.mobile,
            picture: req.files.picture ? req.files.picture[0].filename : req.body.picture,
            fatherImg: req.files.fatherImg ? req.files.fatherImg[0].filename : req.body.fatherImg,
            motherImg: req.files.motherImg ? req.files.motherImg[0].filename : req.body.motherImg
        }
        if (req.files.picture ? true : false) {
            let image = await Student.findOne({ _id: Object(id) })
            let url = `/public/upload/${image.picture}`
            const url_path = path.join(process.cwd(), url);
            if (fs.existsSync(url_path)) fs.unlinkSync(url_path);
        }
        if (req.files.fatherImg ? true : false) {
            let image = await Student.findOne({ _id: Object(id) })
            let url = `/public/upload/${image.fatherImg}`
            const url_path = path.join(process.cwd(), url);
            if (fs.existsSync(url_path)) fs.unlinkSync(url_path);
        }
        if (req.files.motherImg ? true : false) {
            let image = await Student.findOne({ _id: Object(id) })
            let url = `/public/upload/${image.motherImg}`
            const url_path = path.join(process.cwd(), url);
            if (fs.existsSync(url_path)) fs.unlinkSync(url_path);
        }
        const details = await Student.findOneAndUpdate({ _id: Object(id) }, newdata);
        res.send(details)
    } catch (error) {

    }
}

const getSingle_StudentDetails = async (req, res) => {
    try {
        const id = req.body.id
        const details = await Student.findOne({ student_id: id });
        res.send({ succuss: true, data: details })
    } catch (error) {

    }
}


const Student_timetable = async (req, res) => {
    let cls = req.body.cls
    let section = req.body.section
    console.log(req.body)
    delete req.body['cls']
    delete req.body['section']
    const newdata = {
        class: cls,
        section: section,
        timetable: req.body
    }
    console.log(newdata)
    let obj = { class: cls, section: section }
    let timetable = await studentTimetable.find(obj)
    if (timetable.length > 0) {
        let result = await studentTimetable.findOneAndUpdate(obj, newdata)
        res.json({
            succuss: 1,
            result: result
        })
    }
    else {
        let result = await studentTimetable.create(newdata);
        res.json({
            succuss: 1,
            result: result
        })
    }
}
const getStudentTimetable = async (req, res) => {
    try {
        const { section, cls } = req.body;
        console.log(req.body)
        const details = await studentTimetable.find({ class: cls, section: section });
        console.log(details)
        res.send(details)
    } catch (error) {

    }
}
const markAttedance = async (req, res) => {
    let id = req.body.student_id
    let attendanceDetails = await Student.findOne({ student_id: id }).then((res) => { return res.Attendance })
    delete req.body.student_id
    let obj = req.body
    let date = req.body.date
    let checkConditon = false;
    let push = { $push: { Attendance: obj } }
    if (attendanceDetails.length > 0) {
        for (let i = 0; i < attendanceDetails.length; i++) {
            if (attendanceDetails[i].date == date) {
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
                    "Attendance.date": date
                },
                {
                    $set: {
                        "Attendance.$.present": req.body.present
                    }
                }
            );
            res.json("updated succefully")
        }
        else {
            const updateResult = await Student.updateOne({ student_id: id }, push);
            res.json(updateResult)
        }
    }
    else {
        const updateResult = await Student.updateOne({ student_id: id }, push); s
        res.json(updateResult)
    }


}
const DeleteStudentDetails = async (req, res) => {
    try {
        const id = req.params.id
        console.log("hello")
        const details = await Student.deleteOne({ _id: Object(id) });
        res.send(details)
    } catch (error) {

    }
}
const getSingleResult = async (req, res) => {
    try {
        console.log(req.body)
        const { id, slot, year } = req.body;
        let arr = []
        const details = await Student.findById(id).then((res) => { return res.result });
        details.map((v) => {
            console.log(v.slot == slot)
            if (v.slot == slot && v.year == year) {
                arr.push(v)
            }
        }) 
        res.send(arr)
    } catch (error) {

    }
}

module.exports = {
    createStudentDetails,
    getStudent,
    editStudentDetails,
    getSingle_StudentDetails,
    Student_timetable,
    getStudentTimetable,
    markAttedance,
    DeleteStudentDetails,
    getSingleResult
}