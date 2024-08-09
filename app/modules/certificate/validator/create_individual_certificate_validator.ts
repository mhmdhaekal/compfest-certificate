import vine from '@vinejs/vine'

export const createIndividualCertificateValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
  })
)
