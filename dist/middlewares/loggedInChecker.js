import User from "../models/userModel";
import catchAsync from "../utils/catchAsync";
import verifyToken from "../utils/verifyToken";
const loggedInChecker = catchAsync(async (req, res, next) => {
    const token = req.cookies.authToken;
    console.log(token);
    if (!token)
        return res.redirect("/");
    const decoded = await verifyToken(token);
    const user = await User.findById(decoded.id);
    if (user)
        return res.redirect("/app");
    else
        return res.redirect("/users/signout");
});
export default loggedInChecker;
