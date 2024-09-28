import { Kafka, Partitioners } from 'kafkajs'
import env from '#start/env'

const kafka = new Kafka({
  clientId: 'compfest-certificate',
  brokers: [`${env.get('KAFKA_BROKER')}`],
})

export const kafkaProducer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
})
