import CertificateTemplate from '#models/certificate_template'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class DashboardController {
  constructor() {}

  async renderDashboard({ view, auth, response }: HttpContext) {
    if (!auth.isAuthenticated) {
      return response.redirect().toPath('/auth/login')
    }
    let certificateTemplate = await CertificateTemplate.query().preload('department')
    return view.render('pages/index', { certificateTemplate })
  }
}
