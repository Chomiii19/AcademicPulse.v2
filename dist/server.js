"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config();
const PORT = process.env.PORT;
const DB = `${process.env.DB}`.replace("<db_password>", `${process.env.DB_PASSWORD}`);
mongoose_1.default
    .connect(DB)
    .then(() => console.log("Successfully connected to DB"))
    .catch((err) => console.log(err));
app_1.default.listen(PORT, () => console.log("Server is listening on port", PORT));
