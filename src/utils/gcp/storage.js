import { Storage } from '@google-cloud/storage';
import gcp from '@pulumi/gcp'
import axios from 'axios';
// import pulumi from '@pulumi/pulumi'

export async function initBucket() {
  const bucket = new gcp.storage.Bucket('my-bucket', {
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

export default async function uploadToStorage(req, res) {
  const storage = new Storage({
    projectId: process.env.PROJECT_ID,
    credentials: {
      client_email: process.env.CLIENT_EMAIL || '',
      private_key: process.env.PRIVATE_KEY || '',
    },
  });

  const bucket = storage.bucket(process.env.BUCKET_NAME || '');
  const file = bucket.file(req.query.file);
  const options = {
    expires: Date.now() + 1 * 60 * 30000, //  1 minute,
    fields: { 'x-goog-meta-test': 'data' },
  };

  const [response] = await file.generateSignedPostPolicyV4(options);
  return response
}

export async function upload(file) {
  // const file = e.target.files[0];
  const filename = encodeURIComponent(file.name);
  const res = await uploadToStorage({
    query: {
      file: filename,
    }
  })
  if (res.data) {
    const url = res.data?.url
    const fields = res.data?.fields
    const formData = new FormData();
    Object.entries({ ...fields, file }).forEach(([key, value]) => {
      formData.append(key, value);
    });
    const upload = await axios.post(url, formData);
    const status = upload.data?.ok
    if (status) {
      console.log('Uploaded successfully!');
      return true
    } else {
      console.error('Upload failed.');
      return false
    }
  }
  // const res = await fetch(`/api/upload-url?file=${filename}`);
}
