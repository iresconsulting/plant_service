import express, { Router, Request, Response } from 'express'
import appRoot from 'app-root-path'
import fs from 'fs/promises'
import { HttpRes } from './utils/http'
// import Uploader from '../utils/multer'
import moment from 'moment'
import jwt from 'jsonwebtoken'
import { pgArrToArr, pgArrToArr2 } from '../models/pg/utils/helpers'
import { createMemberTable, dropMemberTable } from '../models/pg/models/member'
import { createUserRoleTable, dropUserRoleTable } from '../models/pg/models/user_role'
import { createMemberAdminTable, dropMemberAdmimTable } from '../models/pg/models/member_admin'
import { createSystemWhitelist, dropSystemWhitelist } from '../models/pg/models/system_whitelist'
import { createSystemOffTypes, dropSystemOffTypes } from '../models/pg/models/system_off_types'
import { createSystemDepartments, dropSystemDepartments } from '../models/pg/models/system_departments'
import { createSystemShifts, dropSystemShifts } from '../models/pg/models/system_shifts'
import { createSystemConfig, dropSystemConfig } from '../models/pg/models/system_config'
import { createHrClockRecord, dropHrClockRecord } from '../models/pg/models/hr_clock_record'
import { createHrForm, dropHrForm } from '../models/pg/models/hr_form'
import ChatRooms from '../models/pg/controllers/chat_rooms'
import ChatMessages from '../models/pg/controllers/chat_messages'
import { createChatMessagesTable, dropChatMessagesTable } from '../models/pg/models/chat_messages'
import { createChatRoomsTable, dropChatRoomsTable } from '../models/pg/models/chat_rooms'
import Firebase from '../utils/firebase'
import Member from '../models/pg/controllers/member'
import MemberAdmin from '../models/pg/controllers/member_admin'
import UserRole from '../models/pg/controllers/user_role'
import system_config from '../models/pg/controllers/system_config'
import system_departments from '../models/pg/controllers/system_departments'
import system_whitelist from '../models/pg/controllers/system_whitelist'
import system_off_types from '../models/pg/controllers/system_off_types'
import system_shifts from '../models/pg/controllers/system_shifts'
import hr_form from '../models/pg/controllers/hr_form'
import hr_clock_record from '../models/pg/controllers/hr_clock_record'
import hr_shift from '../models/pg/controllers/hr_shift'
import { createHrShift, dropHrShift } from '../models/pg/models/hr_shift'
import { createSystemBonus } from '../models/pg/models/system_bonus'
import system_bonus from '../models/pg/controllers/system_bonus'
import record_salary from '../models/pg/controllers/record_salary'
import { createRecordSalary } from '../models/pg/models/record_salary'
import record_kpi from '../models/pg/controllers/record_kpi'
import authMiddleware from './middleware/auth'
import { createRecordKpi } from '../models/pg/models/record_kpi'

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
    // await dropMemberTable()
    // await dropMemberAdmimTable()
    // await dropHrClockRecord()
    // await dropHrForm()
    // await dropHrShift()
    // await dropSystemConfig()
    // await dropSystemDepartments()
    // await dropSystemOffTypes()
    // await dropSystemShifts()
    // await dropSystemWhitelist()
    // await dropUserRoleTable()
    // await dropChatRoomsTable()
    // await dropChatMessagesTable()
    // create
    const create_res = await Promise.all([
      createMemberAdminTable(),
      createMemberTable(),
      createHrClockRecord(),
      createHrForm(),
      createHrShift(),
      createSystemConfig(),
      createSystemDepartments(),
      createSystemOffTypes(),
      createSystemShifts(),
      createSystemWhitelist(),
      createSystemBonus(),
      createUserRoleTable(),
      createChatRoomsTable(),
      createChatMessagesTable(),
      createRecordSalary(),
      createRecordKpi(),
    ])
    const config = await system_config.create(false, '', 'root', '1234qwer', '5', false, false)
    const member = await Member.create({
      employee_id: '999999',
      basic_name: 'name',
      basic_govid: 'A123456789',
      basic_birthday: '1995-01-01',
      system_username: '999999',
      system_password: '999999',
    })
    console.log('config', config);
    console.log('member', member);
    console.log('---tx end---');
    return HttpRes.send200(res)
  } catch(e) {
    console.log('e', e);
    return HttpRes.send500(res, String(e))
  }
})

router.get('/version', async (req: Request, res: Response) => {
  const _package = await fs.readFile(`${appRoot}/package.json`, 'utf-8')
  const jsonPackage = JSON.parse(_package)
  HttpRes.send200(res, null, { version: jsonPackage.version })
  return
})

// router.post('/otp/email/message', async (req, res) => {
//   try {
//     const { email } = req.body    
//     const rows = await Member.getByUsername(email)
//     if (!rows || rows.length === 0) {
//       return HttpRes.send401(res)
//     }
//     const member = rows[0]
//     // 6 digits number, ensure 1st digit !== 0
//     const codeGen = Math.floor(100000 + Math.random() * 900000)
//     const mailOptions: any = {
//       from: 'keiko15678@gmail.com',
//       to: email,
//       subject: 'Playdium Support - 重置密碼',
//       text: codeGen || 960938
//     };
//     transporter.sendMail(mailOptions as any, async function(error: any, info: any){
//       if (error) {
//         throw new Error('send email error' + String(error))
//       } else {
//         console.log('Email sent: ' + info.response);
//         const updatePassword = await Member.updatePassword({ id: member?.id, password: codeGen })
//         if (!updatePassword) {
//           throw new Error('system error')
//         }
//         return HttpRes.send200(res, 'success', { email, response: JSON.stringify(info?.response) })
//       }
//     });
//   } catch(e: any) {
//     return HttpRes.send500(res, String(e))
//   }
// })

// router.post('/otp/email', async (req, res) => {
//   try {
//     const { email, code } = req.body    
//     const rows = await Member.getByUsername(email)
//     if (!rows || rows.length === 0) {
//       return HttpRes.send401(res)
//     }
//     const member = rows[0]    
//     const verifyCode = await Member.getByUsernameAndPwd(email, code)
//     if (!verifyCode) {
//       return HttpRes.send400(res)
//     }
//     return HttpRes.send200(res, 'success')
//   } catch {
//     return HttpRes.send500(res)
//   }
// })

// get chat rooms
router.get('/chat/rooms', async (req, res) => {
  try {
    const { is_public, user_id } = req.query
    const _is_public = String(is_public)
    const _user_id = String(user_id)
    if (_is_public !== 'undefined' && _is_public === 'true') {
      const list = await ChatRooms.getIsPublic()
      return HttpRes.send200(res, 'success', list)
    } else if (_user_id !== 'undefined') {
      const list = await ChatRooms.getByRecipientId(_user_id)
      return HttpRes.send200(res, 'success', list)
    } else {
      return HttpRes.send200(res, 'success', [])
    }
  } catch {
   return HttpRes.send500(res)
  }
})

// create, update chat rooms
router.post('/chat/rooms', async (req, res) => {
  try {
    const { id, recipient_one_id, recipient_one_name, recipient_two_id, recipient_two_name,  latest_message_content, latest_message_time, latest_message_sender_name, latest_message_sender_id, room_name, is_public, group_ids, hidden, removed, icon } = req.body
    if (id) {
      const list = await ChatRooms.update({ id, latest_message_content, latest_message_time, latest_message_sender_name, latest_message_sender_id, hidden, removed, room_name, group_ids, is_public, icon })
      return HttpRes.send200(res, 'success', list)
    } else {
      const list = await ChatRooms.create({ recipient_one_id, recipient_one_name, recipient_two_id, recipient_two_name,  latest_message_content, latest_message_time, latest_message_sender_name, latest_message_sender_id, room_name, is_public, group_ids, icon })
      return HttpRes.send200(res, 'success', list)
    }
  } catch {
   return HttpRes.send500(res)
  }
})

// get chat messages
router.get('/chat/messages', async (req, res) => {
  try {
    const { room_id, user_id } = req.query
    const _room_id = String(room_id)
    // const _user_id = String(user_id)
    if (_room_id !== 'undefined') {
      const list = await ChatMessages.getByRoomId(_room_id, 30)
      return HttpRes.send200(res, 'success', list)
    } else {
      return HttpRes.send200(res, 'success', [])
    }
  } catch {
   return HttpRes.send500(res)
  }
})

// create, update chat messages
router.post('/chat/messages', async (req, res) => {
  try {
    const { id, room_id, sender_id, sender_name, receiver_id, receiver_name, content, hidden, removed, reverted  } = req.body
    if (id) {
      const list = await ChatMessages.update({ id, content, hidden, removed, reverted })
      return HttpRes.send200(res, 'success', list)
    } else {
      const list = await ChatMessages.create({ room_id, sender_id, sender_name, receiver_id, receiver_name, content })
      return HttpRes.send200(res, 'success', list)
    }
  } catch {
   return HttpRes.send500(res)
  }
})

// get record kpi
router.get('/record/kpi', authMiddleware, async (req, res) => {
  try {
    const { eid } = req.query
    const _eid = String(eid)
    let list = []
    if (_eid !== 'undefined') {
      list = await record_kpi.getByEid(_eid) || []
    } else {
      list = await record_kpi.getAll() || []
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

// create, update record kpi
router.post('/record/kpi', authMiddleware, async (req, res) => {
  try {
    const { id, employee_id, basic_name, record_date, valid_date, types, tags, remark, hidden, auditor, amount_total } = req.body
    if (id) {
      const list = await record_kpi.update({ id, employee_id, basic_name, record_date, valid_date, types, tags, remark, hidden, auditor, amount_total })
      return HttpRes.send200(res, 'success', list)
    } else {
      const list = await record_kpi.create({ employee_id, basic_name, record_date, valid_date, types, tags, remark, hidden, auditor, amount_total })
      return HttpRes.send200(res, 'success', list)
    }
  } catch(e) {
    return HttpRes.send500(res, String(e))
  }
})

// get record salary
router.get('/record/salary', authMiddleware, async (req, res) => {
  try {
    const { eid } = req.query
    const _eid = String(eid)
    let list = []
    if (_eid !== 'undefined') {
      list = await record_salary.getByEid(_eid) || []
    } else {
      list = await record_salary.getAll() || []
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

// create, update record salary
router.post('/record/salary', authMiddleware, async (req, res) => {
  try {
    const { id, employee_id, basic_name, title_date, setup_date, types, remark, hidden, auditor, month, days, hours, amount_total } = req.body
    if (id) {
      const list = await record_salary.update({ id, employee_id, basic_name, title_date, setup_date, types, remark, hidden, auditor, month, days, hours, amount_total })
      return HttpRes.send200(res, 'success', list)
    } else {
      const list = await record_salary.create({ employee_id, basic_name, title_date, setup_date, types, remark, hidden, auditor, month, days, hours, amount_total })
      return HttpRes.send200(res, 'success', list)
    }
  } catch(e) {
    return HttpRes.send500(res, String(e))
  }
})

// get system bonus
router.get('/system/bonus', authMiddleware, async (req, res) => {
  try {
    const list = await system_bonus.getAll()
    return HttpRes.send200(res, 'success', list)
  } catch {
  return HttpRes.send500(res)
    }
})

// create, update system bonus
router.post('/system/bonus', authMiddleware, async (req, res) => {
  try {
    const { id, title, base, amount, percentage, payment_method, payment_date_start, payment_date_end, hidden } = req.body
    if (id) {
      const list = await system_bonus.update({ id, title, base, amount, percentage, payment_method, payment_date_start, payment_date_end, hidden })
      return HttpRes.send200(res, 'success', list)
    } else {
      const list = await system_bonus.create({ title, base, amount, percentage, payment_method, payment_date_start, payment_date_end, hidden })
      return HttpRes.send200(res, 'success', list)
    }
  } catch(e) {
    return HttpRes.send500(res, String(e))
  }
})

// get hr shift
router.get('/hr/shift', authMiddleware, async (req, res) => {
  try {
    const { eid } = req.query
    const _eid = String(eid)
    if (_eid !== 'undefined') {
      const list = await hr_shift.getByEid(_eid)
      return HttpRes.send200(res, 'success', list)
    } else {
      return HttpRes.send200(res, 'success', [])
    }
  } catch {
  return HttpRes.send500(res)
    }
})

// create, update hr shift
router.post('/hr/shift', authMiddleware, async (req, res) => {
  try {
    const { id, action_type, employee_id, system_username, date, shift_title, start_time, end_time, remark, is_approved, is_pending, is_rejected, approve_users, tags } = req.body
    if (id) {
      const list = await hr_shift.update({ id, employee_id, system_username, date, shift_title, start_time, end_time, remark, is_approved, is_pending, is_rejected, approve_users, tags })
      return HttpRes.send200(res, 'success', list)
    } else {
      const list = await hr_shift.create({ employee_id, system_username, date, shift_title, start_time, end_time, remark, is_approved, is_pending, is_rejected, approve_users, tags })
      return HttpRes.send200(res, 'success', list)
    }
  } catch(e) {
    return HttpRes.send500(res, String(e))
  }
})

// get hr clock
router.get('/hr/clock', authMiddleware, async (req, res) => {
  try {
    const { eid, date, start_date, end_date } = req.query
    const _eid = String(eid)
    const _start_date = String(start_date)
    const _end_date = String(end_date)
    const _date = String(date)
    if (_eid !== 'undefined' && _start_date !== 'undefined' && _end_date !== 'undefined') {
      const list = await hr_clock_record.getByEidAndRangeDate(_eid, _start_date?.split(' ')[0], _end_date?.split(' ')[0])
      return HttpRes.send200(res, 'success', list)
    }
    if (_eid !== 'undefined' && _date !== 'undefined') {
      const list = await hr_clock_record.getByEidAndExactDate(_eid, _date?.split(' ')[0])
      return HttpRes.send200(res, 'success', list)
    }
    if (_eid !== 'undefined') {
      const list = await hr_clock_record.getByEid(_eid)
      return HttpRes.send200(res, 'success', list)
    } else {
      const list = await hr_clock_record.getAll()
      return HttpRes.send200(res, 'success', list)
    }
  } catch {
    return HttpRes.send500(res)
  }
})

// create, update hr clock
router.post('/hr/clock', authMiddleware, async (req, res) => {
  try {
    const { id, action_type, employee_id, date, system_username, status, time_in, time_out, remark } = req.body
    if (id) {
      const list = await hr_clock_record.update(id, employee_id, date, system_username, status, time_in, time_out, remark)
      return HttpRes.send200(res, 'success', list)
    } else {
      const list = await hr_clock_record.create(employee_id, date, system_username, status, time_in, time_out, remark)
      return HttpRes.send200(res, 'success', list)
    }
  } catch(e) {
    return HttpRes.send500(res, String(e))
  }
})

// get hr form
router.get('/hr/form', authMiddleware, async (req, res) => {
  try {
    const { eid } = req.query
    const _eid = String(eid)
    if (_eid !== 'undefined') {
      const list = await hr_form.getByEid(_eid)
      return HttpRes.send200(res, 'success', list)
    } else {
      return HttpRes.send200(res, 'success', [])
    }
  } catch {
   return HttpRes.send500(res)
  }
})

// create, update hr form
router.post('/hr/form', authMiddleware, async (req, res) => {
  try {
    const { action_type, id, approver_user_id, employee_id, system_username, apply_type, start_date, end_date, remark, is_approved, is_pending, is_rejected, approve_users, tags } = req.body
    // if (action_type === 'approve' && id) {
    //   const list = await hr_form.updateApprove({
    //     id,
    //     approver_user_id
    //   })
    //   return HttpRes.send200(res, 'success', list)
    // } else if (action_type === 'reject' && id) {
    //   const list = await hr_form.updateReject({
    //     id,
    //     approver_user_id
    //   })
    //   return HttpRes.send200(res, 'success', list)
    // } else
    if (id) {
      const list = await hr_form.update({
        id,
        apply_type, start_date, end_date, remark, is_approved, is_pending, is_rejected, approve_users, tags
      })
      return HttpRes.send200(res, 'success', list)
    } else {
      const list = await hr_form.create({
        employee_id, system_username, apply_type, start_date, end_date, remark, is_approved, is_pending, is_rejected, approve_users, tags
      })
      return HttpRes.send200(res, 'success', list)
    }
  } catch(e) {
    return HttpRes.send500(res, String(e))
  }
})

// get system_shifts
router.get('/system/shifts', authMiddleware, async (req, res) => {
  try {
    const list = await system_shifts.getAll() || []
    return HttpRes.send200(res, 'success', list)
  } catch {
   return HttpRes.send500(res)
  }
 })

// update system_shifts
router.post('/system/shifts', authMiddleware, async (req, res) => {
  try {
    const { id, action_type, title, head_count, start_time, end_time, remark, hidden } = req.body
    if (action_type === 'delete' && id && hidden !== undefined) {
      const list = await system_shifts.hide(id, hidden)
      return HttpRes.send200(res, 'success', list)
    } else if (id) {
      const list = await system_shifts.update(id, title, head_count, start_time, end_time, remark, hidden)
      return HttpRes.send200(res, 'success', list)
    } else {
      const list = await system_shifts.create(title, head_count, start_time, end_time, remark, hidden)
      return HttpRes.send200(res, 'success', list)
    }
  } catch(e) {
    return HttpRes.send500(res, String(e))
  }
})

 // get system offtypes
router.get('/system/offtypes', authMiddleware, async (req, res) => {
  try {
    const list = await system_off_types.getAll() || []
    return HttpRes.send200(res, 'success', list)
  } catch {
    return HttpRes.send500(res)
  }
})

// create, update system offtypes
router.post('/system/offtypes', authMiddleware, async (req, res) => {
  try {
    const body: {
      action_type?: string;
      id?: string;
      title: string,
      unit: string,
      days: boolean,
      pay_type: string,
      hidden: boolean,
    } = req.body
    if (body?.action_type === 'delete' && body?.id && body?.hidden !== undefined) {
    const list = await system_off_types.hide(body?.id, body?.hidden)
    return HttpRes.send200(res, 'success', list)
    } else if (body?.id) {
      const list = await system_off_types.update(body?.id, body?.title, body?.unit, body?.days, body?.pay_type, body?.hidden)
      return HttpRes.send200(res, 'success', list)
    } else {
      const list = await system_off_types.create(body?.title, body?.unit, body?.days, body?.pay_type, body?.hidden)
      return HttpRes.send200(res, 'success', list)
    }
  } catch(e) {
    return HttpRes.send500(res, String(e))
  }
})

// get system whitelist
router.get('/system/whitelist', authMiddleware, async (req, res) => {
 try {
  const list = await system_whitelist.getAll()
  return HttpRes.send200(res, 'success', list)
 } catch(e) {
  return HttpRes.send500(res, String(e))
 }
})

// create, update system whitelist
router.post('/system/whitelist', authMiddleware, async (req, res) => {
try {
  const body: {
    action_type?: string;
    id?: string;
    title: string,
    content: string,
    lat: string,
    lng: string,
    type: string,
    tags: string,
    hidden: boolean,
  } = req.body
  if (body?.action_type === 'delete' && body?.id && body?.hidden !== undefined) {
  const list = await system_whitelist.hide(body.id, body.hidden)
  return HttpRes.send200(res, 'success', list)
  } else if (body?.id) {
    const list = await system_whitelist.update(body.id, body.title, body.content, body.lat, body.lng, body.type, body.tags, !!body.hidden|| false)
    return HttpRes.send200(res, 'success', list)
  } else {
  const list = await system_whitelist.create(body.title, body.content, body.lat, body.lng, body.type, body.tags, !!body.hidden || false)
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

 // get departments
 router.get('/system/departments', authMiddleware, async (req, res) => {
  try {
    const list = await system_departments.getAll() || []
    return HttpRes.send200(res, 'success', list)
  } catch {
    return HttpRes.send500(res)
  }
})

// create, update departments
router.post('/system/departments', authMiddleware, async (req, res) => {
  try {
    const body: {
      id?: string;
      title: string,
      head_count: string,
      parent_department: string,
      parent_position: string,
      whitelist: string,
      is_position: boolean,
      is_department: boolean,
      hidden: boolean
    } = req.body
    if (body?.id) {
      const update = await system_departments.update(body.id, body.title, body.head_count, body.parent_department, body.parent_position, body.whitelist, body.is_position, body.is_department, body.hidden)
      return HttpRes.send200(res, 'success', update)
    } else {
      const insert = await system_departments.create(
        body.title, body.head_count, body.parent_department, body.parent_position, body.whitelist, body.is_position, body.is_department, body.hidden
      )
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
    const { id, root_usr, root_pwd, allow_whitelist, off_default, pay_day_month, deduct_tax_income, hidden } = req.body
    if (id) {
      const update = await system_config.update(id, allow_whitelist, off_default, root_usr, root_pwd, pay_day_month, deduct_tax_income, hidden)
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

// router.post('/member/password', async (req, res) => {
//   try {
//     const { id, usr, pwd_old, pwd, action_type } = req.body
//     if (!usr || !pwd || pwd === '') {
//       return HttpRes.send400(res)
//     }
//     const getUser = await Member.getByUsernameAndPwd(usr, pwd)      
//     if (getUser && getUser.length) {
//       const user = getUser[0]
//       const updatePwd = await Member.updatePassword({ password: pwd, id })
//       if (updatePwd) {
//         return HttpRes.send200(res)
//       }
//     }
//     return HttpRes.send400(res)
//    } catch(e) {
//     return HttpRes.send500(res, String(e))
//    }
// })

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

router.post('/login/firebase', async (req, res) => {
  try {
    const authorization = req.headers['authorization'] || ''
    const split = authorization?.split('Bearer ')
    if (split?.length === 2) {
      const firebaseToken = split[1]
      const { user_id: userId, email } = await Firebase.authenticateToken(firebaseToken)
      const existUser = await Member.getBySystemUsername(email)
      if (!existUser || existUser.length === 0) {
        // insert new user if not exist
        const insert = await Member.create({
          employee_id: userId,
          basic_name: email,
          basic_govid: '',
          system_username: email,
          system_password: email,
        })
        if (insert && insert.length > 0) {
          const user = insert[0]
          const token = jwt.sign(
            { id: user.id, name: user.name, no: user.no, roles: pgArrToArr(user.roles) },
            TOKEN_KEY,
            {
              expiresIn: "7d",
            }
          );
          return HttpRes.send200(res, 'success', { ...user, token })
        }
        return HttpRes.send400(res)
      }
      const user = existUser[0]
      const token = jwt.sign(
        { id: user.id, name: user.name, no: user.no, roles: pgArrToArr(user.roles) },
        TOKEN_KEY,
        {
          expiresIn: "7d",
        }
      );
      return HttpRes.send200(res, 'success', { ...user, token })
    }

  } catch (e: unknown) {
    HttpRes.send500(res)
    return
  }
})

router.post('/register', async (req: Request, res: Response) => {
  const { system_username, basic_name, basic_govid, system_password } = req.body
  try {
    const findUserResult = await Member.getBySystemUsername(system_username)
    if (findUserResult === false || findUserResult.length === 0) {
      const employee_id = moment().format('YYYYMMDDHHmmss') + system_username
      const insert = await Member.create({
        employee_id,
        basic_name,
        basic_govid,
        system_username: system_username,
        system_password,
      })
      if (insert && insert.length > 0) {
        const user = insert[0]
        const token = jwt.sign(
          { id: user.id, name: user.name, no: user.no, roles: pgArrToArr(user.roles) },
          TOKEN_KEY,
          {
            expiresIn: "7d",
          }
        );
        return HttpRes.send200(res, 'success', { ...user, token })
      }
    }
    throw new Error('write user data error')
  } catch (e) {
    return HttpRes.send500(res, String(e))
  }
})

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
