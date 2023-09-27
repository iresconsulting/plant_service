import express, { Router, Request, Response } from 'express'
import appRoot from 'app-root-path'
import fs from 'fs/promises'
import moment from 'moment'
import jwt from 'jsonwebtoken'
// import bcrypt from 'bcrypt'
import transporter from '../utils/email'
import Uploader from '../utils/multer'
import Firebase from '../utils/firebase'
import { HttpRes } from './utils/http'
import { pgArrToArr } from '../models/pg/utils/helpers'
import { createMemberTable, dropMemberTable } from '../models/pg/models/member'
import { createUserRoleTable, dropUserRoleTable } from '../models/pg/models/user_role'
import { createMemberAdminTable, dropMemberAdmimTable } from '../models/pg/models/member_admin'
import { createSystemConfig, dropSystemConfig } from '../models/pg/models/system_config'
import { createSysAgriculture, dropSysAgriculture } from '../models/pg/models/sys_agriculture'
import { createSysDisease, dropSysDisease } from '../models/pg/models/sys_disease'
import { createSysUser, dropSysUser } from '../models/pg/models/sys_user'
import { createSysUnit, dropSysUnit } from '../models/pg/models/sys_unit'
import { createMngExamination, dropMngExamination } from '../models/pg/models/mng_examination'
import { createMngRecord, dropMngRecord } from '../models/pg/models/mng_record'
import Member from '../models/pg/controllers/member'
import MemberAdmin from '../models/pg/controllers/member_admin'
import UserRole from '../models/pg/controllers/user_role'
import system_config from '../models/pg/controllers/system_config'
import authMiddleware from './middleware/auth'
import sys_agriculture from '../models/pg/controllers/sys_agriculture'
import sys_disease from '../models/pg/controllers/sys_disease'
import sys_unit from '../models/pg/controllers/sys_unit'
import sys_user from '../models/pg/controllers/sys_user'
import mng_record from '../models/pg/controllers/mng_record'
import { convertVideo } from '../utils/ffmpeg'
import postFileBucket from '../utils/gcp/storage'

const router: Router = express.Router()

router.get('/health', (req, res) => {
  return HttpRes.send200(res)
})

router.get('/db/init', async (req, res) => {
  try {
    if (process.env.ALLOW_DB_INIT !== 'true') {
      return HttpRes.send401(res)
    }
    console.log('---tx start---');
    // drop
    await dropMemberTable()
    await dropMemberAdmimTable()
    await dropSystemConfig()
    await dropUserRoleTable()
    await dropSysAgriculture()
    await dropSysDisease()
    await dropSysUnit()
    await dropSysUser()
    await dropMngExamination()
    await dropMngRecord()
    // create
    const create_res = await Promise.all([
      createMemberAdminTable(),
      createMemberTable(),
      createSystemConfig(),
      createUserRoleTable(),
      createSysAgriculture(),
      createSysDisease(),
      createSysUnit(),
      createSysUser(),
      createMngExamination(),
      createMngRecord(),
    ])
    console.log('create_res', create_res);
    const config = await system_config.create('root', '1234qwer', false)
    // const member = await Member.create({
    //   employee_id: 'user',
    //   basic_name: 'user',
    //   basic_govid: 'A123456789',
    //   basic_birthday: '1970-01-01',
    //   system_username: 'user',
    //   system_password: '1234qwer',
    // })
    console.log('config', config);
    // console.log('member', member);
    console.log('---tx end---');
    return HttpRes.send200(res)
  } catch(e) {
    console.log('e', e);
    return HttpRes.send500(res, String(e))
  }
})

router.post('/file/uploads', Uploader.instance.single('video'), async (req, res) => {
  try {
    const { convert, video_url } = req.body
    if (Boolean(convert) === true && video_url) {
      const name = `ffmpeg_${moment().format('YYYYMMDDHHmmss')}`
      const local_url = `../uploads/${name}.mp4`
      // convertVideo(video_url, name, HttpRes.send200, [res, 'success', { video_url: `${name}.mp4`, original_video_url: video_url }])
      convertVideo(video_url, name, async (err: string) => {
        if (err) {
          return HttpRes.send500(res, err)
        }
        const bucket_url = await postFileBucket(`../uploads/${name}.mp4`)
        return HttpRes.send200(res, 'success', {
          video_url: bucket_url,
          original_video_url: video_url,
          local_url
        })
      })
    } else {
      return HttpRes.send200(res, 'success', req?.file || false)
    }
  } catch(e) {
    return HttpRes.send500(res, String(e))
  }
})

router.get('/version', async (req: Request, res: Response) => {
  const _package = await fs.readFile(`${appRoot}/package.json`, 'utf-8')
  const jsonPackage = JSON.parse(_package)
  HttpRes.send200(res, null, { version: jsonPackage.version })
  return
})

// get sys agriculture
router.get('/sys/agriculture', async (req, res) => {
  try {
    const { id } = req.query
    const _id = String(id)
    let list = []
    if (_id !== 'undefined') {
      list = await sys_agriculture.getById(_id) || []
    } else {
      list = await sys_agriculture.getAll() || []
    }
    list.map((v) => {
      return {
        ...v,
      }
    })
    return HttpRes.send200(res, 'success', list)
  } catch(e) {
    return HttpRes.send500(res)
  }
})

// create, update sys agriculture
router.post('/sys/agriculture', authMiddleware, async (req, res) => {
  try {
    const { id, name, species, hidden } = req.body
    if (id) {
      const list = await sys_agriculture.update({ id, name, species, hidden })
      return HttpRes.send200(res, 'success', list)
    } else {
      const list = await sys_agriculture.create({ name, species, hidden })
      return HttpRes.send200(res, 'success', list)
    }
  } catch(e) {
    return HttpRes.send500(res, String(e))
  }
})

// get sys disease
router.get('/sys/disease', async (req, res) => {
  try {
    const { id } = req.query
    const _id = String(id)
    let list = []
    if (_id !== 'undefined') {
      list = await sys_disease.getById(_id) || []
    } else {
      list = await sys_disease.getAll() || []
    }
    list.map((v) => {
      return {
        ...v,
      }
    })
    return HttpRes.send200(res, 'success', list)
  } catch(e) {
    return HttpRes.send500(res)
  }
})

// create, update sys disease
router.post('/sys/disease', authMiddleware, async (req, res) => {
  try {
    const { id, name, sickness, bug, symptoms, body_part, hidden } = req.body
    if (id) {
      const list = await sys_disease.update({ id, name, sickness, bug, symptoms, body_part, hidden })
      return HttpRes.send200(res, 'success', list)
    } else {
      const list = await sys_disease.create({ name, sickness, bug, symptoms, body_part, hidden })
      return HttpRes.send200(res, 'success', list)
    }
  } catch(e) {
    return HttpRes.send500(res, String(e))
  }
})

// get sys unit
router.get('/sys/unit', async (req, res) => {
  try {
    const { id } = req.query
    const _id = String(id)
    let list = []
    if (_id !== 'undefined') {
      list = await sys_unit.getById(_id) || []
    } else {
      list = await sys_unit.getAll() || []
    }
    list.map((v) => {
      return {
        ...v,
      }
    })
    return HttpRes.send200(res, 'success', list)
  } catch(e) {
    return HttpRes.send500(res)
  }
})

// create, update sys unit
router.post('/sys/unit', authMiddleware, async (req, res) => {
  try {
    const { id, name, location, contact, phone, hidden } = req.body
    if (id) {
      const list = await sys_unit.update({ id, name, location, contact, phone, hidden })
      return HttpRes.send200(res, 'success', list)
    } else {
      const list = await sys_unit.create({ name, location, contact, phone, hidden })
      return HttpRes.send200(res, 'success', list)
    }
  } catch(e) {
    return HttpRes.send500(res, String(e))
  }
})

// get sys user
router.get('/sys/user', authMiddleware, async (req, res) => {
  try {
    const { id } = req.query
    const _id = String(id)
    let list = []
    if (_id !== 'undefined') {
      list = await sys_user.getById(_id) || []
    } else {
      list = await sys_user.getAll() || []
    }
    list.map((v) => {
      return {
        ...v,
      }
    })
    return HttpRes.send200(res, 'success', list)
  } catch(e) {
    return HttpRes.send500(res)
  }
})

// create, update sys user
router.post('/sys/user', authMiddleware, async (req, res) => {
  try {
    const { action_type, id, name, email, phone, account, old_password, password, hidden, type } = req.body
    if (action_type === 'hidden' && id && hidden !== undefined) {
      const list = await sys_user.hide(id, hidden)
      return HttpRes.send200(res, 'success', list)
    } else if (action_type === 'update_password' && id && password !== undefined) {
      const list = await sys_user.update_password(id, password)
      return HttpRes.send200(res, 'success', list)
    }  else if (id) {
      const list = await sys_user.update({ id, name, email, phone, account, hidden })
      return HttpRes.send200(res, 'success', list)
    } else {
      const list = await sys_user.create({ name, email, phone, account, password, hidden, type })
      return HttpRes.send200(res, 'success', list)
    }
  } catch(e) {
    return HttpRes.send500(res, String(e))
  }
})

// login sys user
router.post('/sys/user/login', authMiddleware, async (req, res) => {
  try {
    const { account, password } = req.body
    const list = await sys_user.getByAccount(account)
    if (list && list.length) {
      const user = list[0]
      const token = jwt.sign(
        { ...user },
        TOKEN_KEY,
        {
          expiresIn: "7d",
        }
      );
      const payload = {
        ...user,
        token,
      }
      delete payload?.password
      return HttpRes.send200(res, 'success', payload)
      // if (!user.hidden) {
      //   const match = await bcrypt.compare(password, user?.password)
      //   if (match) {
      //     const token = jwt.sign(
      //       { ...user },
      //       TOKEN_KEY,
      //       {
      //         expiresIn: "7d",
      //       }
      //     );
      //     const payload = {
      //       ...user,
      //       token,
      //     }
      //     delete payload?.password
      //     return HttpRes.send200(res, 'success', payload)
      //   }
      // }
    }
    throw new Error('not authenticated')
  } catch(e) {
    return HttpRes.send500(res, String(e))
  }
})

// verify sys user
router.get('/sys/user/verification', async (req, res) => {
  try {
    const authorization = req.headers['authorization'] || ''
    const split = authorization?.split('Bearer ')
    if (split?.length === 2) {
      const token = split[1]
      const decoded = jwt.verify(token, TOKEN_KEY);
      // @ts-ignore
      const getUser = await sys_user.getById(decoded?.id)
      if (getUser && getUser.length) {
        delete getUser[0]?.password
        return HttpRes.send200(res, 'success', { ...getUser[0] })
      }
    }
    return HttpRes.send400(res)
  } catch(e) {
    return HttpRes.send500(res, String(e))
  }
})

// get mng record
router.get('/mng/record', async (req, res) => {
  try {
    const { id } = req.query
    const _id = String(id)
    let list = []
    if (_id !== 'undefined') {
      list = await mng_record.getById(_id) || []
    } else {
      list = await mng_record.getAll() || []
    }
    list.map((v) => {
      return {
        ...v,
      }
    })
    return HttpRes.send200(res, 'success', list)
  } catch(e) {
    return HttpRes.send500(res)
  }
})

const SENDER_EMAIL = 'bettrader1003@gmail.com'

// create, update mng record
router.post('/mng/record', async (req, res) => {
  try {
    const { action_type, id, time, location, agriculture, symptoms, body_part, raised_method, user_name, user_phone, user_email, status, response, hidden, video_url, expert_name = '' } = req.body
    if (action_type === 'status' && id && status !== undefined && response !== undefined) {
      await Promise.all([
        mng_record.update_expert_name(id, expert_name),
        mng_record.update_status(id, status)
      ])
      const list = await mng_record.update_response(id, response)
      if (list && list.length) {
        const record = list[0]
        if (record?.user_email) {
          try {
            await transporter.sendMail({
              from: SENDER_EMAIL,
              sender: SENDER_EMAIL,
              to: record?.user_email,
              subject: `病蟲害診斷結果 - #${id}`,
              html: `<div style="font-size: 16px; color: #000000;line-height: 1.5;">${record?.response}</div>`,
              // cc: SENDER_EMAIL,
            })
          } catch {

          } finally {
            
          }
        }
        return HttpRes.send200(res, 'success', list)
      }
      throw new Error('update error')
    } else if (action_type === 'video' && id) {
      const list = await mng_record.update_video_url(id, video_url)
      return HttpRes.send200(res, 'success', list)
    } else if (id) {
      const list = await mng_record.update({ id, time, location, agriculture, symptoms, body_part, raised_method, user_name, user_phone, user_email, hidden, expert_name })
      return HttpRes.send200(res, 'success', list)
    } else {
      const list = await mng_record.create({time, location, agriculture, symptoms, body_part, raised_method, user_name, user_phone, user_email, hidden })
      return HttpRes.send200(res, 'success', list)
    }
  } catch(e) {
    return HttpRes.send500(res, String(e))
  }
})

// get roles
router.get('/roles', authMiddleware, async (req, res) => {
  try {
    const list = await UserRole.getAll()
    return HttpRes.send200(res, 'success', list)
   } catch {
    return HttpRes.send500(res)
   }
})

// create, update roles
router.post('/roles', authMiddleware, async (req, res) => {
  try {
    const { id, name } = req.body
    if (id) {
      const update = await UserRole.update({ id, name })
      return HttpRes.send200(res, 'success', update)
    } else {
      const insert = await UserRole.create(name)
      return HttpRes.send200(res, 'success', insert)
    }
   } catch {
    return HttpRes.send500(res)
   }
})

// get member
router.get('/member', authMiddleware, async (req, res) => {
  try {
    const { eid } = req.query
    const _id = String(eid)
    if (_id !== 'undefined') {
      const list = await Member.getByEmployeeId(_id) || []
      if (list.length) {
        return HttpRes.send200(res, 'success', list[0])
      } else {
        return HttpRes.send400(res)
      }
    } else {
      const list = await Member.getAll({ ...req.query }) || []
      return HttpRes.send200(res, 'success', list)
    }
   } catch(e) {
    return HttpRes.send500(res)
   }
})

// ban & unban member
router.post('/member/auth', authMiddleware, async (req, res) => {
  try {
    const { id, account_status } = req.body
    if (id) {
      const update = await Member.updateAccountStatus({ id, account_status })
      if (update) {
        return HttpRes.send200(res, 'success')
      }
      return HttpRes.send500(res)
    } else {
      throw HttpRes.send400(res)
    }
   } catch {
    return HttpRes.send500(res)
   }
})

// create, update member
router.post('/member', authMiddleware, async (req, res) => {
  try {
    const {
      employee_id,
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
    } = req.body
    if (id) {
      const update = await Member.update({
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
      })
      return HttpRes.send200(res, 'success', update)
    } else {
      const insert = await Member.create({
        employee_id, basic_name, basic_govid, basic_birthday, system_username, system_password
      })
      return HttpRes.send200(res, 'success', insert)
    }
   } catch(e) {
    return HttpRes.send500(res, String(e))
   }
})

// get admin
router.get('/admin', authMiddleware, async (req, res) => {
  try {
    const list = await MemberAdmin.getAll({ ...req.query })
    return HttpRes.send200(res, 'success', list)
   } catch {
    return HttpRes.send500(res)
   }
})

// ban & unban admin
router.post('/admin/auth', authMiddleware, async (req, res) => {
  try {
    const { id, account_status } = req.body
    if (id) {
      const update = await MemberAdmin.updateAccountStatus({ id, account_status })
      if (update) {
        return HttpRes.send200(res, 'success')
      }
      return HttpRes.send500(res)
    } else {
      throw HttpRes.send400(res)
    }
   } catch {
    return HttpRes.send500(res)
   }
})

// create, update admin
router.post('/admin', authMiddleware, async (req, res) => {
  try {
    const { id, username, name, password = 'password', roles } = req.body
    if (id) {
      const update = await MemberAdmin.update({ id, name, password, roles })
      return HttpRes.send200(res, 'success', update)
    } else {
      const list = await MemberAdmin.getAll()
      const no = moment().format('YYYYMMDDHHmmss') + (list ? list.length : '0')
      const insert = await MemberAdmin.create({ username, no, name, password, roles })
      return HttpRes.send200(res, 'success', insert)
    }
   } catch {
    return HttpRes.send500(res)
   }
})

// get system config
router.get('/config', authMiddleware, async (req, res) => {
  try {
    const list = await system_config.getById('1')
    return HttpRes.send200(res, 'success', list)
   } catch {
    return HttpRes.send500(res)
   }
})

// update system config
router.post('/config', authMiddleware, async (req, res) => {
  try {
    const { id, root_usr, root_pwd, hidden } = req.body
    if (id) {
      const update = await system_config.update(id, root_usr, root_pwd, hidden)
      return HttpRes.send200(res, 'success', update)
    } else {
      // const insert = await system_config.create(allow_whitelist, off_default, root_usr, root_pwd, pay_day_month, deduct_tax_income, hidden)
      // return HttpRes.send200(res, 'success', insert)
      return HttpRes.send200(res, 'success', [])
    }
   } catch {
    return HttpRes.send500(res)
   }
})

const TOKEN_KEY = 'ires'

// admin login
router.post('/admin/login', async (req, res) => {
  try {
    const { usr, pwd } = req.body
    if (!pwd || pwd === '') {
      return HttpRes.send400(res)
    }
    const admin = req.headers['admin'] || 'false'
    if (admin && admin === 'true') {
      const getConfig = await system_config.getById('1')
      if (getConfig && getConfig.length) {
        const config = getConfig[0]
        if (config.root_usr === usr && config.root_pwd === pwd) {
          const token = jwt.sign(
            { id: '-1', name: usr, no: '超級管理員', roles: [] },
            TOKEN_KEY,
            {
              expiresIn: "7d",
            }
          );
          return HttpRes.send200(res, 'success', { is_admin: true, token })
        }
      }
      return HttpRes.send400(res)
    } else {
      const getUser = await MemberAdmin.getByUsernameAndPwd(usr, pwd)
      if (getUser && getUser.length) {
        const user = getUser[0]
        if (user.account_status !== '1') {
          return HttpRes.send403(res)
        }    
        const token = jwt.sign(
          { id: user.id, name: user.name, no: user.no, roles: pgArrToArr(user.roles) },
          TOKEN_KEY,
          {
            expiresIn: "7d",
          }
        );
        return HttpRes.send200(res, 'success', { ...user, roles: pgArrToArr(user.roles), token })
      }
    }
    return HttpRes.send400(res)
   } catch(e) {
    return HttpRes.send500(res, String(e))
   }
})

// login
router.post('/login', async (req, res) => {
  try {
    const { usr, pwd } = req.body
    if (!pwd || pwd === '') {
      return HttpRes.send400(res)
    }
    const getUser = await Member.getByEmployeeSystemUsernameAndPwd(usr, pwd)    
    if (getUser && getUser.length) {
      const user = getUser[0]
      if (user.account_status !== '1') {
        return HttpRes.send403(res)
      }
      const token = jwt.sign(
        { id: user.id, name: user.name, no: user.no, roles: pgArrToArr(user.roles) },
        TOKEN_KEY,
        {
          expiresIn: "7d",
        }
      );
      return HttpRes.send200(res, 'success', { ...user, roles: pgArrToArr(user.roles), token })
    }
    return HttpRes.send400(res)
   } catch(e) {
    return HttpRes.send500(res, String(e))
   }
})

// router.post('/login/firebase', async (req, res) => {
//   try {
//     const authorization = req.headers['authorization'] || ''
//     const split = authorization?.split('Bearer ')
//     if (split?.length === 2) {
//       const firebaseToken = split[1]
//       const { user_id: userId, email } = await Firebase.authenticateToken(firebaseToken)
//       const existUser = await Member.getBySystemUsername(email)
//       if (!existUser || existUser.length === 0) {
//         // insert new user if not exist
//         const insert = await Member.create({
//           employee_id: userId,
//           basic_name: email,
//           basic_govid: '',
//           system_username: email,
//           system_password: email,
//         })
//         if (insert && insert.length > 0) {
//           const user = insert[0]
//           const token = jwt.sign(
//             { id: user.id, name: user.name, no: user.no, roles: pgArrToArr(user.roles) },
//             TOKEN_KEY,
//             {
//               expiresIn: "7d",
//             }
//           );
//           return HttpRes.send200(res, 'success', { ...user, token })
//         }
//         return HttpRes.send400(res)
//       }
//       const user = existUser[0]
//       const token = jwt.sign(
//         { id: user.id, name: user.name, no: user.no, roles: pgArrToArr(user.roles) },
//         TOKEN_KEY,
//         {
//           expiresIn: "7d",
//         }
//       );
//       return HttpRes.send200(res, 'success', { ...user, token })
//     }

//   } catch (e: unknown) {
//     HttpRes.send500(res)
//     return
//   }
// })

// router.post('/register', async (req: Request, res: Response) => {
//   const { system_username, basic_name, basic_govid, system_password } = req.body
//   try {
//     const findUserResult = await Member.getBySystemUsername(system_username)
//     if (findUserResult === false || findUserResult.length === 0) {
//       const employee_id = moment().format('YYYYMMDDHHmmss') + system_username
//       const insert = await Member.create({
//         employee_id,
//         basic_name,
//         basic_govid,
//         system_username: system_username,
//         system_password,
//       })
//       if (insert && insert.length > 0) {
//         const user = insert[0]
//         const token = jwt.sign(
//           { id: user.id, name: user.name, no: user.no, roles: pgArrToArr(user.roles) },
//           TOKEN_KEY,
//           {
//             expiresIn: "7d",
//           }
//         );
//         return HttpRes.send200(res, 'success', { ...user, token })
//       }
//     }
//     throw new Error('write user data error')
//   } catch (e) {
//     return HttpRes.send500(res, String(e))
//   }
// })

router.get('/verification', async (req, res) => {
  try {
    const authorization = req.headers['authorization'] || ''
    const split = authorization?.split('Bearer ')
    const admin = req.headers['admin'] || 'false'
    if (split?.length === 2) {
      const token = split[1]
      const decoded = jwt.verify(token, TOKEN_KEY);
      // @ts-ignore
      const getUser = await Member.getById(decoded?.id)
      if (getUser && getUser.length) {
        return HttpRes.send200(res, 'success', { ...getUser[0], is_admin: admin !== 'false' })
      }
    }
    return HttpRes.send400(res)
  } catch(e) {
    return HttpRes.send500(res, String(e))
  }
})

export default router
