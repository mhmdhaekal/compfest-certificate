import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'generated_certificates'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('description_en').alter()
      table.text('description_id').alter()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
