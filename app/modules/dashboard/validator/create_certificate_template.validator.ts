import vine from '@vinejs/vine'

export const createCertificateTemplateValidator = vine.compile(
  vine.object({
    eventName: vine.string().trim(),
    awardName: vine.string().trim(),
    width: vine.number(),
    height: vine.number(),
    labelPosition: vine.number(),
    bottomTextPosition: vine.number(),
    margin: vine.number(),
    department: vine.string(),
  })
)
