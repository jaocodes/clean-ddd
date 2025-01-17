import type { Answer } from '../entities/answer'
import type { AnswerRepository } from '../repositories/answer-repository'
import { AnswerQuestionUseCase } from './answer-question'

test('create an answer', async () => {
  const fakeAnswerRepository: AnswerRepository = {
    create: async (answer: Answer) => {
      return
    },
  }

  const answerQuestion = new AnswerQuestionUseCase(fakeAnswerRepository)

  const answer = await answerQuestion.execute({
    content: 'Primeira resposta',
    instructorId: '1',
    questionId: '1',
  })

  expect(answer.content).toEqual('Primeira resposta')
})
