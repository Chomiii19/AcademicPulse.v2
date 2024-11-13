import StudentService from "../services/getAllStudentService";
import catchAsync from "../utils/catchAsync";
const getAllStudents = catchAsync(async (req, res) => {
    const { students, totalCount, totalPages } = await StudentService.getAllStudentsQuery(req);
    res.status(200).json({
        status: "Success",
        totalStudents: totalCount,
        totalPages,
        data: students,
    });
});
export { getAllStudents };
