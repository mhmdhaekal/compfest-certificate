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
  .get('/certificate/:templateId/recipient', [DashboardController, 'renderRecipient'])
  .where('templateId', { cast: (value) => String(value) })
  .use(middleware.silent_auth())
router
  .post('api/certificate/filter', [DashboardController, 'filterCertificateTemplate'])
  .use(middleware.silent_auth())
router
  .get('/certificate/new-template', [DashboardController, 'renderNewCertificateTemplate'])
  .use(middleware.silent_auth())
router
  .post('/certificate/new-template', [DashboardController, 'newCertificateTemplate'])
  .use(middleware.silent_auth())
router
  .post('/api/certificate/:templateId', [CertificateController, 'createIndividualCertificate'])
  .where('templateId', { cast: (value) => String(value) })

router
  .post('/api/certificate/:templateId/parse', [CertificateController, 'importCertificateFromCSV'])
  .where('templateId', { cast: (value) => String(value) })

router
  .get('/api/certificate/:certificateId/pdf', [CertificateController, 'exportCertificatePdf'])
  .where('certificateId', { cast: (value) => String(value) })

router
  .get('/api/certificate/:certificateId/image', [CertificateController, 'exportCertificateJpg'])
  .where('certificateId', { cast: (value) => String(value) })

router
  .get('/api/upload/certificate/:certificateId', [UploadController, 'uploadIndividualCertificate'])
  .where('certificateId', { cast: (value) => String(value) })

router
  .get('/api/upload/certificate-template/:templateId', [UploadController, 'uploadBatchCertificate'])
  .where('templateId', { cast: (value) => String(value) })

router
  .get('/api/verify/certificate-template/:templateId', [
    VerifyController,
    'verifyGeneratedCertificate',
  ])
  .where('templateId', { cast: (value) => String(value) })

router
  .get('/api/email/certificate-template/:templateId', [EmailController, 'sendBatchEmail'])
  .where('templateId', { cast: (value) => String(value) })

router.get('/auth/login', [AuthController, 'renderLogin'])
router.post('/auth/login', [AuthController, 'login'])

router.get('/auth/register', [AuthController, 'renderRegister'])
router.post('/auth/register', [AuthController, 'register'])
