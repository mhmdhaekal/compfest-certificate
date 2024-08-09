import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import VerifyCertificate from '#models/verify_certificate'

export default class VerifyDepartment extends BaseModel {
  static connection = 'verify'
  static selfAssignPrimaryKey = true
  static table = 'Department'
  @column({ isPrimary: true, columnName: 'ID' })
  declare ID: string

  @column({ columnName: 'NameEn' })
  declare nameEn: string

  @column({ columnName: 'NameId' })
  declare nameId: string

  @column({ columnName: 'Logo' })
  declare logo: string | null

  @column({ columnName: 'Year' })
  declare year: string

  @column.dateTime({ autoCreate: true, columnName: 'CreatedAt' })
  declare createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    columnName: 'UpdatedAt',
  })
  declare updatedAt: DateTime | null

  @hasMany(() => VerifyCertificate)
  declare certificates: HasMany<typeof VerifyCertificate>
}
