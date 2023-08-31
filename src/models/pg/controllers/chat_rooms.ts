import { client } from '..'
import { querySuccessHandler } from './utils'
import Logger from '~/src/utils/logger'
import { genDateNowWithoutLocalOffset } from '../utils/helpers'

export type ChatRoomsSchema = Partial<Record<string, any>>

namespace ChatRooms {
  export async function create(
    { recipient_one_id, recipient_one_name, recipient_two_id, recipient_two_name,  latest_message_content, latest_message_time, latest_message_sender_name, latest_message_sender_id, room_name, is_public, group_ids, icon }: ChatRoomsSchema
  ): Promise<Array<any> | false> {
    const sql = `
      INSERT INTO chat_rooms(recipient_one_id, recipient_one_name, recipient_two_id, recipient_two_name, latest_message_content, latest_message_time, latest_message_sender_name, latest_message_sender_id, room_name, is_public, group_ids, icon)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `

    try {
      const { rows } = await client.query(sql, [recipient_one_id, recipient_one_name, recipient_two_id, recipient_two_name,  latest_message_content, latest_message_time, latest_message_sender_name, latest_message_sender_id, room_name, is_public, group_ids, icon])
      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `create Error ${(e as string).toString()}` })
      return false
    }
  }

  export async function getIsPublic(): Promise<Array<any> | false> {
    const sql = `
      SELECT *
      FROM chat_rooms
      WHERE is_public = true AND hidden = false
      ORDER BY last_updated DESC
    `

    try {
      const { rows } = await client.query(sql, [])
      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `getIsPublic Error ${(e as string).toString()}` })
      return false
    }
  }

  export async function getByRecipientId(user_id: string): Promise<Array<any> | false> {
    const sql = `
      SELECT *
      FROM chat_rooms
      WHERE recipient_one_id = $1 OR recipient_two_id = $1
      ORDER BY last_updated DESC
    `

    try {
      const { rows } = await client.query(sql, [user_id])
      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `getByRecepientId Error ${(e as string).toString()}` })
      return false
    }
  }

  export async function update({ id, latest_message_content, latest_message_time, latest_message_sender_name, latest_message_sender_id, hidden, removed, room_name, group_ids, is_public, icon }: ChatRoomsSchema): Promise<Array<any> | false> {
    const sql = `
      UPDATE chat_rooms
      SET latest_message_content = $2, latest_message_time = $3, latest_message_sender_name = $4, latest_message_sender_id = $5, hidden = $6, removed = $7, room_name = $8, group_ids = $9, is_public = $10, icon = $11, last_updated = $12
      WHERE id = $1
      RETURNING *
    `

    try {
      const { rows } = await client.query(sql, [id, latest_message_content, latest_message_time, latest_message_sender_name, latest_message_sender_id, hidden, removed, room_name, group_ids, is_public, icon, genDateNowWithoutLocalOffset()])
      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `update Error ${(e as string).toString()}` })
      return false
    }
  }
}

export default ChatRooms
