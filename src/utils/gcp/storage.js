import { Storage } from '@google-cloud/storage';
import * as gcp from '@pulumi/gcp'
import axios from 'axios';

export async function createBucket(bucketname) {
  const bucket = new gcp.storage.Bucket(bucketname, {
    cors: [
      {
        methods: ['POST'],
        origins: ['*'],
        responseHeaders: ['*'],
      },
    ],
    forceDestroy: true,
  });
  // url = bucket.url
  return bucket
}

export default async function postBucket(file_path) {
  const storage = new Storage({
    projectId: process.env.PROJECT_ID || '1225g-prod',
    credentials: {
      "type": "service_account",
      "project_id": "g-prod-400105",
      "private_key_id": "0307224689245930189677e2b5fe95d3d698ccf1",
      "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCZ7J8mk7tzVkow\n+zToHwACdAWqJGHUgWJdoHwrwPGbzcYU0IR/v2P9iEcq6n1aq3/CHmL56kTrWljk\n9+NjgaWYqsl+3e0kBwky7Rvq0mWdeD7FrinXLgsFlERayPCXwYgKrf1c2f0SKVNt\nfRoaDkf3e0cwC6hJJcWxVqEzwAL7b3MKp+zf9VYIs6swmaCiRE+eIz4p26ktZdIz\nx2Lp6FjXB6J6gFclCH0ycROUC2UXICsqO99rQKHp/JPvapVn9ePQfklVyXY/OAuX\nWCWj7qc0ggEkIWTeynyAbrJLl8Sf9nZ5fwsb45a4UYl9nxvyREINzaJxHWPxa7+O\nbE2+D2bjAgMBAAECggEACOYqSWOvKbrqbSyI4YaxTHMCxNR3p36XfkxCAZGVJmne\nMuPfVTdug4D2hF+sQaq6pzF0jXhi5ayCiTJfvigHt+zf22rfQ/74JC6bN5dUcqc6\nEdnA54Ts9DSfQxRs/Ike4Wcvx8d+nycugJ0D/k+nD4LcGcYCw7/gTyFwDnricUDo\nTwOydeyfTrj7nnmNur1BNGJ75/V8r0LfkNwKHBz5m86U4UdlunXDeC7TZ+D5DdjY\nlRwYn5xBFBSSJifALuel+yUHUguLgWaUnh1B+33s7MZ6lBx1bxbcG2MqeAZpMRvS\n7sTBh1udrzlcGDMKV/395t2ce4T5hWdqNEK0OGqw6QKBgQDPcRON9NK/wRTs3W2w\nBVPdC9lMOP6p0abn2DVUzNaOTFCtVk7mlN1J+n/4TrHXWenI8aKQvt7Mcj7UyUpc\nHZFaDO751Yw/Ol6BeXhMxUtnldsxUHpqCHHUq7kPS5KBAtUKcmJ5eQsY9NS+sX0T\nMpCcPlz9ORDBea8lnL1qDIZG/QKBgQC99IU0T6osHQj/oNvLkXRWFXOcx8H++FJI\nwz2I3fWAKyqUq161A99l5SftwLIzwYsUdTm451+xXa9oWQIii3fegM5Q+3wluepc\nmWPLCTWQYQGGwA5iLFXfSMQa6czVYb2gjXMqdUw5vMuvdrkSEgojBBrzYbSYk+pN\nFAMKq3X7XwKBgDyeL3epFjjApGu/HQF13RbYEoyqjwhy4lIXpSX9oaj9dgnhEbdh\nwvSORfz6ig+DD8UPj1C65gJaVC/8DkWywjnNU7wgAhar6Nfu9g+BC9LeQKo9eTgo\n9ZKPB8oHbG1UtYqS+GHE1FBboxuCZClK+mUd+DBrD5FqDJtyHQuzUz3FAoGAbQ6H\ns2LRdoYs9mZqClO2EP475BUjobj7tN6y43NbUXx28+f3dcGFbsDDzdJF/UTvDo3G\n2AuueuwomqYPfbnI1ivpR8E6o4Y7sXI3QwhEgmHPOIfnOiHuI0VpoXH9sbxt3FGZ\nfxTc8IEeB90HoAJPY48l0fmUb8zsRdhpbqTGFc0CgYEAzzC6YEg1kZizJBesmyqr\nlsKhf9hPoFj813zYYMr4opTOMSYujzjOWaX4HxOCf/51NFD8+nauruJKfAx25edk\nfdxPHbMechTEtkVeC6lpYI2ACmL1wTfrPhPojkQ4/g+C4+pfoLwZM5FsoWI9LDoW\nH0lF2XKaOGEDDMDU3One8Xc=\n-----END PRIVATE KEY-----\n",
      "client_email": "gcs-1225g@g-prod-400105.iam.gserviceaccount.com",
      "client_id": "118071579085256334787",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/gcs-1225g%40g-prod-400105.iam.gserviceaccount.com",
      "universe_domain": "googleapis.com"
    },
  });

  const bucketname = process.env.BUCKET_NAME || '1225g'
  const bucket = storage.bucket(bucketname);
  const res = await bucket.upload(file_path)
  if (res.length > 0) {
    await storage.bucket(bucketname).file(filename).makePublic()
    const url = res[0]?.metadata?.mediaLink || ''
    return url
  }
  return ''
}

export async function getFile(url) {
  const res = await axios.get(url)
  const data = res.data
  if (data) {
    return data
  }
  console.error('[gcp_storage] Connection failed.');
  return false
}
