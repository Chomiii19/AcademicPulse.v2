import { Request, Response } from "express";
import StudentService from "../services/getAllStudentService";
import catchAsync from "../utils/catchAsync";

const getAllStudents = catchAsync(async (req: Request, res: Response) => {
  const { students, totalCount, totalPages } =
    await StudentService.getAllStudentsQuery(req);

  res.status(200).json({
    status: "Success",
    totalStudents: totalCount,
    totalPages,
    data: students,
  });
});

export { getAllStudents };
