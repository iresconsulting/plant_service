import Logger from '~/src/utils/logger'
import { client } from '..'

export async function createSystemDepartments(): Promise<void | false> {
  const sql: string = `
    CREATE TABLE IF NOT EXISTS system_departments (
      id bigserial PRIMARY KEY,
      title text DEFAULT '',
      head_count text DEFAULT '',
      parent_department text DEFAULT '',
      parent_position text DEFAULT '',
      whitelist text DEFAULT '',
      is_position boolean DEFAULT false,
      is_department boolean DEFAULT false,
      hidden boolean DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `

  try {
    await client.query(sql)
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'createSystemDepartments success.' })
  } catch (e: unknown) {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `createSystemDepartments error: ${(e as string).toString()}` })
    return false
  }
}

export async function dropSystemDepartments(): Promise<void | false> {
  const sql: string = `
    DROP TABLE system_departments
  `

  try {
    await client.query(sql)
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'dropSystemDepartments success.' })
  } catch (e: unknown) {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `dropSystemDepartments error: ${(e as string).toString()}` })
    return false
  }
}
