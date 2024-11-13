interface IStudent {
  studentNumber: string;
  surname: string;
  firstname: string;
  middlename: string;
  extension: string;
  email: string;
  isEnrolled: boolean;
  isEnrolledAt: Date;
  course: string;
  yearLevel: number;
}

export default IStudent;
