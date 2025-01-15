import { randomUUID } from 'node:crypto'
import type { Slug } from './value-objets/slug'

interface QuestionProps {
  title: string
  slug: Slug
  content: string
  authorId: string
}

export class Question {
  public id: string
  public title: string
  public slug: Slug
  public content: string
  public authorId: string

  constructor(props: QuestionProps, id?: string) {
    this.title = props.title
    this.content = props.content
    this.slug = props.slug
    this.authorId = props.authorId
    this.id = id ?? randomUUID()
  }
}
