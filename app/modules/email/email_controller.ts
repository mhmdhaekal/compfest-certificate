import { inject } from '@adonisjs/core'
import EmailService from '#email/email_service'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class EmailController {
  constructor(protected emailService: EmailService) {}

  async sendBatchEmail({ params }: HttpContext) {
    await this.emailService.sendBatchEmail({ templateId: params.templateId })
    return '<p>Success send email</p>'
  }
}
