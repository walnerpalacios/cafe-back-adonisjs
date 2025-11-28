import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user: string

  @column()
  declare client: string

  @column()
  declare mesa: string

  @column({
    prepare : (value:any) => JSON.stringify(value),
    consume : (value : string | null) => value ? JSON.parse(value) : []
  })
  declare details: any

  @column()
  declare total: number

    @column()
  declare discount: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}