import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  AnswerComment,
  type AnswerCommentProps,
} from '@/domain/forum/enterprise/entities/answer-comment'

export function makeAnswerComment(
  override: Partial<AnswerCommentProps> = {},
  id?: UniqueEntityID,
) {
  const answercomment = AnswerComment.create(
    {
      authorId: new UniqueEntityID(),
      content: faker.lorem.text(),
      answerId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return answercomment
}
