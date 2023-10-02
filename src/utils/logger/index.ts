import moment from 'moment-timezone'

namespace Logger {
  export const LOG_TIMEZONE = 'Asia/Taipei'

  export enum Labels {
    ENV = 'ENV',
    HTTP = 'HTTP',
    JOB = 'JOB',
    METRICS = 'METRICS',
    PUPPETEER = 'PUPPETEER',
    PG = 'SQL',
    MONGO = 'MONGO_DB',
    FIREBASE = 'FIREBASE',
    GCP = 'GCP',
  }

  export function generateTimeLog({ label, message }: { label: Labels, message: string }) {
    const _timestamp = moment.tz(LOG_TIMEZONE).toISOString(true)
    console.log(`[${_timestamp}] [${label}] ${message}`)
  }
}

export default Logger
