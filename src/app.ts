import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes";
import appRoutes from "./routes/appRoutes";
import AppError from "./errors/appError";
import globalErrorHandler from "./controllers/globalErrorHandler";

const app = express();

app.use(
  cors({
    origin: "https://chomikun.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
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
