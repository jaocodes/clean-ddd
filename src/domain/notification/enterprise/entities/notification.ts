import type { Optional } from '@/core/@types/optional'
import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface NotificationProps {
  recipientId: UniqueEntityID
  title: string
  content: string
  createdAt: Date
  readAt?: Date
}

export class Notification extends Entity<NotificationProps> {
  get recipientId() {
    return this.props.recipientId
  }
  get title() {
    return this.props.title
  }
  get content() {
    return this.props.content
  }
  get createdAt() {
    return this.props.createdAt
  }
  get readAt() {
    return this.props.readAt
  }

  static create(
    props: Optional<NotificationProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const notification = new Notification(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return notification
  }
}
