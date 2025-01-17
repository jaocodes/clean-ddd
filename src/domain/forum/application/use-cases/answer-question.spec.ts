import type { Answer } from '../../enterprise/entities/answer'
import type { AnswersRepository } from '../repositories/answers-repository'
import { AnswerQuestionUseCase } from './answer-question'

test('create an answer', async () => {
  const fakeAnswerRepository: AnswersRepository = {
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
