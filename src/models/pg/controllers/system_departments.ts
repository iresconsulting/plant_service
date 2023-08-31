import { client } from '..'
import { querySuccessHandler } from './utils'
import Logger from '~/src/utils/logger'
import { genDateNowWithoutLocalOffset } from '../utils/helpers'

namespace system_departments {
  export async function create(
    title: string,
    head_count: string,
    parent_department: string,
    parent_position: string,
    whitelist: string,
    is_position: boolean,
    is_department: boolean,
    hidden: boolean
  ): Promise<Array<any> | false> {
    const sql = `
      INSERT INTO system_departments(title, head_count, parent_department, parent_position, whitelist, is_position, is_department, hidden)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `

    try {
      const { rows } = await client.query(sql, [title, head_count, parent_department, parent_position, whitelist, is_position, is_department, hidden])
      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `create Error ${(e as string).toString()}` })
      return false
    }
  }

  // TODO pagination logic
  export async function getAll(): Promise<Array<any> | false> {
    let sql = `
      SELECT *
      FROM system_departments
      ORDER BY last_updated DESC
    `

    try {
      const { rows } = await client.query(sql, [])
      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `getAll Error ${(e as string).toString()}` })
      return false
    }
  }

  export async function update(
    id: string,
    title: string,
    head_count: string,
    parent_department: string,
    parent_position: string,
    whitelist: string,
    is_position: boolean,
    is_department: boolean,
    hidden: boolean
  ): Promise<Array<any> | false> {
    const sql = `
      UPDATE system_departments
      SET
        title = $2,
        head_count = $3,
        parent_department = $4,
        parent_position = $5,
        whitelist = $6,
        is_position = $7,
        is_department = $8,
        hidden = $9,
        last_updated = $10
      WHERE
       id = $1
      RETURNING *
    `

    try {
      const { rows } = await client.query(sql, [id, title, head_count, parent_department, parent_position, whitelist, is_position, is_department, hidden, genDateNowWithoutLocalOffset()])
      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `update Error ${(e as string).toString()}` })
      return false
    }
  }

  export async function hide(
    id: string,
    hidden: boolean,
  ): Promise<Array<any> | false> {
    const sql = `
      UPDATE system_departments
      SET hidden = $2, last_updated = $3
      WHERE id = $1
      RETURNING *
    `

    try {
      const { rows } = await client.query(sql, [id, hidden, genDateNowWithoutLocalOffset()])
      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `hide Error ${(e as string).toString()}` })
      return false
    }
  }
}

export default system_departments
