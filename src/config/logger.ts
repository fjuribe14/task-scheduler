import path from "node:path";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const logLevel = process.env.LOG_LEVEL || "info";

// Common formatting for both console and file
// Must include winston.format.splat() to support printf format strings like %s, %d
const commonFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
);

// Format for the Console (colored output)
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  commonFormat,
  winston.format.printf(({ level, message, timestamp, stack }) => {
    if (stack) {
      return `[${timestamp}] ${level}: ${message}\n${stack}`;
    }
    return `[${timestamp}] ${level}: ${message}`;
  }),
);

// Format for the File (plain text without colors)
const fileFormat = winston.format.combine(
  commonFormat,
  winston.format.printf(({ level, message, timestamp, stack }) => {
    const cleanLevel = level.toUpperCase().padEnd(5);
    if (stack) {
      return `[${timestamp}] ${cleanLevel}: ${message}\n${stack}`;
    }
    return `[${timestamp}] ${cleanLevel}: ${message}`;
  }),
);

// Daily Rotate File transport setup in the root folder /log
const dailyRotateFileTransport = new DailyRotateFile({
  filename: path.join(process.cwd(), "log", "%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: false,
  maxSize: "20m",
  maxFiles: "14d",
  format: fileFormat,
});

export const logger = winston.createLogger({
  level: logLevel,
  transports: [
    new winston.transports.Console({
      format: consoleFormat,
    }),
    dailyRotateFileTransport,
  ],
});
