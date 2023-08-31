import Logger from '~/src/utils/logger'
import { client } from '..'

export async function createSystemWhitelist(): Promise<void | false> {
  const sql: string = `
    CREATE TABLE IF NOT EXISTS system_whitelist (
      id bigserial PRIMARY KEY,
      title text DEFAULT '',
      content text DEFAULT '',
      type text DEFAULT '',
      lat text DEFAULT '',
      lng text DEFAULT '',
      tags text DEFAULT '',
      hidden boolean DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `

  try {
    await client.query(sql)
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'createSystemWhitelist success.' })
  } catch (e: unknown) {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `createSystemWhitelist error: ${(e as string).toString()}` })
    return false
  }
}

export async function dropSystemWhitelist(): Promise<void | false> {
  const sql: string = `
    DROP TABLE system_whitelist
  `

  try {
    await client.query(sql)
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'dropSystemWhitelist success.' })
  } catch (e: unknown) {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `dropSystemWhitelist error: ${(e as string).toString()}` })
    return false
  }
}
