import { client } from '..'
import { querySuccessHandler } from './utils'
import Logger from '~/src/utils/logger'
import { genDateNowWithoutLocalOffset } from '../utils/helpers'

namespace system_shifts {
  export async function create(
    title: string,
    head_count: string,
    start_time: string,
    end_time: string,
    remark: string,
    hidden: boolean,
  ): Promise<Array<any> | false> {
    const sql = `
      INSERT INTO system_shifts(title, head_count_default, start_time, end_time, remark, hidden)
      VALUES($1, $2, $3, $4, $5, $6)
      RETURNING *
    `

    try {
      const { rows } = await client.query(sql, [title, head_count, start_time, end_time, remark, hidden])
      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `create Error ${(e as string).toString()}` })
      return false
    }
  }

  export async function getById(id: string): Promise<Array<any> | false> {
    let sql = `
      SELECT *
      FROM system_shifts
      WHERE id = $1
      ORDER BY last_updated DESC
    `

    try {
      const { rows } = await client.query(sql, [id])
      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `getById Error ${(e as string).toString()}` })
      return false
    }
  }

  export async function getAll(): Promise<Array<any> | false> {
    let sql = `
      SELECT *
      FROM system_shifts
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
    start_time: string,
    end_time: string,
    remark: string,
    hidden: boolean,
  ): Promise<Array<any> | false> {
    const sql = `
      UPDATE system_shifts
      SET title = $2, head_count_default = $3, start_time = $4, end_time = $5, remark = $6, hidden = $7, last_updated = $8
      WHERE id = $1
      RETURNING *
    `

    try {
      const { rows } = await client.query(sql, [id, title, head_count, start_time, end_time, remark, hidden, genDateNowWithoutLocalOffset()])
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
      UPDATE system_shifts
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

  export async function addHeadCount(
    id: string,
  ): Promise<Array<any> | false> {
    const sql = `
      UPDATE system_shifts
      SET head_count_default = head_count_default + 1, last_updated = $2
      WHERE id = $1
      RETURNING *
    `

    try {
      const { rows } = await client.query(sql, [id, genDateNowWithoutLocalOffset()])
      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `addHeadCount Error ${(e as string).toString()}` })
      return false
    }
  }
}

export default system_shifts
