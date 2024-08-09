import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'certificate_templates'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('is_uploaded').notNullable().defaultTo(false)
      table.boolean('is_on_verify').notNullable().defaultTo(false)
      table.boolean('is_email_sent').notNullable().defaultTo(false)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
