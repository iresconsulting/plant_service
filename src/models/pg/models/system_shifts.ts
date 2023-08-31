import Logger from '~/src/utils/logger'
import { client } from '..'

export async function createSystemShifts(): Promise<void | false> {
  const sql: string = `
    CREATE TABLE IF NOT EXISTS system_shifts (
      id bigserial PRIMARY KEY,
      title text DEFAULT '',
      head_count_default text DEFAULT '',
      start_time text DEFAULT '',
      end_time text DEFAULT '',
      remark text DEFAULT '',
      hidden boolean DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `

  try {
    await client.query(sql)
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'createSystemShifts success.' })
  } catch (e: unknown) {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `createSystemShifts error: ${(e as string).toString()}` })
    return false
  }
}

export async function dropSystemShifts(): Promise<void | false> {
  const sql: string = `
    DROP TABLE system_shifts
  `

  try {
    await client.query(sql)
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'dropSystemShifts success.' })
  } catch (e: unknown) {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `dropSystemShifts error: ${(e as string).toString()}` })
    return false
  }
}
