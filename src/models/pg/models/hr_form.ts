import Logger from '~/src/utils/logger'
import { client } from '..'

export async function createHrForm(): Promise<void | false> {
  const sql: string = `
    CREATE TABLE IF NOT EXISTS hr_form (
      id bigserial PRIMARY KEY,
      employee_id text DEFAULT '',
      system_username text DEFAULT '',
      apply_type text DEFAULT '',
      start_date text DEFAULT '',
      end_date text DEFAULT '',
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
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'createHrForm success.' })
  } catch (e: unknown) {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `createHrForm error: ${(e as string).toString()}` })
    return false
  }
}

export async function dropHrForm(): Promise<void | false> {
  const sql: string = `
    DROP TABLE hr_form
  `

  try {
    await client.query(sql)
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'dropHrForm success.' })
  } catch (e: unknown) {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `dropHrForm error: ${(e as string).toString()}` })
    return false
  }
}
