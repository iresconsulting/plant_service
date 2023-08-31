import { client } from '..'
import { querySuccessHandler } from './utils'
import Logger from '~/src/utils/logger'
import { genDateNowWithoutLocalOffset } from '../utils/helpers'

namespace system_off_types {
  export async function create(
    title: string,
    unit: string,
    days: boolean,
    pay_type: string,
    hidden: boolean,
  ): Promise<Array<any> | false> {
    const sql = `
      INSERT INTO system_off_types(title, unit, days, pay_type, hidden)
      VALUES($1, $2, $3, $4, $5)
      RETURNING *
    `

    try {
      const { rows } = await client.query(sql, [title, unit, days, pay_type, hidden])
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
      FROM system_off_types
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
    unit: string,
    days: boolean,
    pay_type: string,
    hidden: boolean,
  ): Promise<Array<any> | false> {
    const sql = `
      UPDATE system_off_types
      SET title = $2, unit = $3, days = $4, pay_type = $5, hidden = $6, last_updated = $7
      WHERE id = $1
      RETURNING *
    `

    try {
      const { rows } = await client.query(sql, [id, title, unit, days, pay_type, hidden, genDateNowWithoutLocalOffset()])
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
      UPDATE system_off_types
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

export default system_off_types
