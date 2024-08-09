import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import GeneratedCertificate from '#models/generated_certificate'
import CertificateTemplate from '#models/certificate_template'

export default class Department extends BaseModel {
  static connection = 'primary'
  static selfAssignPrimaryKey = true
  @column({ isPrimary: true })
  declare ID: string

  @column()
  declare nameEn: string

  @column()
  declare nameId: string

  @column()
  declare logo: string | null

  @column()
  declare year: string

  @column.dateTime({
    autoCreate: true,
  })
  declare createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
  })
  declare updatedAt: DateTime | null

  @hasMany(() => GeneratedCertificate)
  declare certificates: HasMany<typeof GeneratedCertificate>

  @hasMany(() => CertificateTemplate)
  declare templates: HasMany<typeof CertificateTemplate>
}
