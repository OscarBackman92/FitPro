// src/services/loggerService.js
const DEBUG = process.env.NODE_ENV === 'development';

class Logger {
  constructor() {
    this.logs = [];
    this.maxLogs = 100;
  }

  formatMessage(level, message, data) {
    const timestamp = new Date().toISOString();
    return {
      timestamp,
      level,
      message,
      data
    };
  }

  storelog(logEntry) {
    if (this.logs.length >= this.maxLogs) {
      this.logs.shift(); // Remove oldest log
    }
    this.logs.push(logEntry);
  }

  debug(message, data = null) {
    if (DEBUG) {
      const logEntry = this.formatMessage('DEBUG', message, data);
      console.log(`[DEBUG] ${message}`, data);
      this.storelog(logEntry);
    }
  }

  info(message, data = null) {
    const logEntry = this.formatMessage('INFO', message, data);
    console.info(`[INFO] ${message}`, data);
    this.storelog(logEntry);
  }

  warn(message, data = null) {
    const logEntry = this.formatMessage('WARN', message, data);
    console.warn(`[WARN] ${message}`, data);
    this.storelog(logEntry);
  }

  error(message, error = null) {
    const logEntry = this.formatMessage('ERROR', message, {
      message: error?.message,
      stack: error?.stack,
      data: error?.response?.data
    });
    console.error(`[ERROR] ${message}`, error);
    this.storelog(logEntry);
  }

  getLogs() {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = new Logger();
export default logger;