const {
  student_login,
  teacher_login,
  student_register,
  teacher_register,
  admin_login,
  admin_register,
  forgotPassword,
  resetPassword,
  api

} = require("../controllers/userController");

const router = require("express").Router();

router.post("/Student_login", student_login);
router.post("/student_register", student_register);
router.post("/teacher_register", teacher_register);
router.post("/teacher_login", teacher_login);
router.post("/admin_register", admin_register);
router.post("/admin_login", admin_login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;