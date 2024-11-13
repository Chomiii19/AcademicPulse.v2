"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const appRoutes_1 = __importDefault(require("./routes/appRoutes"));
const appError_1 = __importDefault(require("./utils/appError"));
const globalErrorHandler_1 = __importDefault(require("./controllers/globalErrorHandler"));
const app = (0, express_1.default)();
app.use((0, express_mongo_sanitize_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// app.use("/api", (req: Request, res: Response, next: NextFunction) => {
//   res.status(200).json({ message: "Hello" });
// });
app.use("/api/v1/users", userRoutes_1.default);
app.use("/api/v1/apps", appRoutes_1.default);
app.all("*", (req, res, next) => next(new appError_1.default(`Can't find ${req.originalUrl} from the server.`, 404)));
app.use(globalErrorHandler_1.default);
exports.default = app;
