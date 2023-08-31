import Logger from '~/src/utils/logger'
import { client } from '..'

export async function createSystemBonus(): Promise<void | false> {
  const sql: string = `
    CREATE TABLE IF NOT EXISTS system_bonus (
      id bigserial PRIMARY KEY,
      title text DEFAULT '',
      base text DEFAULT '',
      amount text DEFAULT '',
      percentage text DEFAULT '',
      payment_method text DEFAULT '',
      payment_date_start text DEFAULT '',
      payment_date_end text DEFAULT '',
      hidden boolean DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `

  try {
    await client.query(sql)
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'createSystemBonus success.' })
  } catch (e: unknown) {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `createSystemBonus error: ${(e as string).toString()}` })
    return false
  }
}

export async function dropSystemBonus(): Promise<void | false> {
  const sql: string = `
    DROP TABLE system_bonus
  `

  try {
    await client.query(sql)
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'dropSystemBonus success.' })
  } catch (e: unknown) {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `dropSystemBonus error: ${(e as string).toString()}` })
    return false
  }
}
