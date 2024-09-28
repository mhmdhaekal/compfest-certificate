import { inject } from '@adonisjs/core'
import VerifyService from '#verify/verify_service'
import { HttpContext } from '@adonisjs/core/http'
import { DefaultResponseBuilder } from '../../utils/default_response_builder.js'

@inject()
export default class VerifyController {
  constructor(protected verifyService: VerifyService) {}

  async verifyGeneratedCertificate({ params }: HttpContext) {
    await this.verifyService.verifyCertificate({
      templateId: params.templateId,
    })

    return '<p>Success upload to verify</p>'
  }
}
