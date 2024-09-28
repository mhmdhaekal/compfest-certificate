import CertificateTemplate from '#models/certificate_template'
import Department from '#models/department'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import DashboardService from './dashboard_service.js'
import { createCertificateTemplateValidator } from './validator/create_certificate_template.validator.js'
import GeneratedCertificate from '#models/generated_certificate'

@inject()
export default class DashboardController {
  constructor(protected dashboardService: DashboardService) {}

  async renderDashboard({ view, auth, response }: HttpContext) {
    if (!auth.isAuthenticated) {
      return response.redirect().toPath('/auth/login')
    }
    let certificateTemplate = await CertificateTemplate.query()
      .preload('department')
      .orderBy('created_at', 'desc')
    let departments = await Department.all()
    return view.render('pages/index', { certificateTemplate, departments })
  }

  async renderNewCertificateTemplate({ view, auth, response }: HttpContext) {
    if (!auth.isAuthenticated) {
      return response.redirect().toPath('/auth/login')
    }
    let departments = await Department.all()
    return view.render('pages/new_certificate_template', { departments })
  }

  async filterCertificateTemplate({ request, view, auth, response }: HttpContext) {
    if (!auth.isAuthenticated) {
      return response.redirect().toPath('/auth/login')
    }
    let { department, search } = request.only(['department', 'search'])
    let certificateTemplateQuery = CertificateTemplate.query().preload('department')

    if (department) {
      certificateTemplateQuery = certificateTemplateQuery.where('department_id', department)
    }

    if (search) {
      certificateTemplateQuery = certificateTemplateQuery.where((query) => {
        query.where('eventName', 'like', `%${search}%`).orWhere('awardName', 'like', `%${search}%`)
      })
    }

    let certificateTemplate = await certificateTemplateQuery

    return view.render('partial/dashboard/filter', { certificateTemplate })
  }

  async newCertificateTemplate({ request, auth, response }: HttpContext) {
    if (!auth.isAuthenticated) {
      response.redirect().toPath('/auth/login')
    }
    console.log('Im here')

    let image = request.file('image', {
      size: '2mb',
      extnames: ['jpg', 'jpeg'],
    })

    if (!image || !image.isValid) {
      return '<p>Invalid Image</p>'
    }

    let data = request.all()
    let payload = await createCertificateTemplateValidator.validate(data)
    let [res, success] = await this.dashboardService.newCertificateTemplate({
      eventName: payload.eventName,
      awardName: payload.awardName,
      width: payload.width,
      height: payload.height,
      labelPosition: payload.labelPosition,
      bottomTextPosition: payload.bottomTextPosition,
      margin: payload.margin,
      department: payload.department,
      image: image,
    })

    if (!success) {
      return res
    }

    response.append('HX-Redirect', '/')
    return res
  }

  async renderRecipient({ auth, view, response, params }: HttpContext) {
    if (!auth.isAuthenticated) {
      return response.redirect().toPath('/auth/login')
    }

    if (!params.templateId) {
      return response.redirect().toPath('/')
    }

    let template = await CertificateTemplate.query()
      .where('id', params.templateId)
      .preload('department')
      .first()

    if (!template) {
      return response.redirect().toPath('/')
    }

    let recipients = await GeneratedCertificate.query().where(
      'certificate_template_id',
      params.templateId
    )

    return view.render('pages/recipient', { recipients, template })
  }
}
