import { BaseMail } from '@adonisjs/mail'
import { SendCertificatesConfig } from '#mails/interface/send_certificates_interface'
import env from '#start/env'

export default class SendCertificateNotification extends BaseMail {
  constructor(config: SendCertificatesConfig) {
    super()
    this.config = config
    this.subject = `Sertifikat ${this.config.eventName} - ${this.config.awardName}`
  }

  declare config: SendCertificatesConfig
  declare subject
  from = {
    address: 'no-reply@compfest.id',
    name: 'COMPFEST 16',
  }

  prepare() {
    let link = `${env.get('COMPFEST_VERIFY_URL')}/${this.config.certificateId}`
    this.message.to(this.config.recipientEmail)
    this.message.htmlView('emails/verify_certificate_html', {
      name: this.config.recipientName,
      eventName: this.config.eventName,
      link,
      certificateId: this.config.certificateId,
      awardName: this.config.awardName,
    })

    this.message.textView('emails/verify_certificate_text', {
      name: this.config.recipientName,
      eventName: this.config.eventName,
      link,
      certificateId: this.config.certificateId,
    })
  }
}
