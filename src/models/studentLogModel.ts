import mongoose from "mongoose";
import IStudentLog from "../@types/logInterface";

const studentLogSchema = new mongoose.Schema<IStudentLog>({
  studentNumber: {
    type: String,
    required: [true, "A student must have a student number"],
  },
  inSchool: {
    type: Boolean,
    default: false,
  },
  date: { type: Date, required: true },
  entryTime: [{ type: Date, required: true }],
  exitTime: [{ type: Date }],
});

const StudentLog = mongoose.model("StudentLog", studentLogSchema);

export default StudentLog;
