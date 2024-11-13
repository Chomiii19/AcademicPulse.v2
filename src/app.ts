import express, { Request, Response, NextFunction } from "express";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes";
import appRoutes from "./routes/appRoutes";
import AppError from "./utils/appError";
import globalErrorHandler from "./controllers/globalErrorHandler";

const app = express();

app.use(mongoSanitize());
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/apps", appRoutes);
app.all("*", (req: Request, res: Response, next: NextFunction) =>
  next(new AppError(`Can't find ${req.originalUrl} from the server.`, 404))
);
app.use(globalErrorHandler);

export default app;
