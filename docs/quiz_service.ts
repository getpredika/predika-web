import DictionaryWord from '#models/dictionary_word'
import QuizType from '#models/quiz_type'
import QuizSession from '#models/quiz_session'
import QuizAnswerModel from '#models/quiz_answer'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import env from '#start/env'
import type { AudioPaths } from '#models/dictionary_word'

export type QuizQuestion = {
  id: number
  wordId: number
  definition: string
  example: string | null
  partOfSpeech: string
  ipa: string | null
  options: string[]
  correctIndex: number
}

export type ListeningQuizQuestion = {
  id: number
  wordId: number
  audioUrl: string
  options: Array<{
    id: string
    definition: string
    example: string | null
    word: string
  }>
  partOfSpeech: string
  ipa: string | null
  correctIndex: number
}

export type QuizResult = {
  questionNumber: number
  isCorrect: boolean
  correctWord: string
  userAnswer: string
  definition: string
  example: string | null
}

export type QuizAnswerInput = {
  questionNumber: number
  wordId: number
  userAnswer: string
  timeTaken?: number
}

class QuizService {
  /**
   * Generate random questions for a quiz
   */
  async generateQuestions(_quizTypeCode: string, count: number = 10): Promise<QuizQuestion[]> {
    // Get random words with their senses
    const words = await DictionaryWord.query()
      .preload('senses', (query) => {
        query.orderBy('order', 'asc')
      })
      .whereHas('senses', (query) => {
        query.whereNotNull('definition')
      })
      .orderByRaw('RANDOM()')
      .limit(count)

    if (words.length < count) {
      throw new Error(`Pa gen ase mo nan diksyonè a pou kreye yon kiz.`)
    }

    // Generate questions with distractors
    const questions = await Promise.all(
      words.map(async (word, index) => {
        const sense = word.senses[0] // Use first sense
        const distractors = await this.selectDistractors(word, sense.partOfSpeech, 3)

        // Create options array with correct answer + distractors
        const options = [word.word, ...distractors]

        // Shuffle options
        options.sort(() => Math.random() - 0.5)

        // Find the correct answer index after shuffling
        const correctIndex = options.indexOf(word.word)

        return {
          id: index + 1,
          wordId: word.id,
          definition: sense.definition,
          example: sense.example,
          partOfSpeech: sense.partOfSpeech,
          ipa: word.ipa,
          options,
          correctIndex,
        }
      })
    )

    return questions
  }

  /**
   * Smart distractor selection algorithm
   * Selects 3 similar but incorrect words based on:
   * - Same part of speech
   * - Similar word length
   * - Different first letter (avoid visual confusion)
   */
  async selectDistractors(
    correctWord: DictionaryWord,
    partOfSpeech: string,
    count: number = 3
  ): Promise<string[]> {
    const wordLength = correctWord.word.length

    // Try to get distractors with same part of speech
    const distractors = await DictionaryWord.query()
      .whereHas('senses', (query) => {
        query.where('part_of_speech', partOfSpeech)
      })
      .where('id', '!=', correctWord.id)
      .whereRaw('LENGTH(word) BETWEEN ? AND ?', [wordLength - 2, wordLength + 2])
      .whereRaw('SUBSTRING(word, 1, 1) != ?', [correctWord.word[0]])
      .orderByRaw('RANDOM()')
      .limit(count)

    // If not enough distractors, get any random words
    if (distractors.length < count) {
      const additionalNeeded = count - distractors.length
      const additional = await DictionaryWord.query()
        .where('id', '!=', correctWord.id)
        .whereNotIn(
          'id',
          distractors.map((d) => d.id)
        )
        .orderByRaw('RANDOM()')
        .limit(additionalNeeded)

      distractors.push(...additional)
    }

    return distractors.map((d) => d.word)
  }

  /**
   * Select distractor definitions for listening quiz
   * Selects 3 different definitions from words with the same part of speech
   */
  async selectDefinitionDistractors(
    correctWord: DictionaryWord,
    partOfSpeech: string,
    count: number = 3
  ): Promise<DictionaryWord[]> {
    // Try to get distractors with same part of speech
    const distractors = await DictionaryWord.query()
      .preload('senses', (query) => {
        query.orderBy('order', 'asc')
      })
      .whereHas('senses', (query) => {
        query.where('part_of_speech', partOfSpeech).whereNotNull('definition')
      })
      .where('id', '!=', correctWord.id)
      .orderByRaw('RANDOM()')
      .limit(count)

    // If not enough distractors, get any random words with definitions
    if (distractors.length < count) {
      const additionalNeeded = count - distractors.length
      const additional = await DictionaryWord.query()
        .preload('senses', (query) => {
          query.orderBy('order', 'asc')
        })
        .whereHas('senses', (query) => {
          query.whereNotNull('definition')
        })
        .where('id', '!=', correctWord.id)
        .whereNotIn(
          'id',
          distractors.map((d) => d.id)
        )
        .orderByRaw('RANDOM()')
        .limit(additionalNeeded)

      distractors.push(...additional)
    }

    return distractors
  }

  /**
   * Get audio URL with priority: conteuse > presentateur > narrateur
   */
  private getAudioUrl(audio: AudioPaths | null): string {
    if (!audio) throw new Error('Mo sa a pa gen odyo')

    const R2_CUSTOM_DOMAIN = env.get('R2_CUSTOM_DOMAIN')

    if (audio.conteuse) {
      return `https://${R2_CUSTOM_DOMAIN}/conteuse/${audio.conteuse}`
    }
    if (audio.presentateur) {
      return `https://${R2_CUSTOM_DOMAIN}/presentateur/${audio.presentateur}`
    }
    if (audio.narrateur) {
      return `https://${R2_CUSTOM_DOMAIN}/narrateur/${audio.narrateur}`
    }

    throw new Error('Mo sa a pa gen odyo disponib')
  }

  /**
   * Generate listening quiz questions
   * User hears audio and selects the correct definition from 4 options
   */
  async generateListeningQuestions(count: number = 10): Promise<ListeningQuizQuestion[]> {
    // Get random words that have audio
    const words = await DictionaryWord.query()
      .preload('senses', (query) => {
        query.orderBy('order', 'asc')
      })
      .whereHas('senses', (query) => {
        query.whereNotNull('definition')
      })
      .whereNotNull('audio')
      .orderByRaw('RANDOM()')
      .limit(count)

    if (words.length < count) {
      throw new Error(`Pa gen ase mo ak odyo nan diksyonè a pou kreye yon kiz.`)
    }

    // Generate questions with definition distractors
    const questions = await Promise.all(
      words.map(async (word, index) => {
        const sense = word.senses[0]

        // Get audio URL (prefer conteuse, fallback to presentateur, then narrateur)
        const audioUrl = this.getAudioUrl(word.audio)

        // Select 3 distractor definitions (same part of speech, different words)
        const distractorWords = await this.selectDefinitionDistractors(word, sense.partOfSpeech, 3)

        // Build options with correct definition + 3 distractors (without ids yet)
        const optionsWithoutIds = [
          {
            definition: sense.definition,
            example: sense.example,
            word: word.word,
          },
          ...distractorWords.map((dWord) => ({
            definition: dWord.senses[0].definition,
            example: dWord.senses[0].example,
            word: dWord.word,
          })),
        ]

        // Shuffle options first
        optionsWithoutIds.sort(() => Math.random() - 0.5)

        // Find the correct answer index after shuffling
        const correctIndex = optionsWithoutIds.findIndex((opt) => opt.word === word.word)

        // Assign ids AFTER shuffling
        const options = optionsWithoutIds.map((opt, idx) => ({
          id: String.fromCharCode(65 + idx), // A, B, C, D
          definition: opt.definition,
          example: opt.example,
          word: opt.word,
        }))

        return {
          id: index + 1,
          wordId: word.id,
          audioUrl,
          options,
          partOfSpeech: sense.partOfSpeech,
          ipa: word.ipa,
          correctIndex,
        }
      })
    )

    return questions
  }

  /**
   * Create a new quiz session
   */
  async createSession(
    quizTypeCode: string,
    userId: number | null,
    totalQuestions: number = 10
  ): Promise<QuizSession> {
    const quizType = await QuizType.query().where('code', quizTypeCode).firstOrFail()

    return await QuizSession.create({
      userId,
      quizTypeId: quizType.id,
      totalQuestions,
    })
  }

  /**
   * Calculate score and process answers
   */
  async calculateScore(
    sessionUuid: string,
    answers: QuizAnswerInput[]
  ): Promise<{ correctCount: number; results: QuizResult[] }> {
    const quizSession = await QuizSession.query()
      .where('uuid', sessionUuid)
      .preload('quizType')
      .firstOrFail()

    if (quizSession.completedAt) {
      throw new Error('Kiz sa a deja soumèt.')
    }

    let correctCount = 0
    const results: QuizResult[] = []

    for (const answer of answers) {
      const word = await DictionaryWord.query()
        .where('id', answer.wordId)
        .preload('senses', (query) => {
          query.orderBy('order', 'asc')
        })
        .firstOrFail()

      const isCorrect = answer.userAnswer.toLowerCase() === word.word.toLowerCase()
      if (isCorrect) correctCount++

      // Save answer
      await QuizAnswerModel.create({
        quizSessionId: quizSession.id,
        questionNumber: answer.questionNumber,
        wordId: answer.wordId,
        userAnswer: answer.userAnswer,
        isCorrect,
        timeTakenSeconds: answer.timeTaken || null,
      })

      const sense = word.senses[0]
      results.push({
        questionNumber: answer.questionNumber,
        isCorrect,
        correctWord: word.word,
        userAnswer: answer.userAnswer,
        definition: sense.definition,
        example: sense.example,
      })
    }

    return { correctCount, results }
  }

  /**
   * Complete a quiz session with final score
   */
  async completeSession(
    sessionUuid: string,
    correctCount: number,
    totalTime: number
  ): Promise<QuizSession> {
    const quizSession = await QuizSession.query().where('uuid', sessionUuid).firstOrFail()

    const scorePercentage = (correctCount / quizSession.totalQuestions) * 100

    quizSession.correctAnswers = correctCount
    quizSession.scorePercentage = scorePercentage
    quizSession.timeTakenSeconds = Math.round(totalTime)
    quizSession.completedAt = DateTime.now()
    await quizSession.save()

    return quizSession
  }

  /**
   * Get user statistics
   */
  async getStatistics(userId: number, quizTypeCode?: string) {
    const query = QuizSession.query().where('user_id', userId).whereNotNull('completed_at')

    if (quizTypeCode) {
      query.whereHas('quizType', (q) => {
        q.where('code', quizTypeCode)
      })
    }

    const stats: any = await query
      .select(
        db.raw('COUNT(*) as total_quizzes'),
        db.raw('AVG(score_percentage) as average_score'),
        db.raw('MAX(score_percentage) as best_score'),
        db.raw('SUM(total_questions) as total_questions'),
        db.raw('SUM(correct_answers) as total_correct')
      )
      .first()

    // Get recent activity (last 7 days)
    const recentActivity = await db.rawQuery(
      `
      SELECT DATE(completed_at) as date,
             COUNT(*) as quizzes_completed,
             AVG(score_percentage) as average_score
      FROM quiz_sessions
      WHERE user_id = ?
        AND completed_at >= NOW() - INTERVAL '7 days'
        AND completed_at IS NOT NULL
      GROUP BY DATE(completed_at)
      ORDER BY date DESC
    `,
      [userId]
    )

    return {
      totalQuizzes: Number(stats?.total_quizzes || 0),
      averageScore: Math.round((stats?.average_score || 0) * 100) / 100,
      bestScore: Math.round((stats?.best_score || 0) * 100) / 100,
      totalQuestionsAnswered: Number(stats?.total_questions || 0),
      totalCorrectAnswers: Number(stats?.total_correct || 0),
      accuracyRate: stats?.total_questions
        ? Math.round((Number(stats.total_correct) / Number(stats.total_questions)) * 10000) / 100
        : 0,
      recentActivity: recentActivity.rows.map((row: any) => ({
        date: row.date,
        quizzesCompleted: Number(row.quizzes_completed),
        averageScore: Math.round(row.average_score * 100) / 100,
      })),
    }
  }

  /**
   * Get paginated quiz history for a user
   */
  async getHistory(userId: number, page: number = 1, limit: number = 20, quizTypeCode?: string) {
    const query = QuizSession.query()
      .where('user_id', userId)
      .whereNotNull('completed_at')
      .preload('quizType')
      .orderBy('completed_at', 'desc')

    if (quizTypeCode) {
      query.whereHas('quizType', (q) => {
        q.where('code', quizTypeCode)
      })
    }

    const sessions = await query.paginate(page, limit)

    const data = sessions.all().map((session) => ({
      sessionId: session.uuid,
      quizType: session.quizType.code,
      score: session.correctAnswers,
      totalQuestions: session.totalQuestions,
      scorePercentage: session.scorePercentage,
      completedAt: session.completedAt,
    }))

    return {
      data,
      meta: sessions.getMeta(),
    }
  }
}

export default new QuizService()
