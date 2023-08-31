import Logger from '~/src/utils/logger'
import { client } from '..'

export async function createChatMessagesTable(): Promise<void | false> {
  const sql: string = `
    CREATE TABLE IF NOT EXISTS chat_messages (
      id bigserial PRIMARY KEY,
      room_id text DEFAULT '',
      sender_id text DEFAULT '',
      sender_name text DEFAULT '',
      receiver_id text DEFAULT '',
      receiver_name text DEFAULT '',
      content text DEFAULT '',
      hidden boolean DEFAULT false,
      removed boolean DEFAULT false,
      reverted boolean  DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `

  try {
    await client.query(sql)
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'createChatMessagesTable success.' })
  } catch (e: unknown) {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `createChatMessagesTable error: ${(e as string).toString()}` })
    return false
  }
}

export async function dropChatMessagesTable(): Promise<void | false> {
  const sql: string = `
    DROP TABLE chat_messages
  `

  try {
    await client.query(sql)
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'dropChatMessagesTable success.' })
  } catch (e: unknown) {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `dropChatMessagesTable error: ${(e as string).toString()}` })
    return false
  }
}
