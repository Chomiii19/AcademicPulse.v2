import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppService from "../services/appService";

const validateId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { student, validatedStudent } = await AppService.validateIdService(
      req
    );

    res.status(201).json({
      status: "Success",
      message: "Successfully validated",
      data: {
        validatedStudent,
        student,
      },
    });
  }
);

const studentLogEntrance = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await AppService.entranceLogService(req);

    res.status(201).json({
      status: "Success",
      message: "Success",
    });
  }
);

const studentLogExit = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await AppService.entranceLogService(req);

    res.status(201).json({
      status: "Success",
      message: "Success",
    });
  }
);

const validatedIdStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await AppService.validatedStatsService(req);

    res.status(200).json({
      status: "Success",
      data,
    });
  }
);

const studentLogStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await AppService.studentLogStatsService(req);

    res.status(200).json({
      status: "Success",
      data,
    });
  }
);

const schoolLogStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const dataLog = await AppService.schoolLogsService(req);

    res.status(200).json({
      status: "Success",
      data: dataLog,
    });
  }
);

const enrolledStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await AppService.enrolledStatService(req);

    res.status(200).json({
      status: "Success",
      data,
    });
  }
);

const validatedStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await AppService.validatedStatService(req);

    res.status(200).json({
      status: "Success",
      data,
    });
  }
);

const countStudentsInSchool = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await AppService.studentsInSchoolService(req);

    res.status(200).json({
      status: "Success",
      data,
    });
  }
);

const totalUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = AppService.totalUserService(req);

    res.status(200).json({
      status: "Success",
      data,
    });
  }
);

export {
  validateId,
  studentLogEntrance,
  studentLogExit,
  validatedIdStats,
  studentLogStats,
  enrolledStats,
  validatedStats,
  schoolLogStats,
  countStudentsInSchool,
  totalUsers,
};
