import { client } from '..'
import { querySuccessHandler } from './utils'
import Logger from '~/src/utils/logger'
import { genDateNowWithoutLocalOffset } from '../utils/helpers'

namespace system_bonus {
  export async function create(
    { title, base, amount, percentage, payment_method, payment_date_start, payment_date_end, hidden }: Record<string, any>
  ): Promise<Array<any> | false> {
    const sql = `
      INSERT INTO system_bonus(title, base, amount, percentage, payment_method, payment_date_start, payment_date_end, hidden)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `

    try {
      const { rows } = await client.query(sql, [title, base, amount, percentage, payment_method, payment_date_start, payment_date_end, hidden])
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
      FROM system_bonus
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

  export async function getById(id: string): Promise<Array<any> | false> {
    let sql = `
      SELECT *
      FROM system_bonus
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

  export async function update(
    { id, title, base, amount, percentage, payment_method, payment_date_start, payment_date_end, hidden }: Record<string, any>

  ): Promise<Array<any> | false> {
    const sql = `
      UPDATE system_bonus
      SET title = $2, base = $3, amount = $4, percentage = $5, payment_method = $6, payment_date_start = $7, payment_date_end = $8, hidden = $9, last_updated = $10
      WHERE id = $1
      RETURNING *
    `

    try {
      const { rows } = await client.query(sql, [id, title, base, amount, percentage, payment_method, payment_date_start, payment_date_end, hidden, genDateNowWithoutLocalOffset()])
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
      UPDATE system_bonus
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

export default system_bonus
