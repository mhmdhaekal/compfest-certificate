import qrCode from 'qrcode'
import PDFDocument from 'pdfkit'
import env from '#start/env'
import CertificateTemplate from '#models/certificate_template'

export default class CertificateGeneratorService {
  async generateCertificate({
    template,
    certificateId,
    name,
  }: {
    template: CertificateTemplate
    certificateId: string
    name: string
  }): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      try {
        let doc = new PDFDocument({
          size: [template.width, template.height],
        })

        let buffers: Buffer[] = []
        doc.on('data', buffers.push.bind(buffers))
        doc.on('end', () => {
          let pdfData = Buffer.concat(buffers)
          resolve(pdfData)
        })

        let image = await this.getImage({ imageUrl: template.imageUrl })
        doc.image(image, 0, 0, {
          width: template.width,
          height: template.height,
        })

        let fontSize = 58
        let pageWidth = template.width
        let labelPosition = template.labelPosition
        let bottomTextPosition = template.bottomTextPosition
        let margin = template.margin

        let font = await this.getFont()
        doc.registerFont('Lexend', font)
        doc.font('Lexend')
        doc.fontSize(fontSize)
        doc.fillColor('white')
        let centerBetweenLabelAndBottom = labelPosition + (bottomTextPosition - labelPosition) / 2
        let textWidth = doc.widthOfString(name)
        if (textWidth > pageWidth - 2 * margin) {
          centerBetweenLabelAndBottom -= fontSize / 2
        }
        doc.text(name, margin, centerBetweenLabelAndBottom, {
          width: pageWidth - 2 * margin,
          align: 'center',
          ellipsis: true,
        })
        let qrCodeBuffer = await this.generateQrCode({ certificateId })
        doc.image(qrCodeBuffer, 60, 1090, { width: 300, height: 300 })
        doc.end()
      } catch (error) {
        reject(error)
      }
    })
  }

  private async getImage({ imageUrl }: { imageUrl: string }): Promise<Buffer> {
    let response = await fetch(imageUrl)
    if (!response.ok) throw new Error(`Failed to fetch image from ${imageUrl}`)
    let image = await response.arrayBuffer()
    return Buffer.from(image)
  }

  private async generateQrCode({ certificateId }: { certificateId: string }): Promise<Buffer> {
    let verifyUrl = env.get('COMPFEST_VERIFY_URL')
    let url = `${verifyUrl}/${certificateId}`
    return qrCode.toBuffer(url, {
      width: 300,
      color: {
        light: '#0000',
        dark: '#ffffff',
      },
    })
  }

  private async getFont(): Promise<ArrayBuffer> {
    let fontResponse = await fetch(`https://asset.compfest.id/font/Lexend-Bold.ttf`)
    return await fontResponse.arrayBuffer()
  }
}
