import CertificateTemplate from '#models/certificate_template'
import Department from '#models/department'
import { inject } from '@adonisjs/core'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { s3Disk } from '../../utils/disk_s3.js'
import { createReadStream } from 'node:fs'
import { cuid } from '@adonisjs/core/helpers'
import env from '#start/env'

@inject()
export default class DashboardService {
  async newCertificateTemplate({
    eventName,
    awardName,
    width,
    height,
    labelPosition,
    bottomTextPosition,
    margin,
    department,
    image,
  }: {
    eventName: string
    awardName: string
    width: number
    height: number
    labelPosition: number
    bottomTextPosition: number
    margin: number
    department: string
    image: MultipartFile
  }) {
    let certificateTemplate = new CertificateTemplate()
    certificateTemplate.id = cuid()
    certificateTemplate.eventName = eventName
    certificateTemplate.awardName = awardName
    certificateTemplate.width = width
    certificateTemplate.height = height
    certificateTemplate.labelPosition = labelPosition
    certificateTemplate.bottomTextPosition = bottomTextPosition
    certificateTemplate.margin = margin

    let checkDepartment = await Department.findBy('ID', department)
    if (!checkDepartment) {
      return ['<p>Department not valid</p>', false]
    }
    let now = new Date()
    certificateTemplate.departmentId = department
    let finalPath = `certificate-template/${now.getFullYear()}/${image.clientName}`
    console.log(finalPath)
    if (!image.tmpPath) {
      return ['<p>Something wrong! please try again</p>', false]
    }

    let imageStream
    try {
      imageStream = createReadStream(image.tmpPath)
    } catch (error) {
      return [`<p>Error reading the image file: ${error.message}</p>`, false]
    }

    try {
      await s3Disk.putStream(finalPath, imageStream)
    } catch (error) {
      return [`<p>Failed to upload image to S3: ${error.message}</p>`, false]
    }

    try {
      let assetUrl = env.get('ASSET_URL')
      certificateTemplate.imageUrl = `${assetUrl}/${finalPath}`
      await certificateTemplate.save()
    } catch (error) {
      return [`<p>Failed to save the certificate template: ${error.message}</p>`, false]
    }
    return ['OK', true]
  }
}
