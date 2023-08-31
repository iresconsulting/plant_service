import { client } from '..'
import { genDateNowWithoutLocalOffset } from '../utils/helpers'
import { querySuccessHandler } from './utils'
import Logger from '~/src/utils/logger'

namespace hr_shift {
  export async function create(
    { employee_id, system_username, date, shift_title, start_time, end_time, remark, is_approved, is_pending, is_rejected, approve_users, tags }: any
  ): Promise<Array<any> | false> {
    const sql = `
      INSERT INTO hr_shift(employee_id, system_username, date, shift_title, start_time, end_time, remark, is_approved, is_pending, is_rejected, approve_users, tags)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `

    try {
      const { rows } = await client.query(sql, [
        employee_id, system_username, date, shift_title, start_time, end_time, remark, is_approved, is_pending, is_rejected, approve_users, tags
      ])

      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `create Error ${(e as string).toString()}` })
      return false
    }
  }

  export async function getByEid(employee_id: string): Promise<Array<any> | false> {
    const sql = `
      SELECT *
      FROM hr_shift
      WHERE employee_id = $1
    `

    try {
      const { rows } = await client.query(sql, [employee_id])
      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `getByEid Error ${(e as string).toString()}` })
      return false
    }
  }

  export async function update({ id,  date, shift_title, start_time, end_time, remark, is_approved, is_pending, is_rejected, approve_users, tags }: any): Promise<Array<any> | false> {
    const sql = `
      UPDATE hr_shift
      SET date = $2, shift_title = $3, start_time = $4, end_time = $5, remark = $6, is_approved = $7, is_pending = $8, is_rejected = $9, approve_users = $10, tags = $11, last_updated = $12
      WHERE id = $1
      RETURNING *
    `

    try {
      const { rows } = await client.query(sql, [id, date, shift_title, start_time, end_time, remark, is_approved, is_pending, is_rejected, approve_users, tags, genDateNowWithoutLocalOffset()])
      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `update Error ${(e as string).toString()}` })
      return false
    }
  }

  export async function updateApprove({ id, approver_user_id }: any): Promise<Array<any> | false> {
    const sql = `
      UPDATE hr_shift
      SET is_approved = true, approve_users = ARRAY_APPEND(approve_users, $2), last_updated = $3
      WHERE id = $1
      RETURNING *
    `

    try {
      const { rows } = await client.query(sql, [id, approver_user_id, genDateNowWithoutLocalOffset()])
      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `update Error ${(e as string).toString()}` })
      return false
    }
  }

  export async function updateReject({ id, approver_user_id }: any): Promise<Array<any> | false> {
    const sql = `
      UPDATE hr_shift
      SET is_rejected = true, is_approved = false, approve_users = ARRAY_APPEND(approve_users, $2), last_updated = $3
      WHERE id = $1
      RETURNING *
    `

    try {
      const { rows } = await client.query(sql, [id, approver_user_id, genDateNowWithoutLocalOffset()])
      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `update Error ${(e as string).toString()}` })
      return false
    }
  }

  export async function deleteById(id: string): Promise<Array<any> | false> {
    const sql = `
      DELETE FROM hr_shift
      WHERE id = $1
    `

    try {
      const { rows } = await client.query(sql, [id])
      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `deleteById Error ${(e as string).toString()}` })
      return false
    }
  }
}

export default hr_shift
