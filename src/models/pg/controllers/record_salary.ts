import { client } from '..'
import { querySuccessHandler } from './utils'
import Logger from '~/src/utils/logger'
import { genDateNowWithoutLocalOffset } from '../utils/helpers'

namespace record_salary {
  export async function create(
    { employee_id, basic_name, title_date, setup_date, types, remark, hidden, auditor, month, days, hours, amount_total }: Record<string, any>
  ): Promise<Array<any> | false> {
    const sql = `
      INSERT INTO record_salary(employee_id, basic_name, title_date, setup_date, types, remark, hidden, auditor, month, days, hours, amount_total)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `

    try {
      const { rows } = await client.query(sql, [employee_id, basic_name, title_date, setup_date, types, remark, hidden, auditor, month, days, hours, amount_total])
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
      FROM record_salary
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

  export async function getByEid(eid: string): Promise<Array<any> | false> {
    let sql = `
      SELECT *
      FROM record_salary
      WHERE employee_id = $1
      ORDER BY last_updated DESC
    `

    try {
      const { rows } = await client.query(sql, [eid])
      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `getByEid Error ${(e as string).toString()}` })
      return false
    }
  }

  export async function update(
    { id, employee_id, basic_name, title_date, setup_date, types, remark, hidden, auditor, month, days, hours, amount_total }: Record<string, any>

  ): Promise<Array<any> | false> {
    const sql = `
      UPDATE record_salary
      SET employee_id = $2, basic_name = $3, title_date = $4, setup_date = $5, types = $6, remark = $7, hidden = $8, last_updated = $9, auditor = $10, month = $11, days = $12, hours = $13, amount_total = $14
      WHERE id = $1
      RETURNING *
    `

    try {
      const { rows } = await client.query(sql, [id, employee_id, basic_name, title_date, setup_date, types, remark, hidden, genDateNowWithoutLocalOffset(), auditor, month, days, hours, amount_total])
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
      UPDATE record_salary
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

export default record_salary
