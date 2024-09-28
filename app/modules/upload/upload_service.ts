import { inject } from '@adonisjs/core'
import CertificateGeneratorService from '../../utils/certificate_generator_service.js'
import GeneratedCertificate from '#models/generated_certificate'
import NotFoundException from '#exceptions/not_found_exception'
import { fromBuffer } from 'pdf2pic'
import InternalErrorException from '#exceptions/internal_error_exception'
import { s3Disk } from '../../utils/disk_s3.js'
import CertificateTemplate from '#models/certificate_template'
import { kafkaProducer } from '../../utils/kafka.js'
import env from '#start/env'

@inject()
export default class UploadService {
  constructor(protected certificateGeneratorService: CertificateGeneratorService) {}

  async uploadSingleCertificate({ certificateId }: { certificateId: string }) {
    let certificate = await GeneratedCertificate.query()
      .where('id', certificateId)
      .preload('template')
      .first()

    if (!certificate) {
      throw new NotFoundException('certificate not found')
    }

    if (certificate.isUploaded) {
      return {
        pdfLink: certificate.pdfDownloadLink,
        jpgLink: certificate.jpgDownloadLink,
      }
    }

    let pdfFile = await this.certificateGeneratorService.generateCertificate({
      template: certificate.template,
      name: certificate.recipientName,
      certificateId: certificate.id,
    })

    let image = await fromBuffer(pdfFile, {
      width: certificate.template.width,
      height: certificate.template.height,
      format: 'jpeg',
    }).bulk(1, {
      responseType: 'buffer',
    })

    if (!image[0]?.buffer) {
      throw new InternalErrorException('Failed to generate Certificate' + ' image file')
    }

    let imageFile = image[0].buffer

    let pdfKey = `certificate/${certificate.id}/${certificate.id}.pdf`
    let jpegKey = `certificate/${certificate.id}/${certificate.id}.jpeg`

    try {
      await s3Disk.put(pdfKey, pdfFile)
      await s3Disk.put(jpegKey, imageFile)
    } catch (error) {
      throw new InternalErrorException('Failed to upload files to S3', error)
    }

    certificate.isUploaded = true
    await certificate.save()

    return {
      pdfLink: certificate.pdfDownloadLink,
      jpgLink: certificate.jpgDownloadLink,
    }
  }

  async uploadBatchCertificate({ templateId }: { templateId: string }) {
    let certificates = await CertificateTemplate.query()
      .preload('generatedCertificates')
      .where('id', templateId)
      .first()

    if (!certificates) {
      throw new NotFoundException('certificate template not found')
    }
    await kafkaProducer.connect()

    for (let certificate of certificates.generatedCertificates) {
      if (!certificate.isUploaded) {
        let message = {
          certificateId: certificate.id,
        }
        await kafkaProducer.send({
          topic: `${env.get('KAFKA_TOPIC')}`,
          messages: [{ value: JSON.stringify(message) }],
        })
      }
    }

    await kafkaProducer.disconnect()
    return certificates.generatedCertificates
  }
}
