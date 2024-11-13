interface IUser {
  _id: number;
  idNumber: string;
  surname: string;
  firstname: string;
  middlename?: string;
  extension?: string;
  email: string;
  phoneNumber: string;
  role: string;
  password: string;
  passwordConfirm: string | undefined;
  passwordChangedAt: Date | null;
  isValid: boolean;
  comparePassword(password: string): Promise<boolean>;
}

export default IUser;
