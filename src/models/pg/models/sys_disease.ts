import Logger from '~/src/utils/logger'
import { client } from '..'

export async function createSysDisease(): Promise<void | false> {
  const sql: string = `
    CREATE TABLE IF NOT EXISTS sys_disease (
      id bigserial PRIMARY KEY,
      name text DEFAULT '',
      sickness text DEFAULT '',
      bug text DEFAULT '',
      symptoms text DEFAULT '',
      body_part text DEFAULT '',
      hidden boolean DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `

  try {
    await client.query(sql)
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'createSysDisease success.' })
  } catch (e: unknown) {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `createSysDisease error: ${(e as string).toString()}` })
    return false
  }
}

export async function dropSysDisease(): Promise<void | false> {
  const sql: string = `
    DROP TABLE sys_disease
  `

  try {
    await client.query(sql)
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'dropSysDisease success.' })
  } catch (e: unknown) {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `dropSysDisease error: ${(e as string).toString()}` })
    return false
  }
}
