import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import VerifyDepartment from '#models/verify_department'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class VerifyCertificate extends BaseModel {
  static connection = 'verify'
  static selfAssignPrimaryKey = true
  static table = 'Certificate'

  @column({ isPrimary: true, columnName: 'ID' })
  declare id: string

  @column({ columnName: 'RecipientName' })
  declare recipientName: string

  @column({ columnName: 'RecipientAwardId' })
  declare recipientAwardId: string

  @column({ columnName: 'RecipientAwardEn' })
  declare recipientAwardEn: string

  @column({ columnName: 'ActivityNameId' })
  declare activityNameId: string

  @column({ columnName: 'ActivityNameEn' })
  declare activityNameEn: string

  @column({ columnName: 'DescriptionEn' })
  declare descriptionEn: string | null

  @column({ columnName: 'DescriptionId' })
  declare descriptionId: string | null

  @column({ columnName: 'ImageLink' })
  declare imageLink: string

  @column({ columnName: 'ImageAspectRatio' })
  declare imageAspectRatio: string

  @column({ columnName: 'JpgDownloadLink' })
  declare jpgDownloadLink: string

  @column({ columnName: 'PdfDownloadLink' })
  declare pdfDownloadLink: string

  @column({ columnName: 'DepartmentId' })
  declare departmentId: string

  @column.dateTime({ columnName: 'IssuedOn' })
  declare issuedOn: DateTime

  @column.dateTime({ columnName: 'ExpiredOn' })
  declare expiredOn: DateTime | null

  @column.dateTime({ autoCreate: true, columnName: 'CreatedAt' })
  declare createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    columnName: 'UpdatedAt',
  })
  declare updatedAt: DateTime | null

  @belongsTo(() => VerifyDepartment, {
    foreignKey: 'ID',
    localKey: 'DepartmentId',
  })
  declare department: BelongsTo<typeof VerifyDepartment>
}
