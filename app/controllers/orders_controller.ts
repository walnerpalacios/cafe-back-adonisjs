import Order from '#models/order'
import type { HttpContext } from '@adonisjs/core/http'

export default class OrdersController {
  /**
   * Display a list of resource
   */
  async index({ response, request }: HttpContext) {
    const page = request.input('page')
    const search = request.input('search', '')
    let all = []
    if (page) {
      const limit = request.input('limit')
      all = await Order.query().paginate(page, limit)
    } else if (search.trim() !== '') {
      const limit = request.input('limit')
      all = await Order.query()
        .whereLike('id', search)
        .paginate(page, limit)
    } else {
      all = await Order.all()
    }
    return response.json({
      messages: 'Pedidos recuperados exitosamente',
      data: all,
    })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const data = request.all()
    const order = await Order.create(data)
    return response.status(201).json({
      message: 'Pedido creado exitosamente...',
      data: order,
    })
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    const data = await Order.findOrFail(params.id)

    return response.json({
      message: 'Pedido recuperados exitosamente',
      data: data,
    })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    let order = await Order.findOrFail(params.id)
    if (order) {
      const data = request.all()
      order.user = data.user
      order.client = data.client
      order.mesa = data.mesa
      order.details = data.details
      order.total = data.total
      order.discount = data.discount

      await order.save()
      return response.json({
        message: 'pedido actualizado exitosamente',
        data: order,
      })
    } else {
      return response.badRequest({
        message: 'No se logro actualizar el producto',
        order,
      })
    }
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const product = await Order.findOrFail(params.id)
    if (product) {
      await product.delete()
      return response.json({
        message: 'Pedido eliminado exitosamente',
      })
    } else {
      return response.badRequest({
        message: 'No se logro eliminar el pedido',
      })
    }
  }
}
