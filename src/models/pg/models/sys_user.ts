import Logger from '~/src/utils/logger'
import { client } from '..'

export async function createSysUser(): Promise<void | false> {
  const sql: string = `
    CREATE TABLE IF NOT EXISTS sys_user (
      id bigserial PRIMARY KEY,
      name text DEFAULT '',
      email text DEFAULT '',
      phone text DEFAULT '',
      account text DEFAULT '',
      password text DEFAULT '',
      type text DEFAULT '',
      hidden boolean DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `

  try {
    await client.query(sql)
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'createSysUser success.' })
  } catch (e: unknown) {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `createSysUser error: ${(e as string).toString()}` })
    return false
  }
}

export async function dropSysUser(): Promise<void | false> {
  const sql: string = `
    DROP TABLE sys_user
  `

  try {
    await client.query(sql)
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'dropSysUser success.' })
  } catch (e: unknown) {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `dropSysUser error: ${(e as string).toString()}` })
    return false
  }
}
