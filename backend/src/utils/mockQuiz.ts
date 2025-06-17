import { QuizQuestion } from '../types/quiz'

export const generateMockQuiz = (topic: string): QuizQuestion[] => {
  return [
    {
      question: `What is a common use of ${topic}?`,
      choices: ['Nothing', 'Everything', 'Something', 'Anything'],
      correctIndex: 1,
    },
    {
      question: `Which of these is related to ${topic}?`,
      choices: ['Cats', topic, 'Sandwiches', 'Airplanes'],
      correctIndex: 1,
    },
    // Add more if you want
  ]
}