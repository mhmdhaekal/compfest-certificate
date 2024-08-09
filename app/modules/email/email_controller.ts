import { inject } from '@adonisjs/core'
import EmailService from '#email/email_service'
import { HttpContext } from '@adonisjs/core/http'
import { DefaultResponseBuilder } from '../../utils/default_response_builder.js'

@inject()
export default class EmailController {
  constructor(protected emailService: EmailService) {}

  async sendBatchEmail({ params }: HttpContext) {
    let certificate = await this.emailService.sendBatchEmail({ templateId: params.templateId })
    return new DefaultResponseBuilder<typeof certificate>()
      .setData(certificate)
      .setMessage('Successfully uploaded individual certificate')
      .setSuccess(true)
      .setStatusCode(200)
      .build()
  }
}
