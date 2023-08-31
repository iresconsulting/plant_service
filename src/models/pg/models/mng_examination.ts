import Logger from '~/src/utils/logger'
import { client } from '..'

export async function createMngExamination(): Promise<void | false> {
  const sql: string = `
    CREATE TABLE IF NOT EXISTS mng_examination (
      id bigserial PRIMARY KEY,
      time text DEFAULT '',
      location text DEFAULT '',
      agriculture text DEFAULT '',
      symptoms text DEFAULT '',
      body_part text DEFAULT '',
      raised_method text DEFAULT '',
      status text DEFAULT '',
      user_name text DEFAULT '',
      user_phone text DEFAULT '',
      user_email text DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `

  try {
    await client.query(sql)
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'createMngExamination success.' })
  } catch (e: unknown) {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `createMngExamination error: ${(e as string).toString()}` })
    return false
  }
}

export async function dropMngExamination(): Promise<void | false> {
  const sql: string = `
    DROP TABLE mng_examination
  `

  try {
    await client.query(sql)
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'dropMngExamination success.' })
  } catch (e: unknown) {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `dropMngExamination error: ${(e as string).toString()}` })
    return false
  }
}
