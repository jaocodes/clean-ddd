import { expect, test } from 'vitest'
import { AnswerQuestionUseCase } from './answer-question'

test('create an answer', () => {
  const answerQuestion = new AnswerQuestionUseCase()

  const answer = answerQuestion.execute({
    content: 'Primeira resposta',
    instructorId: '1',
    questionId: '1',
  })

  expect(answer.content).toEqual('Primeira resposta')
})
