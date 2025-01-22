import type { Notification } from '../../enterprise/entities/notification'

export interface NotificationsRepository {
  create(props: Notification): Promise<void>
}
