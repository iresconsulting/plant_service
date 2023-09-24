import Logger from '~/src/utils/logger'
import { client } from '..'

export async function createMngRecord(): Promise<void | false> {
  const sql: string = `
    CREATE TABLE IF NOT EXISTS mng_record (
      id bigserial PRIMARY KEY,
      time text DEFAULT '',
      location text DEFAULT '',
      agriculture text DEFAULT '',
      symptoms text DEFAULT '',
      body_part text DEFAULT '',
      raised_method text DEFAULT '',
      user_name text DEFAULT '',
      user_phone text DEFAULT '',
      user_email text DEFAULT '',
      status text DEFAULT '',
      response text DEFAULT '',
      video_url text DEFAULT '',
      expert_name DEFAULT '',
      hidden boolean DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `

  try {
    await client.query(sql)
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'createMngRecord success.' })
  } catch (e: unknown) {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `createMngRecord error: ${(e as string).toString()}` })
    return false
  }
}

export async function dropMngRecord(): Promise<void | false> {
  const sql: string = `
    DROP TABLE mng_record
  `

  try {
    await client.query(sql)
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'dropMngRecord success.' })
  } catch (e: unknown) {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `dropMngRecord error: ${(e as string).toString()}` })
    return false
  }
}
