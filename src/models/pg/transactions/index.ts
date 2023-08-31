import init from '..'

import { createMemberTable, dropMemberTable } from '../models/member'
import { createUserRoleTable, dropUserRoleTable } from '../models/user_role'

init().then(async () => {
  console.log('---tx start---');
  
  // drop
  await dropMemberTable()
  await dropUserRoleTable()

  // create
  await Promise.all([
    createMemberTable(),
    createUserRoleTable(),
  ])

  console.log('---tx end---');
})

process.exit(0)
