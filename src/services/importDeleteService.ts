import { Request, NextFunction } from "express";
import fs from "fs";
import Student from "../models/studentModel";
import AppError from "../errors/appError";

class importDeleteService {
  async importAllDAta(req: Request, next: NextFunction) {
    if (!req.file) return next(new AppError("No file uploaded.", 400));

    const filepath = req.file.path;
    const studentsData = JSON.parse(fs.readFileSync(filepath, "utf-8"));

    await Student.insertMany(studentsData);

    fs.unlink(filepath, (err) => {
      if (err)
        return next(
          new AppError("File uploaded but failed to delete file", 500)
        );
    });
  }
}

export default new importDeleteService();
