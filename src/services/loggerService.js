const DEBUG = process.env.NODE_ENV === 'development';

class Logger {
 constructor() {
   this.logs = []; // Store log history
   this.maxLogs = 100; // Maximum logs to keep in memory
 }

 // Format log entry with timestamp and metadata
 formatMessage(level, message, data) {
   const timestamp = new Date().toISOString();
   return {
     timestamp,
     level,
     message, 
     data
   };
 }

 // Store log entry and manage log history size
 storelog(logEntry) {
   if (this.logs.length >= this.maxLogs) {
     this.logs.shift(); // Remove oldest log when limit reached
   }
   this.logs.push(logEntry);
 }

 // Debug level logging (only in development)
 debug(message, data = null) {
   if (DEBUG) {
     const logEntry = this.formatMessage('DEBUG', message, data);
     this.storelog(logEntry);
   }
 }

 // Info level logging
 info(message, data = null) {
   const logEntry = this.formatMessage('INFO', message, data);
   console.info(`[INFO] ${message}`, data);
   this.storelog(logEntry);
 }

 // Warning level logging  
 warn(message, data = null) {
   const logEntry = this.formatMessage('WARN', message, data);
   console.warn(`[WARN] ${message}`, data);
   this.storelog(logEntry);
 }

 // Error level logging with stack trace
 error(message, error = null) {
   const logEntry = this.formatMessage('ERROR', message, {
     message: error?.message,
     stack: error?.stack,
     data: error?.response?.data
   });
   console.error(`[ERROR] ${message}`, error);
   this.storelog(logEntry);
 }

 // Get copy of stored logs
 getLogs() {
   return [...this.logs];
 }

 // Clear log history
 clearLogs() {
   this.logs = [];
 }
}

export const logger = new Logger();
export default logger;