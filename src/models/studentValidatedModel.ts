import mongoose from "mongoose";
import IValidated from "../@types/validatedInterface";

const studentValidatedSchema = new mongoose.Schema<IValidated>({
  studentNumber: {
    type: String,
    required: [true, "A student must have a student number"],
    unique: true,
  },
  validatedAt: Date,
});

const Validated = mongoose.model("Validated", studentValidatedSchema);
export default Validated;
