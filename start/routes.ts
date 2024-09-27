/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const CertificateController = () => import('#certificate/certificates_controller')
const UploadController = () => import('#upload/upload_controller')
const VerifyController = () => import('#verify/verify_controller')
const EmailController = () => import('#email/email_controller')
const AuthController = () => import('#authentication/auth_controller')
const DashboardController = () => import('#dashboard/dashboard_controller')

router.get('/', [DashboardController, 'renderDashboard']).use(middleware.silent_auth())

router
  .post('/certificate/:templateId', [CertificateController, 'createIndividualCertificate'])
  .where('templateId', { cast: (value) => String(value) })

router
  .post('/certificate/:templateId/parse', [CertificateController, 'importCertificateFromCSV'])
  .where('templateId', { cast: (value) => String(value) })

router
  .get('/certificate/:certificateId/pdf', [CertificateController, 'exportCertificatePdf'])
  .where('certificateId', { cast: (value) => String(value) })

router
  .get('/certificate/:certificateId/image', [CertificateController, 'exportCertificateJpg'])
  .where('certificateId', { cast: (value) => String(value) })

router
  .get('/upload/certificate/:certificateId', [UploadController, 'uploadIndividualCertificate'])
  .where('certificateId', { cast: (value) => String(value) })

router
  .get('/upload/certificate-template/:templateId', [UploadController, 'uploadBatchCertificate'])
  .where('templateId', { cast: (value) => String(value) })

router
  .get('/verify/certificate-template/:templateId', [VerifyController, 'verifyGeneratedCertificate'])
  .where('templateId', { cast: (value) => String(value) })

router
  .get('/email/certificate-template/:templateId', [EmailController, 'sendBatchEmail'])
  .where('templateId', { cast: (value) => String(value) })

router.get('/auth/login', [AuthController, 'renderLogin'])
router.post('/auth/login', [AuthController, 'login'])

router.get('/auth/register', [AuthController, 'renderRegister'])
router.post('/auth/register', [AuthController, 'register'])
