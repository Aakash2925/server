const mongoose = require("mongoose");
const TeacherDetails = new mongoose.Schema({
  
  Teacher_id: {
    type: String,
    required: true,
  },
  Name: {
    type: String,
    required: true,
  },
  fatherName: {
    type: String,
    required: true,
  },
  motherName: {
    type: String,
    required: true
  },
  dob: {
    type: String,
    required: true
  },
  Address: {
    type: String,
    required: true
  },
  bloodGroup: {
    type: String,
    required: true
  },
  classes: {
    type: Array,
   default:[]
  },
  classTeacher: {
    type: Array,
    default:[]
  },

  mobile: {
    type: Number,
    default: "",
  },
  picture: {
    type: String,
    default:""
  },
});

module.exports = mongoose.model("teacher_details", TeacherDetails);