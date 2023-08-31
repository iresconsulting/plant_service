import Logger from '~/src/utils/logger'
import { client } from '..'

export async function createMemberTable(): Promise<void | false> {
  const sql: string = `
    CREATE TABLE IF NOT EXISTS member (
      id bigserial PRIMARY KEY,
      employee_id text DEFAULT '',
      basic_name text DEFAULT '',
      basic_govid text DEFAULT '',
      basic_birthday text DEFAULT '',
      basic_city text DEFAULT '',
      basic_avatar text DEFAULT '',
      basic_nickname text DEFAULT '',
      basic_about text DEFAULT '',
      basic_email text DEFAULT '',
      basic_mobile text DEFAULT '',
      basic_address text DEFAULT '',
      basic_remark text DEFAULT '',
      education_level text DEFAULT '',
      education_institute text DEFAULT '',
      education_major text DEFAULT '',
      education_status text DEFAULT '',
      education_year text DEFAULT '',
      hr_department text DEFAULT '',
      hr_position text DEFAULT '',
      hr_shift text DEFAULT '',
      hr_off_default text DEFAULT '',
      hr_off_applied text DEFAULT '',
      hr_off_personnel text DEFAULT '',
      salary_fixed text DEFAULT '',
      salary_unit text DEFAULT '',
      salary_count_month text DEFAULT '',
      salary_applied_bonus text DEFAULT '',
      salary_start_date text DEFAULT '',
      welfare_percent_company text DEFAULT '',
      welfare_percent_self text DEFAULT '',
      welfare_amount text DEFAULT '',
      health_welfare_amount text DEFAULT '',
      health_welfare_family_count text DEFAULT '',
      system_username text DEFAULT '',
      system_password text DEFAULT '',
      system_roles text DEFAULT '',
      emergency_name text DEFAULT '',
      emergency_phone text DEFAULT '',
      emergency_relation text DEFAULT '',
      access_token text DEFAULT '',
      refresh_token text DEFAULT '',
      account_status text DEFAULT '1',
      last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `

  try {
    await client.query(sql)
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'createMemberTable success.' })
  } catch (e: unknown) {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `createMemberTable error: ${(e as string).toString()}` })
    return false
  }
}

export async function dropMemberTable(): Promise<void | false> {
  const sql: string = `
    DROP TABLE member
  `

  try {
    await client.query(sql)
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'dropMemberTable success.' })
  } catch (e: unknown) {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `dropMemberTable error: ${(e as string).toString()}` })
    return false
  }
}
