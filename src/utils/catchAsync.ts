import { Request, Response, NextFunction } from "express";

// Accepts function that takes (req, res, next) as arguments and returns a Promise
type PromiseFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

// Returns a new anonymous function
const catchAsync = (fn: PromiseFunction) => {
  return (req: Request, res: Response, next: NextFunction) =>
    fn(req, res, next).catch((err: Error) => next(err));
};

export default catchAsync;
