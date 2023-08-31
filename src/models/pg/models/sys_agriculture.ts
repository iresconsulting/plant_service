import Logger from '~/src/utils/logger'
import { client } from '..'

export async function createSysAgriculture(): Promise<void | false> {
  const sql: string = `
    CREATE TABLE IF NOT EXISTS sys_agriculture (
      id bigserial PRIMARY KEY,
      name text DEFAULT '',
      species text DEFAULT '',
      hidden boolean DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `

  try {
    await client.query(sql)
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'createSysAgriculture success.' })
  } catch (e: unknown) {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `createSysAgriculture error: ${(e as string).toString()}` })
    return false
  }
}

export async function dropSysAgriculture(): Promise<void | false> {
  const sql: string = `
    DROP TABLE sys_agriculture
  `

  try {
    await client.query(sql)
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'dropSysAgriculture success.' })
  } catch (e: unknown) {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `dropSysAgriculture error: ${(e as string).toString()}` })
    return false
  }
}
