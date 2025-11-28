import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProductsController {
  /**
   * Display a list of resource
   */
  async index({ response, request }: HttpContext) {
    const page = request.input('page')
    const search = request.input('search', "")
    let all = []
    if (page) {
      const limit = request.input('limit')
      all = await Product.query().paginate(page, limit)
    }else if(search.trim() !== ''){
      const limit = request.input('limit')
      all = await Product.query().whereLike('name','%'+search.trim()+'%').paginate(page, limit)
    } else {
      all = await Product.all()
    }
    return response.json({
      messages: 'Productos recuperados exitosamente',
      data: all,
    })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const data = request.all() 

    const exist = await Product.query().where('reference', data.reference).first()
    if (!exist) {
      const product = await Product.create(data)
      return response.status(201).json({
        message: 'Producto creado exitosamente...',
        data: product,
      })
    } else {
      return response.badRequest({
        message: `Ya existe un producto con esa referencia ${data.reference}`,
      })
    }
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    const data = await Product.findOrFail(params.id)

    return response.json({
      message: 'Producto recuperados exitosamente',
      data: data,
    })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    let product = await Product.findOrFail(params.id)
    if (product) {
      const data = request.all()
      product.name = data.name
      product.reference = data.reference
      product.description = data.description
      product.image_url = data.image_url
      product.category = data.category
      product.price = data.price
      product.tax = data.tax
      product.stock = data.stock

      await product.save()
      return response.json({
        message: 'Producto actualizado exitosamente',
        data: product,
      })
    } else {
      return response.badRequest({
        message: 'No se logro actualizar el producto',
        product,
      })
    }
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    if (product) {
      await product.delete()
      return response.json({
        message: 'Poducto eliminado exitosamente',
      })
    } else {
      return response.badRequest({
        message: 'No se logro eliminar el producto',
      })
    }
  }
}
