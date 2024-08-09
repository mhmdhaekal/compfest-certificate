import { inject } from '@adonisjs/core'
import CertificateTemplate from '#models/certificate_template'
import NotFoundException from '#exceptions/not_found_exception'
import { SendCertificatesConfig } from '#mails/interface/send_certificates_interface'
import mail from '@adonisjs/mail/services/main'
import SendCertificateNotification from '#mails/send_certificate_notification'

@inject()
export default class EmailService {
  async sendBatchEmail({ templateId }: { templateId: string }) {
    let template = await CertificateTemplate.query()
      .preload('generatedCertificates')
      .where('id', templateId)
      .first()

    if (!template) {
      throw new NotFoundException('template not found')
    }
    let certificates = template.generatedCertificates

    for (let certificate of certificates) {
      let config: SendCertificatesConfig = {
        eventName: template.eventName,
        recipientEmail: certificate.recipientEmail,
        recipientName: certificate.recipientName,
        certificateId: certificate.id,
      }
      await mail.sendLater(new SendCertificateNotification(config))
    }
    return certificates
  }
}
