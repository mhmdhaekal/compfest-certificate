import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import GeneratedCertificate from '#models/generated_certificate'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Department from '#models/department'

export default class CertificateTemplate extends BaseModel {
  static connection = 'primary'
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare eventName: string

  @column()
  declare awardName: string

  @column()
  declare imageUrl: string

  @column()
  declare width: number

  @column()
  declare height: number

  @column()
  declare labelPosition: number

  @column()
  declare bottomTextPosition: number

  @column()
  declare margin: number

  @column()
  declare departmentId: string // Foreign key for department

  @belongsTo(() => Department)
  declare department: BelongsTo<typeof Department>

  @hasMany(() => GeneratedCertificate)
  declare generatedCertificates: HasMany<typeof GeneratedCertificate>
}
