export enum NotificationsTitleEnum {
  /**
   * @param agentName
   */
  COLLABORATION_FEEDBACK = "You're working with %s for 1 month. Please, leave a feedback.",
  /**
   * @param artistName
   */
  COLLABORATION_ARTIST_DEACTIVATED = '%s deactivated his account.',
  COLLABORATION_AGENT_DEACTIVATED = 'Your agent has just deactivated their account',

  VERIFICATION_ACCEPTED = 'Your account has been verified!',
  VERIFICATION_DECLINED = 'Your account has not been verified. Go through it again, or contact support if you have any questions.',

  /**
   * @param eventName
   * @param artistName
   */
  EVENT_BOOKING_ACCEPTED = 'Your request for private event %s has accepted by %s',

  /**
   * @param eventName
   */
  EVENT_CANCELLED_BY_ARTIST = 'Event %s was canceled by artist. The entire amount paid by you will be returned within 24 hours. Sorry for the inconvenience!',
  /**
   * @param eventName
   */
  EVENT_REMINDER_1_HOUR = "Event %s will start in 1 hour. Don't forget to join.",
  /**
   * @param eventName
   */
  EVENT_REMINDER_15_MINUTES = 'Event %s will start in 15 minutes.',

  PAYMENT_REFUND = 'Your payment was refunded',
  /**
   * @param artistName
   */
  PAYMENT_ARTIST_DEACTIVATED = '%s deactivated account. The entire amount paid by you for all events will be returned within 24 hours. Sorry for the inconvenience!',

  PROMOTION_EXPIRE_1_HOUR = 'Your promotion subscription will expire in 1 hour.',
}
