import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import AppError from "../shared/errors/app.error";

export const RESOURCES = {
  BANK: "BANK",
};

export const DESTINANTIONS = {
  IMAGE: {
    BANK: "../../../public/images/bank",
  },
};

export const FILENAME: {
  [key: string]: (originalname: string) => string;
} = {
  BANK: (originalname: string) =>
    `bank-${uuidv4()}${path.extname(originalname)}`,
};

export const FILTERS = {
  IMAGE: {
    CONTENT: ["image/png", "image/jpg", "image/jpeg"],
    MESSAGE: "Only .png, .jpg and .jpeg format allowed!",
  },
};

export const multerConfig = (
  resource: string,
  destination: string,
  filter: any
) => {
  /**
   * Multer disk storage
   */
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, destination));
    },
    filename: function (req, file, cb) {
      cb(null, FILENAME[resource](file.originalname));
    },
  });

  /**
   * Multer file upload with filters
   */
  const upload = multer({
    storage,
    limits: {
      fileSize: 1024 * 1024 * 1024,
      fieldSize: 1024 * 1024 * 1024,
    },
    fileFilter: function (req, file, cb) {
      if (filter.CONTENT.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new AppError(filter.MESSAGE, 400));
      }
    },
  });
  return upload;
};
