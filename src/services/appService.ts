import { Request } from "express";
import Student from "../models/studentModel";
import Validated from "../models/studentValidatedModel";
import AppError from "../errors/appError";
import StudentLog from "../models/studentLogModel";
import { IData, IFormattedData } from "../@types/validationServiceInterface";
import User from "../models/userModel";

class AppService {
  date = new Date().toISOString().split("T")[0];
  timezoneOffset = new Date().getTimezoneOffset() / 60 || -8;
  utc = Math.abs(this.timezoneOffset);

  utcDate(dateStart = this.date, dateEnd = this.date) {
    const startDate = new Date(dateStart);

    const start =
      this.timezoneOffset < 0
        ? new Date(startDate.getTime() - this.utc * 60 * 60 * 1000)
        : new Date(startDate.getTime() + this.utc * 60 * 60 * 1000);

    const adjustEndDate = new Date(`${dateEnd}T23:59:59.999Z`);
    const end =
      this.timezoneOffset < 0
        ? new Date(adjustEndDate.getTime() - this.utc * 60 * 60 * 1000)
        : new Date(adjustEndDate.getTime() + this.utc * 60 * 60 * 1000);

    return { start, end };
  }

  async validateIdService(req: Request) {
    if (!req.body.studentNumber)
      throw new AppError("Invalid student number", 400);

    const student = await Student.findOne({
      studentNumber: req.body.studentNumber,
    });

    if (!student) throw new AppError("Student not found", 404);

    if (!student.isEnrolled)
      throw new AppError(
        "Student is not yet enrolled for this school year.",
        400
      );

    if (await Validated.findOne({ studentNumber: student.studentNumber }))
      throw new AppError(
        "Student is already validated for this school year.",
        409
      );

    const validatedStudent = await Validated.create({
      studentNumber: student.studentNumber,
      validatedAt: new Date().toISOString(),
    });

    return { student, validatedStudent };
  }

  async entranceLogService(req: Request) {
    const { start, end } = this.utcDate();
    if (!req.body.studentNumber)
      throw new AppError("Invalid student number!", 400);

    const student = await Validated.findOne({
      studentNumber: req.body.studentNumber,
    });

    if (!student) throw new AppError("Student is not validated!", 404);

    const studentLogged = await StudentLog.findOne({
      studentNumber: student.studentNumber,
      date: { $gte: start, $lte: end },
    });

    if (studentLogged) {
      if (studentLogged.inSchool)
        throw new AppError("Student has not yet left school!", 400);

      studentLogged.entryTime.push(new Date());
      studentLogged.inSchool = true;
      await studentLogged.save();
    } else {
      await StudentLog.create({
        studentNumber: student.studentNumber,
        date: new Date(),
        inSchool: true,
        entryTime: [new Date()],
        exitTime: [],
      });
    }
  }

  async exitLogService(req: Request) {
    const { start, end } = this.utcDate();
    if (!req.body.studentNumber)
      throw new AppError("Invalid student number.", 400);

    const student = await StudentLog.findOne({
      studentNumber: req.body.studentNumber,
      date: { $gte: start, $lte: end },
    });

    if (!student?.inSchool)
      throw new AppError("Student hasn't entered the school yet.", 404);

    if (student.entryTime.length < student.exitTime.length)
      throw new AppError("Student hasn't entered the school yet.", 404);

    student.exitTime.push(new Date());
    student.inSchool = false;

    await student.save();
  }

  async validatedStatsService(req: Request) {
    const { year, month, hours, startDate, endDate } = req.query;

    let filter: Record<string, any> = {};
    let groupby: Record<string, any> = {};
    let fieldType: Record<string, any> = {};

    if (hours) {
      filter = {
        validatedAtUTC8: {
          $gte: new Date(`${hours}T00:00:00`),
          $lte: new Date(`${hours}T23:59:59`),
        },
      };
      groupby = { $hour: "$validatedAtUTC8" };
      fieldType = { hour: "$_id" };
    } else if (year && month) {
      const daysInMonth = new Date(Number(year), Number(month), 0).getDate();
      filter = {
        validatedAtUTC8: {
          $gte: new Date(`${year}-${month}-01`),
          $lte: new Date(`${year}-${month}-${daysInMonth}`),
        },
      };
      groupby = { $dayOfMonth: "$validatedAtUTC8" };
      fieldType = { day: "$_id" };
    } else if (year) {
      filter = {
        validatedAtUTC8: {
          $gte: new Date(`${year}-1-01`),
          $lte: new Date(`${year}-12-31`),
        },
      };
      groupby = { $month: "$validatedAtUTC8" };
      fieldType = { month: "$_id" };
    } else if (startDate && endDate) {
      filter = {
        validatedAtUTC8: {
          $gte: new Date(`${startDate}`),
          $lte: new Date(`${endDate}`),
        },
      };
      groupby = { $year: "$validatedAtUTC8" };
      fieldType = { year: "$_id" };
    }

    const data = await Validated.aggregate([
      {
        $project: {
          validatedAtUTC8: {
            $add: ["$validatedAt", 8 * 60 * 60 * 1000],
          },
        },
      },
      {
        $match: filter,
      },
      {
        $group: {
          _id: groupby,
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $addFields: fieldType },
      { $project: { _id: 0 } },
    ]);

    return data;
  }

  formatData = function (
    data: IData,
    type: "hour" | "day" | "month"
  ): IFormattedData {
    let entryTimes: number[], exitTimes: number[];

    if (type === "hour") {
      entryTimes = data.entryTimes.map((entry) =>
        entry.hour !== undefined ? entry.hour % 24 : 0
      );
      exitTimes = data.exitTimes.map((exit) =>
        exit.hour !== undefined ? exit.hour % 24 : 0
      );
    } else if (type === "day") {
      entryTimes = data.entryTimes.map((entry) =>
        entry.day !== undefined ? entry.day : 0
      );
      exitTimes = data.exitTimes.map((exit) =>
        exit.day !== undefined ? exit.day : 0
      );
    } else {
      entryTimes = data.entryTimes.map((entry) =>
        entry.month !== undefined ? entry.month : 0
      );
      exitTimes = data.exitTimes.map((exit) =>
        exit.month !== undefined ? exit.month : 0
      );
    }

    const entryCounts = data.entryTimes.map((entry) => entry.count);
    const exitCounts = data.exitTimes.map((exit) => exit.count);
    const entryAvg = data.entryTimes.map((entry) => entry.avgHour);
    const exitAvg = data.exitTimes.map((exit) => exit.avgHour);

    return {
      entryLogs: [entryTimes, entryAvg, entryCounts],
      exitLogs: [exitTimes, exitAvg, exitCounts],
    };
  };

  async schoolLogsService(req: Request) {
    const { year, month, day } = req.query;
    const daysInMonth = new Date(Number(year), Number(month), 0).getDate();

    let groupbyEntry: Record<string, any> = {},
      groupbyExit: Record<string, any> = {},
      filterEntry: Record<string, any> = {},
      filterEnd: Record<string, any> = {},
      fieldNameEntry: Record<string, any> = {},
      fieldNameExit: Record<string, any> = {},
      project: Record<string, any> = {},
      dataLog: IFormattedData = {
        entryLogs: [],
        exitLogs: [],
      };

    let addField,
      avgExit = { $toLong: "$exitTime" },
      avgEntry = { $toLong: "$entryTime" };

    if (this.timezoneOffset < 0) {
      addField = {
        avgHour: {
          $add: [
            {
              $hour: {
                $add: ["$avgDate", this.utc * 60 * 60 * 1000],
              },
            },
            {
              $divide: [
                {
                  $minute: {
                    $add: ["$avgDate", this.utc * 60 * 60 * 1000],
                  },
                },
                60,
              ],
            },
          ],
        },
      };
    } else {
      addField = {
        avgHour: {
          $add: [
            {
              $hour: {
                $subtract: ["$avgDate", this.utc * 60 * 60 * 1000],
              },
            },
            {
              $divide: [
                {
                  $minute: {
                    $subtract: ["$avgDate", this.utc * 60 * 60 * 1000],
                  },
                },
                60,
              ],
            },
          ],
        },
      };
    }

    if (year && month && day) {
      const { start, end } = this.utcDate(
        `${year}-${month}-${day}`,
        `${year}-${month}-${day}`
      );
      filterEntry = {
        entryTime: {
          $gte: start,
          $lte: end,
        },
      };
      filterEnd = {
        exitTime: {
          $gte: start,
          $lte: end,
        },
      };
      groupbyEntry = { $hour: { $add: "$entryTime" } };
      groupbyExit = { $hour: "$exitTime" };
      fieldNameEntry = { hour: "$_id" };
      fieldNameExit = { hour: "$_id" };
      project =
        this.timezoneOffset < 0
          ? {
              _id: 0,
              count: 1,
              avgDate: { $toDate: "$avgDate" },
              hour: { $add: ["$hour", this.utc] },
            }
          : {
              _id: 0,
              count: 1,
              avgDate: { $toDate: "$avgDate" },
              hour: { $subtract: ["$hour", this.utc] },
            };
    } else if (year && month) {
      const { start, end } = this.utcDate(
        `${year}-${month}-01`,
        `${year}-${month}-${daysInMonth}`
      );
      filterEntry = {
        entryTime: {
          $gte: start,
          $lte: end,
        },
      };
      filterEnd = {
        exitTime: {
          $gte: start,
          $lte: end,
        },
      };
      groupbyEntry = { $dayOfMonth: "$entryTime" };
      groupbyExit = { $dayOfMonth: "$exitTime" };
      fieldNameEntry = { day: "$_id" };
      fieldNameExit = { day: "$_id" };
      project = { _id: 0, day: 1, count: 1, avgDate: { $toDate: "$avgDate" } };
    } else if (year) {
      const { start, end } = this.utcDate(`${year}-01-01`, `${year}-12-31`);
      filterEntry = {
        entryTime: {
          $gte: start,
          $lte: end,
        },
      };
      filterEnd = {
        exitTime: {
          $gte: start,
          $lte: end,
        },
      };
      groupbyEntry = { $month: "$entryTime" };
      groupbyExit = { $month: "$exitTime" };
      fieldNameEntry = { month: "$_id" };
      fieldNameExit = { month: "$_id" };
      project = {
        _id: 0,
        month: 1,
        count: 1,
        avgDate: { $toDate: "$avgDate" },
      };
      avgEntry = {
        // @ts-ignore
        $toLong: {
          $toDate: {
            $concat: [
              {
                $dateToString: {
                  format: "%Y-%m-",
                  date: "$entryTime",
                },
              },
              "01T",
              {
                $dateToString: {
                  format: "%H:%M:%S.%LZ",
                  date: "$entryTime",
                },
              },
            ],
          },
        },
      };
      avgExit = {
        // @ts-ignore
        $toLong: {
          $toDate: {
            $concat: [
              {
                $dateToString: {
                  format: "%Y-%m-",
                  date: "$exitTime",
                },
              },
              "01T",
              {
                $dateToString: {
                  format: "%H:%M:%S.%LZ",
                  date: "$exitTime",
                },
              },
            ],
          },
        },
      };
    }

    const data = await StudentLog.aggregate([
      {
        $facet: {
          entryTimes: [
            { $unwind: "$entryTime" },
            { $project: { _id: 0, entryTime: 1 } },
            { $match: filterEntry },
            {
              $group: {
                _id: groupbyEntry,
                count: { $sum: 1 },
                avgDate: {
                  $avg: avgEntry,
                },
              },
            },
            { $sort: { _id: 1 } },
            { $addFields: fieldNameEntry },
            { $project: project },
            { $addFields: addField },
            { $project: { avgDate: 0 } },
          ],
          exitTimes: [
            { $unwind: "$exitTime" },
            { $project: { _id: 0, exitTime: 1 } },
            { $match: filterEnd },
            {
              $group: {
                _id: groupbyExit,
                count: { $sum: 1 },
                avgDate: {
                  $avg: avgExit,
                },
              },
            },
            { $sort: { _id: 1 } },
            { $addFields: fieldNameExit },
            { $project: project },
            { $addFields: addField },
            { $project: { avgDate: 0 } },
          ],
        },
      },
    ]);

    if (year && month && day) dataLog = this.formatData(data[0], "hour");
    else if (year && month) dataLog = this.formatData(data[0], "day");
    else if (year) dataLog = this.formatData(data[0], "month");

    return dataLog;
  }

  async studentLogStatsService(req: Request) {
    const { date, studentNumber } = req.body;
    let fillDateStart = date,
      fillDateEnd = date;
    if (!date) {
      (fillDateStart = "2024-01-01"), (fillDateEnd = "2024-12-31");
    }

    const student = await Validated.findOne({ studentNumber });
    if (!student) throw new AppError("Student not found.", 404);

    const { start, end } = this.utcDate(fillDateStart, fillDateEnd);
    const data = await StudentLog.aggregate([
      {
        $match: {
          studentNumber: student.studentNumber,
          date: {
            $gte: start,
            $lte: end,
          },
        },
      },
      { $sort: { date: 1 } },
      {
        $project: {
          _id: 0,
          studentNumber: 1,
          entryTime: {
            $map: {
              input: "$entryTime",
              as: "entry",
              in: {
                $dateToString: {
                  format: "%H:%M",
                  date: { $add: ["$$entry", this.utc * 60 * 60 * 1000] },
                },
              },
            },
          },
          exitTime: {
            $map: {
              input: "$exitTime",
              as: "exit",
              in: {
                $dateToString: {
                  format: "%H:%M",
                  date: { $add: ["$$exit", this.utc * 60 * 60 * 1000] },
                },
              },
            },
          },
          date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        },
      },
    ]);

    return data;
  }

  async enrolledStatService(req: Request) {
    const data = await Student.aggregate([
      { $match: { isEnrolled: true } },
      { $group: { _id: null, count: { $sum: 1 } } },
      { $project: { _id: 0, count: 1 } },
    ]);

    return data;
  }

  async validatedStatService(req: Request) {
    const data = await Validated.aggregate([
      { $group: { _id: null, count: { $sum: 1 } } },
      { $project: { _id: 0, count: 1 } },
    ]);

    return data;
  }

  async studentsInSchoolService(req: Request) {
    const data = await StudentLog.aggregate([
      { $match: { inSchool: true } },
      { $group: { _id: null, count: { $sum: 1 } } },
      { $project: { _id: 0 } },
    ]);

    return data;
  }

  async totalUserService(req: Request) {
    const data = await User.aggregate([
      { $group: { _id: null, count: { $sum: 1 } } },
      { $project: { _id: 0 } },
    ]);

    return data;
  }
}

export default new AppService();
