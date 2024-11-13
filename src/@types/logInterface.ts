import { Document } from "mongoose";

interface IStudentLog extends Document {
  studentNumber: string;
  inSchool: boolean;
  date: Date;
  entryTime: Date[];
  exitTime: Date[];
}

export default IStudentLog;
