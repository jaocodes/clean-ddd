import type { Question } from '../../enterprise/entities/question'
import type { QuestionsRepository } from '../repositories/questions-repository'
import { CreateQuestionUseCase } from './create-question'

test('create a question', async () => {
  const fakeQuestionRepository: QuestionsRepository = {
    create: async (question: Question) => {
      return
    },
  }

  const createQuestion = new CreateQuestionUseCase(fakeQuestionRepository)

  const { question } = await createQuestion.execute({
    authorId: '1',
    title: 'Nova pergunta',
    content: 'Conteúdo da nova pergunta',
  })

  expect(question.id).toBeTruthy()
})
