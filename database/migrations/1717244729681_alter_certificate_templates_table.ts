import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'certificate_templates'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('is_uploaded')
      table.dropColumn('is_on_verify')
      table.dropColumn('is_email_sent')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
