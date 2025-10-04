export enum LogLevel {
    ERROR = 'ERROR',
    INFO = 'INFO',
    DEBUG = 'DEBUG',
  }
  
  const LOG_LEVELS: Record<string, number> = {
    [LogLevel.ERROR]: 1,
    [LogLevel.INFO]: 2,
    [LogLevel.DEBUG]: 3,
  };
  
  const CURRENT_LOG_LEVEL = process.env.NODE_ENV === 'production' 
    ? LOG_LEVELS[LogLevel.ERROR] 
    : LOG_LEVELS[LogLevel.DEBUG];
  
  export function logInfo(message: string, meta?: Record<string, unknown>) {
    if (CURRENT_LOG_LEVEL >= LOG_LEVELS[LogLevel.INFO]) {
      console.log(`[${LogLevel.INFO}] ${message}`, meta || '');
    }
  }
  
  export function logError(message: string, meta?: Record<string, unknown>) {
    if (CURRENT_LOG_LEVEL >= LOG_LEVELS[LogLevel.ERROR]) {
      console.error(`[${LogLevel.ERROR}] ${message}`, meta || '');
    }
  }
  
  export function logDebug(message: string, meta?: Record<string, unknown>) {
    if (CURRENT_LOG_LEVEL >= LOG_LEVELS[LogLevel.DEBUG]) {
      console.debug(`[${LogLevel.DEBUG}] ${message}`, meta || '');
    }
  }