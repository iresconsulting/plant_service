import Logger from '~/src/utils/logger'
import { client } from '..'

export async function createRecordSalary(): Promise<void | false> {
  const sql: string = `
    CREATE TABLE IF NOT EXISTS record_salary (
      id bigserial PRIMARY KEY,
      employee_id text DEFAULT '',
      basic_name text DEFAULT '',
      title_date text DEFAULT '',
      setup_date text DEFAULT '',
      types text DEFAULT '',
      remark text DEFAULT '',
      auditor text DEFAULT '',
      amount_total text DEFAULT '',
      months text DEFAULT '',
      days text DEFAULT '',
      hours text DEFAULT '',
      hidden boolean DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `

  try {
    await client.query(sql)
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'createRecordSalary success.' })
  } catch (e: unknown) {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `createRecordSalary error: ${(e as string).toString()}` })
    return false
  }
}

export async function dropRecordSalary(): Promise<void | false> {
  const sql: string = `
    DROP TABLE record_salary
  `

  try {
    await client.query(sql)
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'dropRecordSalary success.' })
  } catch (e: unknown) {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `dropRecordSalary error: ${(e as string).toString()}` })
    return false
  }
}
