const mongoose = require("mongoose");
const studentResult = new mongoose.Schema({

    student_id: {
        type: String,
        required: true,
    },
    Name: {
        type: String,
        required: true,
    },
    class: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    result: {
        type: Array,
        required: true
    },
});

module.exports = mongoose.model("studentResult", studentResult);