import { client } from '..'
import { querySuccessHandler } from './utils'
import Logger from '~/src/utils/logger'
import { genDateNowWithoutLocalOffset } from '../utils/helpers'
import { BCRYPT_SALT_ROUNDS } from '../utils/constants'
import bcrypt from 'bcrypt'

namespace sys_user {
  export async function create(
    { name, email, phone, account, password, hidden }: Record<string, any>
  ): Promise<Array<any> | false> {
    const sql = `
      INSERT INTO sys_user(name, email, phone, account, password, hidden)
      VALUES($1, $2, $3, $4, $5, $6)
      RETURNING *
    `

    try {
      const user = await getByEmail(email)
      if (user && user.length > 0) {
        Logger.generateTimeLog({ label: Logger.Labels.PG, message: `create Error sys_user email already exist` })
        return false
      }
      const pwd_encrypted = await bcrypt.hash(password as string, BCRYPT_SALT_ROUNDS)
      const { rows } = await client.query(sql, [name, email, phone, account, pwd_encrypted, hidden])
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
    { id, name, email, phone, account, old_password, password, hidden }: Record<string, any>

  ): Promise<Array<any> | false> {
    const sql = `
      UPDATE sys_user
      SET name = $2, email = $3, phone = $4, account = $5, password = $6, hidden = $7, last_updated = $8
      WHERE id = $1
      RETURNING *
    `

    try {
      const user = await getById(id)
      if (!user || user.length === 0) {
        Logger.generateTimeLog({ label: Logger.Labels.PG, message: `update Error sys_user id does not exist` })
        return false
      }
      if (old_password === user[0].password) {

      } else {
        const old_password_match = await bcrypt.compare(old_password as string, user[0].password)
        if (!old_password_match) {
          Logger.generateTimeLog({ label: Logger.Labels.PG, message: `update Error sys_user password does not match` })
          return false
        }
      }
      const pwd_encrypted = await bcrypt.hash(password as string, BCRYPT_SALT_ROUNDS)
      const { rows } = await client.query(sql, [id, name, email, phone, account, pwd_encrypted, hidden, genDateNowWithoutLocalOffset()])
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
}

export default sys_user
