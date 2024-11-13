import mongoose from "mongoose";
const studentValidatedSchema = new mongoose.Schema({
    studentNumber: {
        type: String,
        required: [true, "A student must have a student number"],
        unique: true,
    },
    validatedAt: Date,
});
const Validated = mongoose.model("Validated", studentValidatedSchema);
export default Validated;
