/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import OrdersController from '#controllers/orders_controller'
import ProductsController from '#controllers/products_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import AuthController from '#controllers/auth_controller'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router
  .group(() => {
    router
      .group(() => {
        router.resource('products', ProductsController).apiOnly()
        router.resource('orders', OrdersController).apiOnly()

        router
          .group(() => {
            router.get('me', [AuthController, 'me'])
            router.get('logout', [AuthController, 'logout'])
          })
          .prefix('/auth')
      })
      .use(
        middleware.auth({
          guards: ['api'],
        })
      )

    router
      .group(() => {
        router.get('products', [ProductsController, 'index'])
        router.get('products/:id', [ProductsController, 'index'])
        router.get('orders/:id', [OrdersController, 'show'])
        router
          .group(() => {
            router.post('login', [AuthController, 'login'])
            router.post('register', [AuthController, 'register'])
          })
          .prefix('/auth')
      })
      .prefix('/public')
  })
  .prefix('/api/v1')
