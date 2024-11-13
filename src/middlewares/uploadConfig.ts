import multer from "multer";
import { fileURLToPath } from "url";
import path from "path";
import AppError from "../errors/appError";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../dev-data/data/"));
  },

  filename: function (req, file, cb) {
    cb(null, "studentRecord.json");
  },
});

const uploadConfig = multer({
  storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== "application/json")
      return cb(
        new AppError("Invalid file type. File must be in JSON format", 400)
      );

    cb(null, true);
  },
}).single("file");

export default uploadConfig;
