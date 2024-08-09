import GeneratedCertificate from '#models/generated_certificate'
import VerifyCertificate from '#models/verify_certificate'

export default class CertificateAdapter {
  adapt(generatedCertificate: GeneratedCertificate): VerifyCertificate {
    const verifyCertificate = new VerifyCertificate()

    verifyCertificate.id = generatedCertificate.id
    verifyCertificate.recipientName = generatedCertificate.recipientName
    verifyCertificate.recipientAwardId = generatedCertificate.recipientAwardId
    verifyCertificate.recipientAwardEn = generatedCertificate.recipientAwardEn
    verifyCertificate.activityNameId = generatedCertificate.activityNameId
    verifyCertificate.activityNameEn = generatedCertificate.activityNameEn
    verifyCertificate.descriptionEn = generatedCertificate.descriptionEn
    verifyCertificate.descriptionId = generatedCertificate.descriptionId
    verifyCertificate.imageLink = generatedCertificate.imageLink
    verifyCertificate.imageAspectRatio = generatedCertificate.imageAspectRatio
    verifyCertificate.jpgDownloadLink = generatedCertificate.jpgDownloadLink
    verifyCertificate.pdfDownloadLink = generatedCertificate.pdfDownloadLink
    verifyCertificate.issuedOn = generatedCertificate.issuedOn
    verifyCertificate.expiredOn = generatedCertificate.expiredOn
    verifyCertificate.createdAt = generatedCertificate.createdAt
    verifyCertificate.updatedAt = generatedCertificate.updatedAt

    verifyCertificate.departmentId = generatedCertificate.departmentId

    return verifyCertificate
  }
}
