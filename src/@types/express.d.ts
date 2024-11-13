import IUser from "./userInterfaces";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
