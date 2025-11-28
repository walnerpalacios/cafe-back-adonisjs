import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    try {
      const data = request.only(['fullName', 'email', 'password', 'role'])
      const exist = await User.query().where('email', data.email).first()

      if (!exist) {
        const user = await User.create(data)
        const token = await User.accessTokens.create(user)
        return response.json({
          message: 'Usuario creado exitosamente',
          type: 'Bearer',
          token: token.value!.release(),
        })
      } else {
        return response.badRequest({ message: 'Ya existe una cuenta con ese correo' })
      }
    } catch (error) {
      return response.badRequest({ message: 'Error al crear el usuario', error })
    }
  }

  async login({ request, response }: HttpContext) {
    try {
      const data = request.only(['email', 'password'])
      const user = await User.verifyCredentials(data.email, data.password)
      const token = await User.accessTokens.create(user)
      return response.json({
        message: 'Sesion iniciada exitosamente',
        type: 'Bearer',
        token: token.value!.release(),
        user
      })
    } catch (error) {
      return response.unauthorized({ message: 'Credenciales invalidas', error })
    }
  }

  async logout({auth, response}: HttpContext) {
    try {
      const userId = auth.user?.id
      const user = await User.findOrFail(userId)
      await User.accessTokens.delete(user, user.id)
      return response.json({ message: 'Cierre de sesión exitoso' })
    } catch (error) {
      return response.badRequest({ message: 'Error al cerrar sesión', error })
    }
  }

  async me({auth, response}: HttpContext) {
    try {
      await auth.authenticate()
      const user = auth.getUserOrFail()
      return response.json({ user })
      
    } catch (error) {
      return response.unauthorized({ message: 'No autenticado', error })
    }
  }
}
