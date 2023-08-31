import { client } from '..'
import { querySuccessHandler } from './utils'
import Logger from '~/src/utils/logger'
import { genDateNowWithoutLocalOffset } from '../utils/helpers'

namespace hr_clock_record {
  export async function create(
    employee_id: string,
    date: string,
    system_username: string,
    status: string,
    time_in: string,
    time_out: boolean,
    remark: string,
  ): Promise<Array<any> | false> {
    const sql = `
      INSERT INTO hr_clock_record(employee_id, date, system_username, status, time_in, time_out, remark)
      VALUES($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `

    try {
      const { rows } = await client.query(sql, [employee_id, date, system_username, status, time_in, time_out, remark])
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
      FROM hr_clock_record
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

  export async function getByEid(employee_id: string): Promise<Array<any> | false> {
    let sql = `
      SELECT *
      FROM hr_clock_record
      WHERE employee_id = $1
      ORDER BY last_updated DESC
    `

    try {
      const { rows } = await client.query(sql, [employee_id])
      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `getAll Error ${(e as string).toString()}` })
      return false
    }
  }

  export async function getByEidAndExactDate(employee_id: string, date: string): Promise<Array<any> | false> {
    let sql = `
      SELECT *
      FROM hr_clock_record
      WHERE employee_id = $1 AND date = $2
      ORDER BY last_updated DESC
    `

    try {
      const { rows } = await client.query(sql, [employee_id, date])
      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `getAll Error ${(e as string).toString()}` })
      return false
    }
  }

  export async function getByEidAndRangeDate(employee_id: string, start_date: string, end_date: string): Promise<Array<any> | false> {
    let sql = `
      SELECT *
      FROM hr_clock_record
      WHERE employee_id = $1 AND date >= $2 AND date <= $3
      ORDER BY last_updated DESC
    `

    try {
      const { rows } = await client.query(sql, [employee_id, start_date, end_date])
      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `getAll Error ${(e as string).toString()}` })
      return false
    }
  }

  export async function update(
    id: string,
    employee_id: string,
    date: string,
    system_username: string,
    status: string,
    time_in: string,
    time_out: boolean,
    remark: string,
  ): Promise<Array<any> | false> {
    const sql = `
      UPDATE hr_clock_record
      SET employee_id = $2, date = $3, system_username = $4, status = $5, time_in = $6, time_out = $7, remark = $8, last_updated = $9
      WHERE id = $1
      RETURNING *
    `

    try {
      const { rows } = await client.query(sql, [id, employee_id, date, system_username, status, time_in, time_out, remark, genDateNowWithoutLocalOffset()])
      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `update Error ${(e as string).toString()}` })
      return false
    }
  }
}

export default hr_clock_record
