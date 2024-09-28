import CertificateTemplate from '#models/certificate_template'
import NotFoundException from '#exceptions/not_found_exception'
import { inject } from '@adonisjs/core'
import CertificateAdapter from '#models/adapter/certificate_adapter'
import VerifyCertificate from '#models/verify_certificate'
import GeneratedCertificate from '#models/generated_certificate'

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
    let finalCertificates: VerifyCertificate[] = []
    let finalGenerated: GeneratedCertificate[] = []
    for (let certificate of certificates) {
      let verifyCertificate = this.certificateAdapter.adapt(certificate)
      certificate.isOnVerify = true
      finalCertificates.push(verifyCertificate)
      finalGenerated.push(certificate)
    }
    await GeneratedCertificate.updateOrCreateMany('id', finalGenerated)
    await VerifyCertificate.updateOrCreateMany('id', finalCertificates)
  }
}
