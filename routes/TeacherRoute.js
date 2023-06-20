const { createTeacher_Details, getTeacher, editTeacherDetails, getSingle_TeacherDetails,DeleteTeacherDetails, Addclass, releaseResult, allTeacher, allTeacherImage} = require("../controllers/TeacherController");
const middleware= require("../middleware/middleware");
const router = require("express").Router();

router.post("/Teacher_details",middleware.UploadSingle, createTeacher_Details);
router.put("/edit_Teacher_details/:id",middleware.UploadSingle, editTeacherDetails);
router.post("/getSingle_Teacher_details", getSingle_TeacherDetails);
router.post("/delete_Teacher_details/:id", DeleteTeacherDetails);
router.post("/addClass", Addclass);
router.post("/releaseResult", releaseResult);
router.post("/allTeacher", allTeacher);
router.post("/allTeacherImage", allTeacherImage);
module.exports = router;