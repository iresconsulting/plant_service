import Logger from '~/src/utils/logger'
import { client } from '..'

export async function createMemberAdminTable(): Promise<void | false> {
  const sql: string = `
    CREATE TABLE IF NOT EXISTS member_admin (
      id bigserial PRIMARY KEY,
      no text DEFAULT '',
      name text DEFAULT '',
      username text DEFAULT '',
      password text DEFAULT '1234qwer',
      roles text DEFAULT '',
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
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'createMemberAdminTable success.' })
  } catch (e: unknown) {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `createMemberAdminTable error: ${(e as string).toString()}` })
    return false
  }
}

export async function dropMemberAdmimTable(): Promise<void | false> {
  const sql: string = `
    DROP TABLE member_admin
  `

  try {
    await client.query(sql)
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'dropMemberAdmimTable success.' })
  } catch (e: unknown) {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `dropMemberAdmimTable error: ${(e as string).toString()}` })
    return false
  }
}
