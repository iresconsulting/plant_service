import Logger from '~/src/utils/logger'
import { client } from '..'

export async function createcreateSysUnitSystemBonus(): Promise<void | false> {
  const sql: string = `
    CREATE TABLE IF NOT EXISTS sys_unit (
      id bigserial PRIMARY KEY,
      name text DEFAULT '',
      location text DEFAULT '',
      contact text DEFAULT '',
      phone text DEFAULT '',
      hidden boolean DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `

  try {
    await client.query(sql)
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'createSysUnit success.' })
  } catch (e: unknown) {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `createSysUnit error: ${(e as string).toString()}` })
    return false
  }
}

export async function dropSysUnit(): Promise<void | false> {
  const sql: string = `
    DROP TABLE sys_unit
  `

  try {
    await client.query(sql)
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'dropSysUnit success.' })
  } catch (e: unknown) {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `dropSysUnit error: ${(e as string).toString()}` })
    return false
  }
}
