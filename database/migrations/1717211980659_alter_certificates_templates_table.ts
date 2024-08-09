import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'certificate_templates'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('award_name')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
