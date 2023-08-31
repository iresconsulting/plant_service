import Logger from '~/src/utils/logger'
import { client } from '..'

export async function createSystemConfig(): Promise<void | false> {
  const sql: string = `
    CREATE TABLE IF NOT EXISTS system_config (
      id bigserial PRIMARY KEY,
      allow_whitelist boolean DEFAULT false,
      off_default text DEFAULT '',
      root_usr text DEFAULT '',
      root_pwd text DEFAULT '',
      pay_day_month text DEFAULT '',
      deduct_tax_income boolean DEFAULT false,
      hidden boolean DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `

  try {
    await client.query(sql)
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'createSystemConfig success.' })
  } catch (e: unknown) {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `createSystemConfig error: ${(e as string).toString()}` })
    return false
  }
}

export async function dropSystemConfig(): Promise<void | false> {
  const sql: string = `
    DROP TABLE system_config
  `

  try {
    await client.query(sql)
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'dropSystemConfig success.' })
  } catch (e: unknown) {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `dropSystemConfig error: ${(e as string).toString()}` })
    return false
  }
}
