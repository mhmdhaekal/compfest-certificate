import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: 'primary',
  connections: {
    primary: {
      client: 'pg',
      connection: {
        host: env.get('DB_HOST'),
        port: env.get('DB_PORT'),
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
        ssl: true,
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
    verify: {
      client: 'pg',
      connection: {
        host: env.get('VERIFY_HOST'),
        port: env.get('VERIFY_PORT'),
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('VERIFY_DATABASE'),
        ssl: true,
      },
    },
  },
})

export default dbConfig
