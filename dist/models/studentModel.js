import mongoose from "mongoose";
import validator from "validator";
const studentRecordSchema = new mongoose.Schema({
    studentNumber: {
        type: String,
        required: [true, "A student must have a student number"],
        unique: true,
    },
    surname: {
        type: String,
        required: [true, "A user must have a surname"],
    },
    firstname: {
        type: String,
        required: [true, "A user must have a firstname"],
    },
    middlename: {
        type: String,
    },
    extension: {
        type: String,
    },
    email: {
        type: String,
        required: [true, "A user must have an email"],
        validate: [validator.isEmail, "Invalid email"],
        unique: true,
    },
    isEnrolled: {
        type: Boolean,
        default: false,
    },
    isEnrolledAt: Date,
    course: {
        type: String,
        required: [true, "A student must have a course"],
    },
    yearLevel: {
        type: Number,
        enum: [1, 2, 3, 4],
        required: [true, "A student must have a year level."],
    },
});
const Student = mongoose.model("Student", studentRecordSchema);
export default Student;
