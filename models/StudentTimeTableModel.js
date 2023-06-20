const mongoose = require("mongoose");

const Student_Timetable = new mongoose.Schema({
  class: {
    type: String,   
  },
  section: {
    type: String,
  },
  timetable: {
    type: Object,
    default:""
  },
});

module.exports = mongoose.model("Student_timetable", Student_Timetable);