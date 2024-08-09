import { Disk } from 'flydrive'
import { S3Driver } from 'flydrive/drivers/s3'
import env from '#start/env'

export const s3Disk = new Disk(
  new S3Driver({
    credentials: {
      accessKeyId: env.get('AWS_ACCESS_KEY'),
      secretAccessKey: env.get('AWS_ACCESS_SECRET'),
    },
    region: env.get('AWS_REGION'),
    bucket: env.get('AWS_BUCKET'),
    visibility: 'private',
  })
)
