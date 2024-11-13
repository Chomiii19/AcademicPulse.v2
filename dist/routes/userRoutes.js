import express from "express";
import * as userAuthentication from "../controllers/userAuthentication";
import * as userController from "../controllers/userController";
const router = express.Router();
router.route("/signup").post(userAuthentication.signup);
router.route("/login").post(userAuthentication.login);
router.route("/verify/:id").get(userAuthentication.verifyUser);
router.route("/signout").get(userAuthentication.signout);
router
    .route("/api/user")
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);
export default router;
