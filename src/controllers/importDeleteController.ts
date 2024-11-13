import { Request, Response, NextFunction } from "express";
import importDeleteService from "../services/importDeleteService";
import Student from "../models/studentModel";
import catchAsync from "../utils/catchAsync";

const importData = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    importDeleteService.importAllDAta(req, next);

    res.status(201).json({
      status: "Success",
      message: "Student record successfully created.",
    });
  }
);

const deleteData = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await Student.deleteMany();

    res.status(200).json({
      status: "Success",
      message: "Student record successfully deleted.",
    });
  }
);

export { importData, deleteData };
