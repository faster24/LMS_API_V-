const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        firstname: { type: String , required: true },
        lastname: { type: String , required: true },
        username: { type: String },
        email:  { type: String , required: true , unique: true },
        password: { type: String, required: true , min: [ 6 , "Password must be at least 6 characters" ]},
        isAdmin: { type: Boolean , default: false }
    },
    { timestamps: true }
);

module.exports = mongoose.model("User" , UserSchema);