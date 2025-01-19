import type { Optional } from '@/core/@types/optional'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Slug } from './value-objets/slug'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import type { QuestionAttachment } from './question-attachment'

export interface QuestionProps {
  title: string
  slug: Slug
  content: string
  attachments: QuestionAttachment[]
  bestAnswerId?: UniqueEntityID
  authorId: UniqueEntityID
  createdAt: Date
  updatedAt?: Date
}

export class Question extends AggregateRoot<QuestionProps> {
  static create(
    props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>,
    id?: UniqueEntityID,
  ) {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        createdAt: props.createdAt ?? new Date(),
        attachments: props.attachments || [],
      },
      id,
    )

    return question
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  get authorId() {
    return this.props.authorId
  }
  get title() {
    return this.props.title
  }
  get slug() {
    return this.props.slug
  }
  get content() {
    return this.props.content
  }

  get attachments() {
    return this.props.attachments
  }
  set attachments(attachments: QuestionAttachment[]) {
    this.props.attachments = attachments
  }

  get createdAt() {
    return this.props.createdAt
  }
  get updatedAt() {
    return this.props.updatedAt
  }
  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  set title(title: string) {
    this.props.title = title
    this.props.slug = Slug.createFromText(title)
    this.touch()
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  set bestAnswerId(bestAnswerId: UniqueEntityID | undefined) {
    this.props.bestAnswerId = bestAnswerId
    this.touch()
  }
}
