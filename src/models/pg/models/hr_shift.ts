import Logger from '~/src/utils/logger'
import { client } from '..'

export async function createHrShift(): Promise<void | false> {
  const sql: string = `
    CREATE TABLE IF NOT EXISTS hr_shift (
      id bigserial PRIMARY KEY,
      employee_id text DEFAULT '',
      system_username text DEFAULT '',
      date text DEFAULT '',
      shift_title text DEFAULT '',
      start_time text DEFAULT '',
      end_time text DEFAULT '',
      remark text DEFAULT '',
      is_approved boolean DEFAULT false,
      is_pending boolean DEFAULT false,
      is_rejected boolean DEFAULT false,
      approve_users text DEFAULT '',
      require_approve_count int DEFAULT 2,
      tags text DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `

  try {
    await client.query(sql)
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'createHrShift success.' })
  } catch (e: unknown) {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `createHrShift error: ${(e as string).toString()}` })
    return false
  }
}

export async function dropHrShift(): Promise<void | false> {
  const sql: string = `
    DROP TABLE hr_shift
  `

  try {
    await client.query(sql)
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'dropHrShift success.' })
  } catch (e: unknown) {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `dropHrShift error: ${(e as string).toString()}` })
    return false
  }
}
