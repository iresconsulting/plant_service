import { client } from '..'
import { querySuccessHandler } from './utils'
import Logger from '~/src/utils/logger'
import { genDateNowWithoutLocalOffset } from '../utils/helpers'

namespace system_config {
  export async function create(
    allow_whitelist: boolean,
    off_default: string,
    root_usr: string,
    root_pwd: string,
    pay_day_month: string,
    deduct_tax_income: boolean,
    hidden: boolean,
  ): Promise<Array<any> | false> {
    const sql = `
      INSERT INTO system_config(allow_whitelist, off_default, root_usr, root_pwd, pay_day_month, deduct_tax_income, hidden)
      VALUES($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `

    try {
      const { rows } = await client.query(sql, [allow_whitelist, off_default, root_usr, root_pwd, pay_day_month, deduct_tax_income, hidden])
      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `create Error ${(e as string).toString()}` })
      return false
    }
  }

  export async function getById(id: string): Promise<Array<any> | false> {
    let sql = `
      SELECT *
      FROM system_config
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
    id: string,
    allow_whitelist: boolean,
    off_default: string,
    root_usr: string,
    root_pwd: string,
    pay_day_month: string,
    deduct_tax_income: boolean,
    hidden: boolean,
  ): Promise<Array<any> | false> {
    const sql = `
      UPDATE system_config
      SET allow_whitelist = $2, off_default = $3, root_usr = $4, root_pwd = $5, pay_day_month = $6, deduct_tax_income = $7, hidden = $8, last_updated = $9
      WHERE id = $1
      RETURNING *
    `

    try {
      const { rows } = await client.query(sql, [id, allow_whitelist, off_default, root_usr, root_pwd, pay_day_month, deduct_tax_income, hidden, genDateNowWithoutLocalOffset()])
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
      UPDATE system_config
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

export default system_config
