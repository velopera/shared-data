"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const fs_1 = __importDefault(require("fs"));
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
// Check if log directory exists, if not, create it
const logPath = "./logs";
!fs_1.default.existsSync(logPath) && fs_1.default.mkdirSync(logPath);
// Set a prefix for log files, default to 'scs_iot', can be overridden by environment variable
let prefix = "velopera";
if (process.env.LOG_PREFIX) {
    prefix = process.env.LOG_PREFIX;
}
// Configure daily rotating file transport
const fileTransport = new winston_daily_rotate_file_1.default({
    filename: prefix + "-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    dirname: logPath,
    zippedArchive: true,
    maxSize: "100m",
    level: "debug",
});
// Create the winston logger instance
exports.logger = winston_1.default.createLogger({
    transports: [
        new winston_1.default.transports.Console({
            handleExceptions: true,
        }),
        fileTransport,
    ],
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
    }), winston_1.default.format.colorize(), winston_1.default.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)),
    level: "debug", // Default log level for the logger
});
