import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'certificate_templates'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary().unique()
      table.string('event_name').notNullable()
      table.string('image_url').notNullable()
      table.integer('width').notNullable()
      table.integer('height').notNullable()
      table.integer('label_position').notNullable()
      table.integer('bottom_text_position').notNullable()
      table.integer('margin').notNullable()
      table.string('department_id').notNullable().references('id').inTable('departments')
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
