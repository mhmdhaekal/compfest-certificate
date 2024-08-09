/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']),

  /*
  |----------------------------------------------------------
  | Variables for configuring database connection
  |----------------------------------------------------------
  */
  DB_HOST: Env.schema.string({ format: 'host' }),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string(),
  VERIFY_DATABASE: Env.schema.string(),
  VERIFY_HOST: Env.schema.string(),
  VERIFY_PORT: Env.schema.number(),
  COMPFEST_VERIFY_URL: Env.schema.string(),
  YEAR: Env.schema.string(),
  AWS_ACCESS_KEY: Env.schema.string(),
  AWS_ACCESS_SECRET: Env.schema.string(),
  AWS_REGION: Env.schema.string(),
  AWS_BUCKET: Env.schema.string(),
  UPSTASH_KAFKA_REST_URL: Env.schema.string(),
  UPSTASH_KAFKA_REST_USERNAME: Env.schema.string(),
  UPSTASH_KAFKA_REST_PASSWORD: Env.schema.string(),
  SES_ACCESS_KEY: Env.schema.string(),
  SES_ACCESS_SECRET: Env.schema.string(),
  SES_REGION: Env.schema.string(),
})
