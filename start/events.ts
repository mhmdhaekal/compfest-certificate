import emitter from '@adonisjs/core/services/emitter'
import GeneratedCertificate from '#models/generated_certificate'

emitter.on('mail:sent', async (event) => {
  let certificateId = event.views.html?.data.certificateId
  let certificate = await GeneratedCertificate.find(certificateId)
  if (!certificate) {
    throw new Error('Certificate not found')
  }
  certificate.isEmailSent = true
  await certificate.save()
  console.log(`Certificate email sent: ${certificateId} to ${certificate.recipientName}`)
})
