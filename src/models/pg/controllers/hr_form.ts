import { client } from '..'
import { genDateNowWithoutLocalOffset } from '../utils/helpers'
import { querySuccessHandler } from './utils'
import Logger from '~/src/utils/logger'

namespace hr_form {
  export async function create(
    { employee_id, system_username, apply_type, start_date, end_date, remark, is_approved, is_pending, is_rejected, approve_users, tags }: any
  ): Promise<Array<any> | false> {
    const sql = `
      INSERT INTO hr_form(employee_id, system_username, apply_type, start_date, end_date, remark, is_approved, is_pending, is_rejected, approve_users, tags)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `

    try {
      const { rows } = await client.query(sql, [
        employee_id, system_username, apply_type, start_date, end_date, remark, is_approved, is_pending, is_rejected, approve_users, tags
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
      FROM hr_form
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

  export async function update({ id, apply_type, start_date, end_date, remark, is_approved, is_pending, is_rejected, approve_users, tags }: any): Promise<Array<any> | false> {
    const sql = `
      UPDATE hr_form
      SET apply_type = $2, start_date = $3, end_date = $4, remark = $5, is_approved = $6, is_pending = $7, is_rejected = $8, approve_users = $9, tags = $10, last_updated = $11
      WHERE id = $1
      RETURNING *
    `

    try {
      const { rows } = await client.query(sql, [id, apply_type, start_date, end_date, remark, is_approved, is_pending, is_rejected, approve_users, tags, genDateNowWithoutLocalOffset()])
      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `update Error ${(e as string).toString()}` })
      return false
    }
  }

  export async function updateApprove({ id, approver_user_id }: any): Promise<Array<any> | false> {
    const sql = `
      UPDATE hr_form
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
      UPDATE hr_form
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
      DELETE FROM hr_form
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

export default hr_form
