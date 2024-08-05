// Types of events that will be stored in the database.

export enum API_EVENT_TYPES {
  USER_SIGNED_UP = 'user_signed-up',
  USER_REQUESTED_PASSWORD_RECOVERY = 'user_requested-password-recovery',
  USER_NOT_FOUND_FOR_PASSWORD_RECOVERY = 'user_not-found-for-password-recovery',
  USER_RECOVERED_PASSWORD = 'user_recovered-password',
}
