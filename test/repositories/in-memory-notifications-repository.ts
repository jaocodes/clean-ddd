import type { NotificationsRepository } from '@/domain/notification/application/repositories/notificationsRepository'
import type { Notification } from '@/domain/notification/enterprise/entities/notification'

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  public items: Notification[] = []

  async findById(id: string): Promise<Notification | null> {
    const notification = this.items.find((item) => item.id.toString() === id)

    if (!notification) return null

    return notification
  }

  async create(notification: Notification) {
    this.items.push(notification)
  }

  async save(notification: Notification): Promise<void> {
    const indexToSave = this.items.findIndex(
      (item) => item.id === notification.id,
    )

    this.items[indexToSave] = notification
  }
}
