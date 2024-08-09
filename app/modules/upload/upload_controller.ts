import { inject } from '@adonisjs/core'
import UploadService from '#upload/upload_service'
import { HttpContext } from '@adonisjs/core/http'
import { DefaultResponseBuilder } from '../../utils/default_response_builder.js'

@inject()
export default class UploadController {
  constructor(protected uploadService: UploadService) {}

  async uploadIndividualCertificate({ params }: HttpContext) {
    let certificateLink = await this.uploadService.uploadSingleCertificate({
      certificateId: params.certificateId,
    })

    return new DefaultResponseBuilder<typeof certificateLink>()
      .setData(certificateLink)
      .setMessage('Successfully uploaded individual certificate')
      .setSuccess(true)
      .setStatusCode(200)
      .build()
  }

  async uploadBatchCertificate({ params }: HttpContext) {
    let generatedCertificates = await this.uploadService.uploadBatchCertificate({
      templateId: params.templateId,
    })
    return new DefaultResponseBuilder<typeof generatedCertificates>()
      .setData(generatedCertificates)
      .setMessage('Successfully uploaded individual certificate')
      .setSuccess(true)
      .setStatusCode(200)
      .build()
  }
}
