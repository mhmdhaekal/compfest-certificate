import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import AuthService from './auth_service.js'
import User from '#models/user'

@inject()
export default class AuthController {
  constructor(protected authService: AuthService) {}

  async renderLogin({ view }: HttpContext) {
    return view.render('pages/login')
  }

  async login({ request, auth, response }: HttpContext) {
    let { email, password } = request.only(['email', 'password'])

    if (!email || !password) {
      return '<p>Invalid credentials</p>'
    }
    try {
      const user = await User.verifyCredentials(email, password)
      if (!user.authorizedToLogin) {
        return '<p>You do not have authorize to login</p>'
      }
      await auth.use('web').login(user)
      response.append('HX-Redirect', '/')
      return 'OK'
    } catch (error) {
      return '<p>Invalid credentials</p>'
    }
  }

  async renderRegister({ view }: HttpContext) {
    return view.render('pages/register')
  }

  async register({ request, view }: HttpContext) {
    let { fullName, email, password } = request.only(['fullName', 'email', 'password'])

    if (!fullName || !email || !password) {
      return '<p>Invalid Data</p>'
    }
    let user = new User()
    user.fullName = fullName
    user.email = email
    user.password = password
    user.save()

    return view.render('partial/register/success')
  }
}
