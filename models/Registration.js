const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
    courseId : { type: String , required: true },
    learnerId : { type: String , required: true }
} , 
 { timestamps: true }
);

module.exports = mongoose.model("Registration" , RegistrationSchema );