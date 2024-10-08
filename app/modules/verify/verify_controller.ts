import { inject } from '@adonisjs/core'
import VerifyService from '#verify/verify_service'
import { HttpContext } from '@adonisjs/core/http'

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
