import { client } from '..'
import { querySuccessHandler } from './utils'
import Logger from '~/src/utils/logger'
import { genDateNowWithoutLocalOffset } from '../utils/helpers'
import { BCRYPT_SALT_ROUNDS } from '../utils/constants'
import bcrypt from 'bcrypt'

namespace sys_user {
  export async function create(
    { name, email, phone, account, password, hidden, type }: Record<string, any>
  ): Promise<Array<any> | false> {
    const sql = `
      INSERT INTO sys_user(name, email, phone, account, password, hidden, type)
      VALUES($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `

    try {
      const user = await getByEmail(email)
      if (user && user.length > 0) {
        Logger.generateTimeLog({ label: Logger.Labels.PG, message: `create Error sys_user email already exist` })
        return false
      }
      const pwd_encrypted = await bcrypt.hash(password as string, BCRYPT_SALT_ROUNDS)
      const { rows } = await client.query(sql, [name, email, phone, account, pwd_encrypted, hidden, type])
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
      FROM sys_user
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
      FROM sys_user
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

  export async function getByEmail(email: string): Promise<Array<any> | false> {
    let sql = `
      SELECT *
      FROM sys_user
      WHERE email = $1
      ORDER BY last_updated DESC
    `

    try {
      const { rows } = await client.query(sql, [email])
      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `getByEmail Error ${(e as string).toString()}` })
      return false
    }
  }

  export async function getByAccount(account: string): Promise<Array<any> | false> {
    let sql = `
      SELECT *
      FROM sys_user
      WHERE account = $1
      ORDER BY last_updated DESC
    `

    try {
      const { rows } = await client.query(sql, [account])
      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `getByAccount Error ${(e as string).toString()}` })
      return false
    }
  }

  export async function update(
    { id, name, email, phone, account, hidden }: Record<string, any>

  ): Promise<Array<any> | false> {
    const sql = `
      UPDATE sys_user
      SET name = $2, email = $3, phone = $4, account = $5, hidden = $6, last_updated = $7
      WHERE id = $1
      RETURNING *
    `

    try {
      const { rows } = await client.query(sql, [id, name, email, phone, account, hidden, genDateNowWithoutLocalOffset()])
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
      UPDATE sys_user
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

  export async function update_password(
    id: string,
    // old_password: string,
    password: string,
  ): Promise<Array<any> | false> {
    const sql = `
      UPDATE sys_user
      SET password = $2, last_updated = $3
      WHERE id = $1
      RETURNING *
    `

    try {
      const pwd_encrypted = await bcrypt.hash(password as string, BCRYPT_SALT_ROUNDS)
      const { rows } = await client.query(sql, [id, pwd_encrypted, genDateNowWithoutLocalOffset()])
      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `update_password Error ${(e as string).toString()}` })
      return false
    }
  }
}

export default sys_user
