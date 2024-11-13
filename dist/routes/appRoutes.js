import express from "express";
import checkoutSession from "../controllers/checkoutController";
import * as appController from "../controllers/appController";
import * as rateLimiter from "../utils/rateLimit.js";
import uploadConfig from "../middlewares/uploadConfig";
import { importData, deleteData } from "../controllers/importDeleteController";
import * as studentController from "../controllers/studentController";
const router = express.Router();
router
    .route("/id-validation/submit")
    .post(rateLimiter.validateIdLimiter, appController.validateId);
router.route("/checkout-full-access").post(checkoutSession);
router.route("/upload").post(uploadConfig, importData);
router.route("/delete-record").delete(deleteData);
router
    .route("/student-log/entrance/submit")
    .post(appController.studentLogEntrance);
router.route("/student-log/exit/submit").post(appController.studentLogExit);
router.route("/validated-id-stats").get(appController.validatedIdStats);
router.route("/student-log-stats").post(appController.studentLogStats);
router.route("/school-log-stats").get(appController.schoolLogStats);
router.route("/enrolled-students").get(appController.enrolledStats);
router.route("/validated-students").get(appController.validatedStats);
router.route("/students-inschool").get(appController.countStudentsInSchool);
router.route("/total-users").get(appController.totalUsers);
router.route("/getAllStudents").get(studentController.getAllStudents);
export default router;
