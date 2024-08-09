import CertificateGeneratorService from '../../utils/certificate_generator_service.js'
import CertificateTemplate from '#models/certificate_template'
import { inject } from '@adonisjs/core'
import NotFoundException from '#exceptions/not_found_exception'
import { randomUUID } from 'node:crypto'
import env from '#start/env'
import { User } from '#certificate/interface'
import * as fs from 'node:fs'
import { parse } from 'fast-csv'
import InternalErrorException from '#exceptions/internal_error_exception'
import GeneratedCertificate from '#models/generated_certificate'
import { DateTime } from 'luxon'
import { fromBuffer } from 'pdf2pic'

@inject()
export default class CertificatesService {
  constructor(protected certificateGeneratorService: CertificateGeneratorService) {}

  async generateIndividualCertificate({
    name,
    templateId,
  }: {
    name: string
    templateId: string
  }): Promise<Buffer> {
    let template = await CertificateTemplate.find(templateId)
    if (!template) {
      throw new NotFoundException(`template ${templateId} not found`)
    }

    let certificateId = this.generateCertificateId()

    return await this.certificateGeneratorService.generateCertificate({
      template,
      name,
      certificateId,
    })
  }

  async processBatchCertificate({
    templateId,
    csvFilePath,
  }: {
    templateId: string
    csvFilePath: string
  }) {
    let users = await this.processCsvToUser({ csvFilePath })
    let template = await CertificateTemplate.find(templateId)

    if (!template) {
      throw new NotFoundException(`template ${templateId} not found`)
    }

    for (let user of users) {
      let certificate = new GeneratedCertificate()
      let descriptionEn = `The certificate above verifies that ${user.name} has participated in ${template.eventName}. If you feel there is an error in the certificate, please contact the relevant activity committee.`
      let descriptionId = `Sertifikat di atas memverifikasi bahwa ${user.name} telah berpartisipasi dalam ${template.eventName}. Jika merasa ada kesalahan pada sertifikat, harap menghubungi panitia kegiatan terkait.`

      certificate.id = this.generateCertificateId()

      let pdfDownloadLink = `https://asset.compfest.id/certificate/${certificate.id}/${certificate.id}.pdf`
      let imageDownloadLink = `https://asset.compfest.id/certificate/${certificate.id}/${certificate.id}.jpeg`

      certificate.recipientName = user.name
      certificate.recipientEmail = user.email
      certificate.activityNameEn = template.eventName
      certificate.activityNameId = template.eventName
      certificate.recipientAwardEn = template.awardName
      certificate.recipientAwardId = template.awardName
      certificate.imageAspectRatio = `${template.width}/${template.height}`
      certificate.pdfDownloadLink = pdfDownloadLink
      certificate.jpgDownloadLink = imageDownloadLink
      certificate.departmentId = template.departmentId
      certificate.imageLink = imageDownloadLink
      certificate.descriptionEn = descriptionEn
      certificate.descriptionId = descriptionId
      certificate.certificateTemplateId = template.id
      certificate.issuedOn = DateTime.now()
      await template.related('generatedCertificates').save(certificate)
    }

    return {
      templateId: template.id,
      users,
    }
  }

  async exportCertificatePdf({ certificateId }: { certificateId: string }) {
    let certificate = await GeneratedCertificate.query()
      .where('id', certificateId)
      .preload('template')
      .first()
    if (!certificate) {
      throw new NotFoundException('certificate not found')
    }

    return await this.certificateGeneratorService.generateCertificate({
      template: certificate.template,
      name: certificate.recipientName,
      certificateId: certificateId,
    })
  }

  async exportCertificateJpg({ certificateId }: { certificateId: string }): Promise<Buffer> {
    let certificate = await GeneratedCertificate.query()
      .where('id', certificateId)
      .preload('template')
      .first()
    if (!certificate) {
      throw new NotFoundException('certificate not found')
    }

    let pdfFile = await this.certificateGeneratorService.generateCertificate({
      template: certificate.template,
      name: certificate.recipientName,
      certificateId: certificateId,
    })

    let image = await fromBuffer(pdfFile, {
      width: certificate.template.width,
      height: certificate.template.height,
      format: 'jpeg',
    }).bulk(1, {
      responseType: 'buffer',
    })

    if (!image[0].buffer) {
      throw new InternalErrorException('Failed to generate Certificate' + ' image file')
    }

    return image[0].buffer
  }

  private generateCertificateId(): string {
    let uuid = randomUUID()
    let year = env.get('YEAR')
    return `cf-${year}-${uuid}`
  }

  private async processCsvToUser({ csvFilePath }: { csvFilePath: string }): Promise<User[]> {
    return new Promise((resolve, reject) => {
      let stream = fs.createReadStream(csvFilePath)
      let users: User[] = []
      let csvStream = parse({ headers: true })
        .on('data', (row) => {
          let user: User = {
            name: row.name,
            email: row.email,
          }
          users.push(user)
          try {
          } catch (err) {
            reject(new InternalErrorException('Failed to parse csv stream', err))
          }
        })
        .on('end', () => {
          fs.unlink(csvFilePath, (err) => {
            if (err) {
              reject(new InternalErrorException('Failed delete tmp file', err))
            }
          })

          resolve(users)
        })
        .on('error', (err) => {
          reject(new InternalErrorException('Failed process csv file', err))
        })
      stream.pipe(csvStream)
    })
  }
}
