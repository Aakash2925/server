const { createStudentDetails, getStudent, editStudentDetails, getSingle_StudentDetails, Student_timetable, getStudentTimetable, markAttedance, DeleteStudentDetails, getSingleResult } = require("../controllers/studentController");
const middleware= require("../middleware/middleware");
createStudentDetails
const router = require("express").Router();

router.post("/Student_details",middleware.Upload, createStudentDetails);
router.put("/edit_Student_details/:id",middleware.Upload, editStudentDetails);
router.post("/get_Student_details", getStudent);
router.post("/getSingle_Student_details", getSingle_StudentDetails);
router.post("/getStudentTimetable", getStudentTimetable);
router.post("/studentTimetable", Student_timetable);
router.post("/markAttendance", markAttedance);
router.post("/delete_student_details/:id", DeleteStudentDetails);
router.post("/getSingleResult", getSingleResult);
module.exports = router;