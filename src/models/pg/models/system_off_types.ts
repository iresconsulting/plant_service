import Logger from '~/src/utils/logger'
import { client } from '..'

export async function createSystemOffTypes(): Promise<void | false> {
  const sql: string = `
    CREATE TABLE IF NOT EXISTS system_off_types (
      id bigserial PRIMARY KEY,
      title text DEFAULT '',
      unit text DEFAULT '',
      days text DEFAULT '',
      pay_type text DEFAULT '',
      hidden boolean DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `

  try {
    await client.query(sql)
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'createSystemOffTypes success.' })
  } catch (e: unknown) {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `createSystemOffTypes error: ${(e as string).toString()}` })
    return false
  }
}

export async function dropSystemOffTypes(): Promise<void | false> {
  const sql: string = `
    DROP TABLE system_off_types
  `

  try {
    await client.query(sql)
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'dropSystemOffTypes success.' })
  } catch (e: unknown) {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `dropSystemOffTypes error: ${(e as string).toString()}` })
    return false
  }
}
