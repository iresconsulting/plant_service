import { client } from '..'
import { querySuccessHandler } from './utils'
import Logger from '~/src/utils/logger'
import { genDateNowWithoutLocalOffset } from '../utils/helpers'

namespace system_whitelist {
  export async function create(
    title: string,
    content: string,
    lat: string,
    lng: string,
    type: string,
    tags: string,
    hidden: boolean,
  ): Promise<Array<any> | false> {
    const sql = `
      INSERT INTO system_whitelist(title, content, lat, lng, type, tags, hidden)
      VALUES($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `

    try {
      const { rows } = await client.query(sql, [title, content, lat, lng, type, tags, hidden])
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
      FROM system_whitelist
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
      FROM system_whitelist
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
    title: string,
    content: string,
    lat: string,
    lng: string,
    type: string,
    tags: string,
    hidden: boolean,
  ): Promise<Array<any> | false> {
    const sql = `
      UPDATE system_whitelist
      SET title = $2, content = $3, lat = $4, lng = $5, type = $6, tags = $7, hidden = $8, last_updated = $9
      WHERE id = $1
      RETURNING *
    `

    try {
      const { rows } = await client.query(sql, [id, title, content, lat, lng, type, tags, hidden, genDateNowWithoutLocalOffset()])
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
      UPDATE system_whitelist
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

export default system_whitelist
