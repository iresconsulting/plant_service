import Logger from '~/src/utils/logger'
import { client } from '..'

export async function createRecordKpi(): Promise<void | false> {
  const sql: string = `
    CREATE TABLE IF NOT EXISTS record_kpi (
      id bigserial PRIMARY KEY,
      employee_id text DEFAULT '',
      basic_name text DEFAULT '',
      record_date text DEFAULT '',
      valid_date text DEFAULT '',
      types text DEFAULT '',
      tags text DEFAULT '',
      remark text DEFAULT '',
      auditor text DEFAULT '',
      amount_total text DEFAULT '',
      hidden boolean DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `

  try {
    await client.query(sql)
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'createRecordKpi success.' })
  } catch (e: unknown) {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `createRecordKpi error: ${(e as string).toString()}` })
    return false
  }
}

export async function dropRecordKpi(): Promise<void | false> {
  const sql: string = `
    DROP TABLE record_kpi
  `

  try {
    await client.query(sql)
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'dropRecordKpi success.' })
  } catch (e: unknown) {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `dropRecordKpi error: ${(e as string).toString()}` })
    return false
  }
}
