import logger from "../config/logger";

export default function nonBlockingCall(promise: Promise<any>, errorLog: string = '') {
  const now = new Date().toLocaleTimeString();
  promise.catch(err => logger.error(`Error ${errorLog} ${now}`, err))
}