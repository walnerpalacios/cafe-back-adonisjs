import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name')
      table.string('reference').unique().notNullable()
      table.text('description').notNullable()
      table.string('image_url').notNullable()
      table.string('category').notNullable()
      table.decimal('price', 10, 2).notNullable()
      table.decimal('tax', 10, 2).notNullable()
      table.integer('stock').defaultTo(0)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}