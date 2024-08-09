import { Exception } from '@adonisjs/core/exceptions'

export default class BadRequestException extends Exception {
  static status = 400
}
