import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app";
dotenv.config();
const PORT = process.env.PORT;
const DB = `${process.env.DB}`.replace("<db_password>", `${process.env.DB_PASSWORD}`);
mongoose
    .connect(DB)
    .then(() => console.log("Successfully connected to DB"))
    .catch((err) => console.log(err));
app.listen(PORT, () => console.log("Server is listening on port", PORT));
