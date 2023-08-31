import { client } from '..'
import { BCRYPT_SALT_ROUNDS } from '../utils/constants'
import bcrypt from 'bcrypt'
import { genDateNowWithoutLocalOffset } from '../utils/helpers'
import { querySuccessHandler } from './utils'
import Logger from '~/src/utils/logger'

namespace Member {
  export async function create(
    { employee_id, basic_name, basic_govid, basic_birthday, system_username, system_password }: any
  ): Promise<Array<any> | false> {
    const sql = `
      INSERT INTO member(employee_id, basic_name, basic_govid, basic_birthday, system_username, system_password)
      VALUES($1, $2, $3, $4, $5, $6)
      RETURNING *
    `

    try {
      const find = await getByEmployeeId(employee_id)
      if (find !== false && find.length > 1) {
        throw new Error('employee_id already exists')
      }

      const pwdEncrypted = await bcrypt.hash(system_password as string, BCRYPT_SALT_ROUNDS)

      const { rows } = await client.query(sql, [
        employee_id, basic_name, basic_govid, basic_birthday, system_username, pwdEncrypted
      ])

      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `create Error ${(e as string).toString()}` })
      return false
    }
  }

  // TODO pagination logic
  export async function getAll(payload?: any): Promise<Array<any> | false> {
    const sql = `
      SELECT *
      FROM member
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
    const sql = `
      SELECT *
      FROM member
      WHERE id = $1
    `

    try {
      const { rows } = await client.query(sql, [id])
      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `getById Error ${(e as string).toString()}` })
      return false
    }
  }

  export async function getBySystemUsername(system_username: string): Promise<Array<any> | false> {
    const sql = `
      SELECT *
      FROM member
      WHERE system_username = $1
    `

    try {
      const { rows } = await client.query(sql, [system_username])
      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `getByUsername Error ${(e as string).toString()}` })
      return false
    }
  }

  export async function getByEmployeeId(employee_id: string): Promise<Array<any> | false> {
    const sql = `
      SELECT *
      FROM member
      WHERE employee_id = $1
    `

    try {
      const { rows } = await client.query(sql, [employee_id])
      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `getByEmployeeId Error ${(e as string).toString()}` })
      return false
    }
  }

  export async function getPasswordByEmployeeId(employee_id: string): Promise<Array<any> | false> {
    const sql = `
      SELECT password
      FROM member
      WHERE employee_id = $1
    `

    try {
      const { rows } = await client.query(sql, [employee_id])
      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `getPasswordByEmployeeId Error ${(e as string).toString()}` })
      return false
    }
  }

  export async function getByEmployeeSystemUsernameAndPwd(system_username: string, pwdPlainText: string): Promise<Array<any> | false> {
    const getUser = await getBySystemUsername(system_username)    
    if (!getUser || !getUser.length) {
      return false
    }
    const user = getUser[0]
    if (!user?.system_password) {
      return false
    }
    const isPwdValid = await bcrypt.compare(pwdPlainText, user?.system_password)    
    if (isPwdValid) {
      return getUser
    } else {
      return false
    }
  }

  export async function getPasswordBySystemUsername(system_username: string): Promise<Array<any> | false> {
    const sql = `
      SELECT password
      FROM member
      WHERE system_username = $1
    `

    try {
      const { rows } = await client.query(sql, [system_username])
      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `getPasswordBySystemUsername Error ${(e as string).toString()}` })
      return false
    }
  }

  export async function update({
    id,
    basic_name,
    basic_govid,
    basic_birthday,
    basic_city,
    basic_avatar,
    basic_nickname,
    basic_about,
    basic_email,
    basic_mobile,
    basic_address,
    basic_remark,
    education_level,
    education_institute,
    education_major,
    education_status,
    education_year,
    hr_department,
    hr_position,
    hr_shift,
    hr_off_default,
    hr_off_applied,
    hr_off_personnel,
    salary_fixed,
    salary_unit,
    salary_count_month,
    salary_applied_bonus,
    salary_start_date,
    system_username,
    system_password,
    system_roles,
    emergency_name,
    emergency_phone,
    emergency_relation,
    welfare_percent_company,
    welfare_percent_self,
    welfare_amount,
    health_welfare_amount,
    health_welfare_family_count,
  }: any): Promise<Array<any> | false> {
    const sql = `
      UPDATE member
      SET
        basic_name = $2,
        basic_govid = $3,
        basic_birthday = $4,
        basic_city = $5,
        basic_avatar = $6,
        basic_nickname = $7,
        basic_about = $8,
        basic_email = $9,
        basic_mobile = $10,
        basic_address = $11,
        basic_remark = $12,
        education_level = $13,
        education_institute = $14,
        education_major = $15,
        education_status = $16,
        education_year = $17,
        hr_department = $18,
        hr_position = $19,
        hr_shift = $20,
        hr_off_default = $21,
        hr_off_applied = $22,
        hr_off_personnel = $23,
        salary_fixed = $24,
        salary_unit = $25,
        salary_count_month = $26,
        salary_applied_bonus = $27,
        salary_start_date = $28,
        system_username = $29,
        system_password = $30,
        system_roles = $31,
        emergency_name = $32,
        emergency_phone = $33,
        emergency_relation = $34,
        last_updated = $35,
        welfare_percent_company = $36,
        welfare_percent_self = $37,
        welfare_amount = $38,
        health_welfare_amount = $39,
        health_welfare_family_count = $40,
      WHERE id = $1
      RETURNING *
    `
    let pwd = ''
    if (!system_password) {
      const user = await getPasswordBySystemUsername(system_username) || []
      if (user.length) {
        pwd = user[0].system_password
      }
    } else {
      pwd = await bcrypt.hash(system_password as string, BCRYPT_SALT_ROUNDS)
    }
  
    try {
      const { rows } = await client.query(sql, [
        id,
        basic_name,
        basic_govid,
        basic_birthday,
        basic_city,
        basic_avatar,
        basic_nickname,
        basic_about,
        basic_email,
        basic_mobile,
        basic_address,
        basic_remark,
        education_level,
        education_institute,
        education_major,
        education_status,
        education_year,
        hr_department,
        hr_position,
        hr_shift,
        hr_off_default,
        hr_off_applied,
        hr_off_personnel,
        salary_fixed,
        salary_unit,
        salary_count_month,
        salary_applied_bonus,
        salary_start_date,
        system_username,
        pwd,
        system_roles,
        emergency_name,
        emergency_phone,
        emergency_relation,
        genDateNowWithoutLocalOffset(),
        welfare_percent_company,
        welfare_percent_self,
        welfare_amount,
        health_welfare_amount,
        health_welfare_family_count,
      ])
      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `update Error ${(e as string).toString()}` })
      return false
    }
  }

  export async function updateSystemPassword({ id, system_password }: any): Promise<Array<any> | false> {
    const sql = `
      UPDATE member
      SET system_password = $2
      WHERE id = $1
      RETURNING *
    `

    try {
      const pwdEncrypted = await bcrypt.hash(system_password as string, BCRYPT_SALT_ROUNDS)
      const { rows } = await client.query(sql, [id, pwdEncrypted])
      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `updateSystemPassword Error ${(e as string).toString()}` })
      return false
    }
  }

  export async function updateAccountStatus({ id, account_status }: any): Promise<Array<any> | false> {
    const sql = `
      UPDATE member
      SET account_status = $2
      WHERE id = $1
      RETURNING *
    `

    try {
      const { rows } = await client.query(sql, [id, account_status])
      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `updateAccountStatus Error ${(e as string).toString()}` })
      return false
    }
  }

  export async function deleteById(id: string): Promise<Array<any> | false> {
    const sql = `
      DELETE FROM member
      WHERE id = $1
    `

    try {
      const { rows } = await client.query(sql, [id])
      return querySuccessHandler(rows)
    } catch (e: unknown) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `deleteById Error ${(e as string).toString()}` })
      return false
    }
  }
}

export default Member
