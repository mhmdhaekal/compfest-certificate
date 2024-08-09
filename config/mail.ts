import env from '#start/env'
import { defineConfig, transports } from '@adonisjs/mail'

const mailConfig = defineConfig({
  default: 'ses',

  mailers: {
    ses: transports.ses({
      apiVersion: '2010-12-01',
      region: env.get('SES_REGION'),
      credentials: {
        accessKeyId: env.get('SES_ACCESS_KEY'),
        secretAccessKey: env.get('SES_ACCESS_SECRET'),
      },
      sendingRate: 10,
      maxConnections: 5,
    }),
  },
})

export default mailConfig

declare module '@adonisjs/mail/types' {
  export interface MailersList extends InferMailers<typeof mailConfig> {}
}
