import User from "../models/userModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/appError";
const roleAuthorization = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ idNumber: req.user?.idNumber });
    if (!user)
        return next(new AppError("User account does not exist!", 404));
    if (user.role !== "admin")
        return res.redirect("/app/unauthorized");
    next();
});
export default roleAuthorization;
