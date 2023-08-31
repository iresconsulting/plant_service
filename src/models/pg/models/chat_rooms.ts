import Logger from '~/src/utils/logger'
import { client } from '..'

export async function createChatRoomsTable(): Promise<void | false> {
  const sql: string = `
    CREATE TABLE IF NOT EXISTS chat_rooms (
      id bigserial PRIMARY KEY,
      recipient_one_id text DEFAULT '',
      recipient_one_name text DEFAULT '',
      recipient_two_id text DEFAULT '',
      recipient_two_name text DEFAULT '',
      latest_message_content text DEFAULT '',
      latest_message_time text DEFAULT '',
      latest_message_sender_name text DEFAULT '',
      latest_message_sender_id text DEFAULT '1',
      hidden boolean DEFAULT false,
      removed boolean DEFAULT false,
      room_name text DEFAULT '',
      is_public boolean DEFAULT false,
      group_ids text DEFAULT '',
      icon text DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `

  try {
    await client.query(sql)
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'createChatRoomsTable success.' })
  } catch (e: unknown) {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `createChatRoomsTable error: ${(e as string).toString()}` })
    return false
  }
}

export async function dropChatRoomsTable(): Promise<void | false> {
  const sql: string = `
    DROP TABLE chat_rooms
  `

  try {
    await client.query(sql)
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'dropChatRoomsTable success.' })
  } catch (e: unknown) {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `dropChatRoomsTable error: ${(e as string).toString()}` })
    return false
  }
}
