import fs from "fs";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

// Check if log directory exists, if not, create it
const logPath: string = "./logs";
!fs.existsSync(logPath) && fs.mkdirSync(logPath);

// Set a prefix for log files, default to 'velopera', can be overridden by environment variable
let prefix = "velopera";
if (process.env.LOG_PREFIX) {
  prefix = process.env.LOG_PREFIX;
}

// Configure daily rotating file transport
const fileTransport = new DailyRotateFile({
  filename: prefix + "-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  dirname: logPath,
  zippedArchive: true,
  maxSize: "100m",
  level: "debug",
});

// Create the winston logger instance
export const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
    }),
    fileTransport,
  ],
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.colorize(),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
  ),
  level: "debug", // Default log level for the logger
});
