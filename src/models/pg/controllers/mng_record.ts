import { client } from '..'
import { querySuccessHandler } from './utils'
import Logger from '~/src/utils/logger'
import { genDateNowWithoutLocalOffset } from '../utils/helpers'

namespace mng_record {
  export async function create(
    { time, location, agriculture, symptoms, body_part, raised_method, user_name, user_phone, user_email, status, response, hidden }: Record<string, any>
  ): Promise<Array<any> | false> {
    const sql = `
      INSERT INTO mng_record(time, location, agriculture, symptoms, body_part, raised_method, user_name, user_phone, user_email, status, response, hidden)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `

    try {
      const { rows } = await client.query(sql, [time, location, agriculture, symptoms, body_part, raised_method, user_name, user_phone, user_email, status, response, hidden])
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
      FROM mng_record
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
      FROM mng_record
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
    { id, time, location, agriculture, symptoms, body_part, raised_method, user_name, user_phone, user_email, status, response, hidden, expert_name }: Record<string, any>

  ): Promise<Array<any> | false> {
    const sql = `
      UPDATE mng_record
      SET time = $2, location = $3, agriculture = $4, symptoms = $5, body_part = $6, raised_method = $7, user_name = $8, user_phone = $9, user_email = $10, hidden = $11, status = $12, response = $13, last_updated = $14, expert_name = $15
      WHERE id = $1
      RETURNING *
    `

    try {
      const { rows } = await client.query(sql, [id, time, location, agriculture, symptoms, body_part, raised_method, user_name, user_phone, user_email, status, response, hidden, genDateNowWithoutLocalOffset(), expert_name])
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
      UPDATE mng_record
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

  export async function update_status(
    id: string,
    status: string,
  ): Promise<Array<any> | false> {
    const sql = `
      UPDATE mng_record
      SET status = $2, last_updated = $3
      WHERE id = $1
      RETURNING *
    `

    try {
      const { rows } = await client.query(sql, [id, status, genDateNowWithoutLocalOffset()])
      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `update_status Error ${(e as string).toString()}` })
      return false
    }
  }

  export async function update_expert_name(
    id: string,
    expert_name: string,
  ): Promise<Array<any> | false> {
    const sql = `
      UPDATE mng_record
      SET expert_name = $2, last_updated = $3
      WHERE id = $1
      RETURNING *
    `

    try {
      const { rows } = await client.query(sql, [id, expert_name, genDateNowWithoutLocalOffset()])
      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `update_expert_name Error ${(e as string).toString()}` })
      return false
    }
  }

  export async function update_response(
    id: string,
    response: string,
  ): Promise<Array<any> | false> {
    const sql = `
      UPDATE mng_record
      SET response = $2, last_updated = $3
      WHERE id = $1
      RETURNING *
    `

    try {
      const { rows } = await client.query(sql, [id, response, genDateNowWithoutLocalOffset()])
      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `update_response Error ${(e as string).toString()}` })
      return false
    }
  }

  export async function update_video_url(
    id: string,
    video_url: string,
  ): Promise<Array<any> | false> {
    const sql = `
      UPDATE mng_record
      SET video_url = $2, last_updated = $3
      WHERE id = $1
      RETURNING *
    `

    try {
      const { rows } = await client.query(sql, [id, video_url, genDateNowWithoutLocalOffset()])
      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `update_video_url Error ${(e as string).toString()}` })
      return false
    }
  }
}

export default mng_record
