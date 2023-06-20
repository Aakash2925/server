const mongoose = require("mongoose");
const studentDetails = new mongoose.Schema({
  
  student_id: {
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
  class: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true
  },

  mobile: {
    type: Number,
    default: "",
  },
  picture: {
    type: String,
    default:""
  },
  fatherImg: {
    type: String,
    default:""
  },
  motherImg: {
    type: String,
    default:""
  },
  Attendance:{
    type:Array,
    default:[]
  },
  result: {
    type: Array,
    required: true
},
});

module.exports = mongoose.model("student_details", studentDetails);