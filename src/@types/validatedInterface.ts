import { Document } from "mongoose";

interface IValidated extends Document {
  studentNumber: string;
  validatedAt: Date;
}

export default IValidated;
