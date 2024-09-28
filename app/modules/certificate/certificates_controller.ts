import CertificatesService from './certificates_service.js'
import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { createIndividualCertificateValidator } from '#certificate/validator/create_individual_certificate_validator'

@inject()
export default class CertificatesController {
  constructor(protected certificateService: CertificatesService) {}

  async createIndividualCertificate({ request, params, response }: HttpContext) {
    let data = request.all()
    let payload = await createIndividualCertificateValidator.validate(data)
    let template = await this.certificateService.generateIndividualCertificate({
      templateId: params.templateId,
      name: payload.name,
    })
    const hxRequestValue = request.header('HX-Request')
    console.log(hxRequestValue)
    if (hxRequestValue) {
      const base64Pdf = template.toString('base64')
      const htmlResponse = `
        <script>
          function downloadPDF() {
            const pdfData = atob('${base64Pdf}');
            const pdfBlob = new Blob([new Uint8Array(pdfData.length).map((_, i) => pdfData.charCodeAt(i))], {type: 'application/pdf'});
            const downloadUrl = URL.createObjectURL(pdfBlob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = '${payload.name}.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(downloadUrl);
          }
          downloadPDF();
        </script>
      `
      return htmlResponse
    }

    response.safeHeader('Content-Type', 'application/pdf')
    response.header('Content-Disposition', `attachment; filename="${payload.name}.pdf"`)
    return response.send(template)
  }

  async importCertificateFromCSV({ request, params, view }: HttpContext) {
    let csvFile = request.file('recipientData', {
      extnames: ['csv'],
    })

    if (!csvFile) {
      return '<p>Invalid CSV</p>'
    }

    if (!csvFile.isValid) {
      return '<p>Invalid CSV</p>'
    }

    let path = csvFile.tmpPath

    if (!path) {
      return '<p>Something wrong, please try again</p>'
    }

    let { templates } = await this.certificateService.processBatchCertificate({
      templateId: params.templateId,
      csvFilePath: path,
    })
    return view.render('partial/dashboard/recipient', { recipients: templates })
  }

  async exportCertificatePdf({ params, response }: HttpContext) {
    let pdfFile = await this.certificateService.exportCertificatePdf({
      certificateId: params.certificateId,
    })
    response.safeHeader('Content-Type', 'application/pdf')
    response.append('HX-Redirect', `/api/certificate/${params.certificateId}/pdf`)
    return response.send(pdfFile)
  }

  async exportCertificateJpg({ params, response }: HttpContext) {
    let imageFile = await this.certificateService.exportCertificateJpg({
      certificateId: params.certificateId,
    })
    response.safeHeader('Content-Type', 'image/jpeg')
    return response.send(imageFile)
  }
}
