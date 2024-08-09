import { Kafka } from '@upstash/kafka'
import env from '#start/env'

const kafka = new Kafka({
  url: env.get('UPSTASH_KAFKA_REST_URL'),
  username: env.get('UPSTASH_KAFKA_REST_USERNAME'),
  password: env.get('UPSTASH_KAFKA_REST_PASSWORD'),
})

export const kafkaProducer = kafka.producer()
