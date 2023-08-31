import { client } from '..'
import { querySuccessHandler } from './utils'
import Logger from '~/src/utils/logger'
import { genDateNowWithoutLocalOffset } from '../utils/helpers'
import moment from 'moment'

export type ChatMessagesSchema = Partial<Record<string, any>>

namespace ChatMessages {
  export async function create(
    { room_id, sender_id, sender_name, receiver_id,  receiver_name, content }: ChatMessagesSchema
  ): Promise<Array<any> | false> {
    const sql = `
      INSERT INTO chat_messages(room_id, sender_id, sender_name, receiver_id,  receiver_name, content)
      VALUES($1, $2, $3, $4, $5, $6)
      RETURNING *
    `

    try {
      const { rows } = await client.query(sql, [room_id, sender_id, sender_name, receiver_id,  receiver_name, content])
      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `create Error ${(e as string).toString()}` })
      return false
    }
  }

  export async function getByRoomId(room_id: string, date_limit: number): Promise<Array<any> | false> {
    const sql = `
      SELECT *
      FROM chat_messages
      WHERE room_id = $1 AND created_at >= $2
      ORDER BY last_updated DESC
    `

    const date_limit_iso = moment().subtract(date_limit, 'days').toISOString(false)

    try {
      const { rows } = await client.query(sql, [room_id, date_limit_iso])
      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `getByRoomId Error ${(e as string).toString()}` })
      return false
    }
  }

  export async function update({ id, content, hidden, removed, reverted }: ChatMessagesSchema): Promise<Array<any> | false> {
    const sql = `
      UPDATE chat_messages
      SET content = $2, hidden = $3, removed = $4, reverted = $5, last_updated = $6
      WHERE id = $1
      RETURNING *
    `

    try {
      const { rows } = await client.query(sql, [id, content, hidden, removed, reverted, genDateNowWithoutLocalOffset()])
      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `update Error ${(e as string).toString()}` })
      return false
    }
  }
}

export default ChatMessages
