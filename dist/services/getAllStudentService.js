import Student from "../models/studentModel";
class StudentService {
    async getAllStudentsQuery(req) {
        const queryObj = { ...req.query };
        if (queryObj.page)
            delete queryObj.page;
        let studentsQuery = Student.find(queryObj);
        if (req.query.page) {
            const page = Number(req.query.page) * 1;
            const skip = (page - 1) * 10;
            studentsQuery = studentsQuery.skip(skip).limit(10);
        }
        const students = await studentsQuery;
        const totalCount = await Student.countDocuments(queryObj);
        const totalPages = Math.ceil(totalCount / 10);
        return { students, totalCount, totalPages };
    }
}
export default new StudentService();
