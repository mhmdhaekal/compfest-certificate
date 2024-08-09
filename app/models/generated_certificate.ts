import { DateTime } from 'luxon'
import Department from '#models/department'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import CertificateTemplate from '#models/certificate_template'

export default class GeneratedCertificate extends BaseModel {
  static connection = 'primary'
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare recipientName: string

  @column()
  declare recipientEmail: string

  @column()
  declare recipientAwardId: string

  @column()
  declare recipientAwardEn: string

  @column()
  declare activityNameId: string

  @column()
  declare activityNameEn: string

  @column()
  declare descriptionEn: string | null

  @column()
  declare descriptionId: string | null

  @column()
  declare imageLink: string

  @column()
  declare imageAspectRatio: string

  @column()
  declare jpgDownloadLink: string

  @column()
  declare pdfDownloadLink: string

  @column()
  declare isUploaded: boolean

  @column()
  declare isOnVerify: boolean

  @column()
  declare isEmailSent: boolean

  @column.dateTime()
  declare issuedOn: DateTime

  @column.dateTime()
  declare expiredOn: DateTime | null

  @column.dateTime({
    autoCreate: true,
  })
  declare createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
  })
  declare updatedAt: DateTime | null

  @column()
  declare departmentId: string

  @column()
  declare certificateTemplateId: string

  @belongsTo(() => Department)
  declare department: BelongsTo<typeof Department>

  @belongsTo(() => CertificateTemplate)
  declare template: BelongsTo<typeof CertificateTemplate>
}
