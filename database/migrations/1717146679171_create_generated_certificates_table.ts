import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'generated_certificates'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').notNullable().unique()
      table.string('recipient_name').notNullable()
      table.string('recipient_email').notNullable()
      table.string('recipient_award_id').notNullable()
      table.string('recipient_award_en').notNullable()
      table.string('activity_name_id').notNullable()
      table.string('activity_name_en').notNullable()
      table.string('description_en').nullable()
      table.string('description_id').nullable()
      table.string('image_link').notNullable()
      table.string('image_aspect_ratio').notNullable()
      table.string('jpg_download_link').notNullable()
      table.string('pdf_download_link').notNullable()
      table.dateTime('issued_on').notNullable()
      table.dateTime('expired_on').nullable()
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
      table.string('department_id').references('id').inTable('departments')
      table.string('certificate_template_id').references('id').inTable('certificate_templates')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
