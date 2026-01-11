import type { HttpContext } from '@adonisjs/core/http'
import { submitQuizValidator } from '#validators/quiz'
import QuizService from '#services/quiz_service'

export default class QuizzesController {
  /**
   * Generate a definition quiz with 10 random questions
   * GET /api/quiz/definition
   */
  async generateDefinitionQuiz({ response, auth }: HttpContext) {
    try {
      const questions = await QuizService.generateQuestions('definition_quiz', 10)
      const quizSession = await QuizService.createSession(
        'definition_quiz',
        auth.user?.id || null,
        10
      )

      return response.ok({
        data: {
          sessionId: quizSession.uuid,
          quizType: 'definition_quiz',
          totalQuestions: 10,
          questions,
        },
        message: null,
      })
    } catch (error) {
      if (error.message?.includes('Pa gen ase')) {
        return response.unprocessableEntity({ message: error.message })
      }
      return response.internalServerError({
        message: 'Yon erè fèt pandan kreye kiz la.',
      })
    }
  }

  /**
   * Generate a listening quiz with 10 random questions
   * GET /api/quiz/listening
   */
  async generateListeningQuiz({ response, auth }: HttpContext) {
    try {
      const questions = await QuizService.generateListeningQuestions(10)
      const quizSession = await QuizService.createSession(
        'listening_quiz',
        auth.user?.id || null,
        10
      )

      return response.ok({
        data: {
          sessionId: quizSession.uuid,
          quizType: 'listening_quiz',
          totalQuestions: 10,
          questions,
        },
        message: null,
      })
    } catch (error) {
      if (error.message?.includes('Pa gen ase')) {
        return response.unprocessableEntity({ message: error.message })
      }
      return response.internalServerError({
        message: 'Yon erè fèt pandan kreye kiz la.',
      })
    }
  }

  /**
   * Submit quiz answers and calculate score
   * POST /api/quiz/submit
   */
  async submitQuiz({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(submitQuizValidator)

      const { correctCount, results } = await QuizService.calculateScore(
        payload.sessionId,
        payload.answers
      )

      const totalTime = payload.answers.reduce((sum, a) => sum + (a.timeTaken || 0), 0)

      const quizSession = await QuizService.completeSession(
        payload.sessionId,
        correctCount,
        totalTime
      )

      return response.ok({
        data: {
          sessionId: quizSession.uuid,
          score: correctCount,
          totalQuestions: quizSession.totalQuestions,
          scorePercentage: Math.round(quizSession.scorePercentage! * 100) / 100,
          correctAnswers: correctCount,
          timeTaken: Math.round(totalTime * 100) / 100,
          results,
        },
        message: 'Kiz la soumèt avèk siksè.',
      })
    } catch (error) {
      if (error.code === 'E_VALIDATION_ERROR') {
        return response.unprocessableEntity({ message: error.messages[0].message })
      }
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'Kiz sa a pa jwenn.' })
      }
      if (error.message?.includes('deja soumèt')) {
        return response.conflict({ message: error.message })
      }
      return response.internalServerError({
        message: 'Yon erè fèt pandan trete repons yo.',
      })
    }
  }

  /**
   * Get user's quiz history
   * GET /api/quiz/history
   */
  async getHistory({ request, response, auth }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 20)
      const quizType = request.input('quiz_type')

      const result = await QuizService.getHistory(auth.user!.id, page, limit, quizType)

      return response.ok(result)
    } catch (error) {
      return response.internalServerError({
        message: 'Yon erè fèt pandan chaje istwa kiz yo.',
      })
    }
  }

  /**
   * Get user's quiz statistics
   * GET /api/quiz/stats
   */
  async getStats({ request, response, auth }: HttpContext) {
    try {
      const quizType = request.input('quiz_type')

      const stats = await QuizService.getStatistics(auth.user!.id, quizType)

      return response.ok({
        data: stats,
        message: null,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Yon erè fèt pandan kalkile estatistik yo.',
      })
    }
  }
}
