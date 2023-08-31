import Logger from '~/src/utils/logger'
import { client } from '..'

export async function createHrClockRecord(): Promise<void | false> {
  const sql: string = `
    CREATE TABLE IF NOT EXISTS hr_clock_record (
      id bigserial PRIMARY KEY,
      date text DEFAULT '',
      employee_id text DEFAULT '',
      system_username text DEFAULT '',
      status text DEFAULT '',
      time_in text DEFAULT '',
      time_out text DEFAULT '',
      remark text DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `

  try {
    await client.query(sql)
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'createHrClockRecord success.' })
  } catch (e: unknown) {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `createHrClockRecord error: ${(e as string).toString()}` })
    return false
  }
}

export async function dropHrClockRecord(): Promise<void | false> {
  const sql: string = `
    DROP TABLE hr_clock_record
  `

  try {
    await client.query(sql)
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'dropHrClockRecord success.' })
  } catch (e: unknown) {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `dropHrClockRecord error: ${(e as string).toString()}` })
    return false
  }
}
