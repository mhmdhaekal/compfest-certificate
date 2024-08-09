import CertificateTemplate from '#models/certificate_template'
import NotFoundException from '#exceptions/not_found_exception'
import { inject } from '@adonisjs/core'
import CertificateAdapter from '#models/adapter/certificate_adapter'

@inject()
export default class VerifyService {
  constructor(protected certificateAdapter: CertificateAdapter) {}

  async verifyCertificate({ templateId }: { templateId: string }) {
    let template = await CertificateTemplate.query()
      .preload('generatedCertificates')
      .where('id', templateId)
      .first()
    if (!template) {
      throw new NotFoundException('templateId not found')
    }

    let certificates = template.generatedCertificates

    for (let certificate of certificates) {
      let verifyCertificate = this.certificateAdapter.adapt(certificate)
      await verifyCertificate.save()
    }
  }
}
