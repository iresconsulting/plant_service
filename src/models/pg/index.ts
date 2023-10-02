import { Client, QueryResult } from 'pg'
import Logger from '~/src/utils/logger'
import initMysql from '../mysql'

const env = process.env
const connectionString: string = env.PG_URI || 'postgres://nijthssr:h6Rh5hjnvyyhTDaPFFTfzAB7Kgmbe2nh@satao.db.elephantsql.com/nijthssr'

export let client: Client | any

export namespace Pg {
  export async function terminate(): Promise<void> {
    await client.end()
  }

  export let instance: Client = client
}

async function setPgConnection() {
  const cl = new Client({
    connectionString,
  })
  await cl.connect()
  Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'connected.' })
  await cl.query('SELECT NOW()', (err: Error, res: QueryResult<any>) => {
    if (err) {
      Logger.generateTimeLog({ label: Logger.Labels.PG, message: `connection error: ${String(err)}` })
      return
    }
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `SELECT NOW(): ${JSON.stringify(res.rows)}` })
  })
  return cl
}

export default async function initPg(): Promise<void> {
  try {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: 'connecting...' })

    // Add mysql option
    if (env.DB_TYPE === 'mysql') {
      client = await initMysql()
      client = {
        ...client,
        query: async function(...args) {
          return await client.query(...args).then((error, results, fields) => {
            if (error) {
              throw new Error(String(error))
              return false
            }
            return {
              rows: results,
              fields,
            }
          })
        }
      }
    } else {
      client = await setPgConnection()
    }
  } catch (e: unknown) {
    Logger.generateTimeLog({ label: Logger.Labels.PG, message: `connection error: ${(e as string).toString()}` })
    const _timeout = setTimeout(async () => {
      await initPg()
      clearTimeout(_timeout)
    }, 3000)
  }
}
