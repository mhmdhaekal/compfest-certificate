import CertificatesService from './certificates_service.js'
import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { createIndividualCertificateValidator } from '#certificate/validator/create_individual_certificate_validator'
import BadRequestException from '#exceptions/bad_request_exception'
import InternalErrorException from '#exceptions/internal_error_exception'
import { DefaultResponseBuilder } from '../../utils/default_response_builder.js'

@inject()
export default class CertificatesController {
  constructor(protected certificateService: CertificatesService) {}

  async createIndividualCertificate({ request, params, response }: HttpContext) {
    let data = request.all()
    let payload = await createIndividualCertificateValidator.validate(data)
    let template = await this.certificateService.generateIndividualCertificate({
      templateId: params.templateId,
      name: payload.name,
    })
    response.safeHeader('Content-Type', 'application/pdf')

    return response.send(template)
  }

  async importCertificateFromCSV({ request, params }: HttpContext) {
    let csvFile = request.file('recipientData', {
      extnames: ['csv'],
    })

    if (!csvFile) {
      return new BadRequestException('Please provide recipient data')
    }

    if (!csvFile.isValid) {
      return new BadRequestException('Please provide recipient data')
    }

    let path = csvFile.tmpPath

    if (!path) {
      return new InternalErrorException('Something wrong, please try again')
    }

    let res = await this.certificateService.processBatchCertificate({
      templateId: params.templateId,
      csvFilePath: path,
    })

    return new DefaultResponseBuilder<typeof res>()
      .setData(res)
      .setMessage('Success parse user')
      .setSuccess(true)
      .setStatusCode(200)
      .build()
  }

  async exportCertificatePdf({ params, response }: HttpContext) {
    let pdfFile = await this.certificateService.exportCertificatePdf({
      certificateId: params.certificateId,
    })
    response.safeHeader('Content-Type', 'application/pdf')
    return response.send(pdfFile)
  }

  async exportCertificateJpg({ params, response }: HttpContext) {
    let imageFile = await this.certificateService.exportCertificateJpg({
      certificateId: params.certificateId,
    })
    response.safeHeader('Content-Type', 'image/jpeg')
    return response.send(imageFile)
  }
}
