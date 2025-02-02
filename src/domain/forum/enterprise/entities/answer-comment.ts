import type { Optional } from '@/core/@types/optional'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Comment, type CommentProps } from './comment'
import { AnswerCommentCreatedEvent } from '../events/answer-comment-created-event'

export interface AnswerCommentProps extends CommentProps {
  answerId: UniqueEntityID
}

export class AnswerComment extends Comment<AnswerCommentProps> {
  static create(
    props: Optional<AnswerCommentProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const answerComment = new AnswerComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    const isNewAnswerComment = !id
    if (isNewAnswerComment) {
      answerComment.addDomainEvent(new AnswerCommentCreatedEvent(answerComment))
    }

    return answerComment
  }

  get answerId() {
    return this.props.answerId
  }
}
