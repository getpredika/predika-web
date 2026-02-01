// API Response Types for Predika API v1.0

// ============= User & Authentication Types =============

export interface User {
    id: number;
    uuid: string;
    fullName: string | null;
    email: string;
    avatar: string | null;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface RegisterRequest {
    fullName?: string;
    email: string;
    password: string;
    remember_me?: boolean;
}

export interface LoginRequest {
    email: string;
    password: string;
    remember_me?: boolean;
}

export interface VerifyEmailRequest {
    otp: string;
    type: "VERIFY_EMAIL" | "PASSWORD_RESET";
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    email: string;
    password: string;
    password_confirmation: string;
}

export interface ResendOTPRequest {
    email: string;
    type: "VERIFY_EMAIL" | "PASSWORD_RESET";
}

// ============= Dictionary Types =============

export type PartOfSpeech =
    | "a."
    | "abrv"
    | "adv"
    | "det"
    | "eltr."
    | "entw"
    | "eskl"
    | "fr"
    | "kon"
    | "n"
    | "nf"
    | "np"
    | "ono"
    | "pr"
    | "prefiks"
    | "pwo"
    | "sifiks"
    | "v"
    | "vf";

// Full display labels for part of speech abbreviations (Haitian Creole)
export const PartOfSpeechLabels: Record<PartOfSpeech, string> = {
    "a.": "adjektif",
    "abrv": "abrevyasyon",
    "adv": "advèb",
    "det": "detèminan",
    "eltr.": "elatriye",
    "entw": "entewogatif",
    "eskl": "esklamatif",
    "fr": "fraz",
    "kon": "konjonksyon",
    "n": "non",
    "nf": "fraz non",
    "np": "non pwòp",
    "ono": "onomatope",
    "pr": "prepozisyon",
    "prefiks": "prefiks",
    "pwo": "pwonon",
    "sifiks": "sifiks",
    "v": "vèb",
    "vf": "fraz vèb",
};

// Helper function to get the display label for a part of speech
export function getPartOfSpeechLabel(pos: PartOfSpeech): string {
    return PartOfSpeechLabels[pos] || pos;
}

export interface AudioFiles {
    conteuse?: string | null;
    presentateur?: string | null;
    narrateur?: string | null;
}

export interface Sense {
    id: number;
    partOfSpeech: PartOfSpeech;
    definition: string;
    example: string | null;
    order: number;
    synonyms: string[] | null;
    antonyms: string[] | null;
}

export interface Word {
    id: number;
    word: string;
    ipa: string | null;
    arpabet: string | null;
    variants: string[] | null;
    audio: AudioFiles | null;
    senses: Sense[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateWordRequest {
    word: string;
    ipa?: string;
    arpabet?: string;
    variants?: string[];
    audio?: AudioFiles;
    senses: Array<{
        partOfSpeech: PartOfSpeech;
        definition: string;
        example?: string;
        order?: number;
        synonyms?: string[];
        antonyms?: string[];
    }>;
}

export interface UpdateWordRequest extends Partial<CreateWordRequest> { }

export interface WordsListParams {
    page?: number;
    limit?: number;
    search?: string;
    [key: string]: string | number | boolean | undefined;
}

export interface PaginationMeta {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
    firstPage: number;
    firstPageUrl: string;
    lastPageUrl: string;
    nextPageUrl: string | null;
    previousPageUrl: string | null;
}

export interface WordsListResponse {
    data: Word[];
    meta: PaginationMeta;
}

// ============= Quiz Types =============

export type QuizType = "definition_quiz" | "listening_quiz";

// Definition Quiz Question - user sees definition, picks correct word
export interface DefinitionQuizQuestion {
    id: number;
    wordId: number;
    definition: string;
    example: string | null;
    partOfSpeech: string;
    ipa: string | null;
    options: string[];      // Array of 4 word strings
    correctIndex: number;   // Index (0-3) of the correct option
}

// Listening Quiz Option
export interface ListeningQuizOption {
    id: string;             // 'A', 'B', 'C', or 'D'
    definition: string;
    example: string | null;
    word: string;           // Submit this value as userAnswer
}

// Listening Quiz Question - user hears audio, picks correct definition
export interface ListeningQuizQuestion {
    id: number;
    wordId: number;
    audioUrl: string;
    partOfSpeech: string;
    ipa: string | null;
    options: ListeningQuizOption[];
    correctIndex: number;   // Index (0-3) of the correct option
}

// Union type for quiz questions
export type QuizQuestion = DefinitionQuizQuestion | ListeningQuizQuestion;

export interface QuizSession {
    sessionId: string;
    quizType: QuizType;
    totalQuestions: number;
    questions: QuizQuestion[];
}

export interface QuizAnswer {
    questionNumber: number;
    wordId: number;
    userAnswer: string;
    timeTaken?: number;
}

export interface SubmitQuizRequest {
    sessionId: string;
    answers: QuizAnswer[];
}

export interface QuizResult {
    questionNumber: number;
    wordId: number;
    word: string;
    selectedAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    timeTaken: number;
}

export interface SubmitQuizResponse {
    sessionId: string;
    score: number;
    totalQuestions: number;
    scorePercentage: number;
    correctAnswers: number;
    timeTaken: number;
    results: QuizResult[];
}

export interface QuizHistoryParams {
    page?: number;
    limit?: number;
    quiz_type?: QuizType;
    [key: string]: string | number | boolean | undefined;
}

export interface QuizHistoryItem {
    sessionId: string;
    quizType: QuizType;
    score: number;
    totalQuestions: number;
    scorePercentage: number;
    completedAt: string;
}

export interface QuizHistoryResponse {
    data: QuizHistoryItem[];
    meta: PaginationMeta;
}

export interface QuizStatsParams {
    quiz_type?: QuizType;
    [key: string]: string | number | boolean | undefined;
}

export interface RecentQuizActivity {
    date: string;
    quizzesCompleted: number;
    averageScore: number;
}

export interface QuizStats {
    totalQuizzes: number;
    totalQuestionsAnswered: number;
    totalCorrectAnswers: number;
    accuracyRate: number;
    averageScore: number;
    bestScore: number;
    currentStreak: number;
    longestStreak: number;
    recentActivity: RecentQuizActivity[];
}

// ============= Text Correction Types =============

export interface CorrectTextRequest {
    text: string;
}

export type CorrectionType = "spelling" | "grammar" | "punctuation" | "style";

export interface TextModification {
    original: string;
    corrected: string;
    explanation: string;
    type: CorrectionType;
    start: number;
    end: number;
}

export interface CorrectedTextResponse {
    original_text: string;
    corrected_text: string;
    modifications: TextModification[];
}


export interface NoCorrectionsResponse {
    no_corrections: string;
}

export type CorrectTextResponse = CorrectedTextResponse | NoCorrectionsResponse;

// ============= Text-to-Speech (TTS) Types =============

export interface TTSModel {
    id: string;
    name: string;
    description: string;
}

export interface TTSSpeaker {
    id: string;
    name: string;
    gender: "male" | "female";
    description: string;
    previewUrl: string;
}

export interface TTSGenerateRequest {
    text: string;
    speaker?: string;
    model?: string;
    temperature?: number;
    top_p?: number;
    repetition_penalty?: number;
    max_tokens?: number;
    num_return_sequences?: number;
}

export interface TTSGenerateMetadata {
    generationTime: number;
    decodeTime: number;
    totalTime: number;
    speaker: string;
    model: string;
}

export interface TTSGenerateResponse {
    audioBlob: Blob;
    audioUrl: string;
    metadata: TTSGenerateMetadata;
}

// ============= Pronunciation Assessment Types =============

export interface AssessmentPhone {
    phone: string;
    phone_id: number;
    phone_idx: number;
    gop: number;
    gop_z: number;
    occupancy: number;
    reliable: boolean;
    start_sec: number;
    end_sec: number;
    dur_sec: number;
    is_error: boolean;
    severity: "mild" | "medium" | "severe" | null;
    error_type: "mispronunciation" | null;
    top_competitors: unknown[];
    start_frame: number;
    end_frame: number;
}

export interface AssessmentWord {
    word: string;
    score: number;
    gop_z_mean: number;
    is_error: boolean;
    error_types: string[];
    num_phones: number;
    num_errors: number;
    phones: AssessmentPhone[];
}

export interface AssessmentBreakError {
    error_type: "unexpected_break" | "missing_break";
    severity: "mild" | "medium" | "severe";
    start_sec: number;
    end_sec: number;
    dur_sec: number;
}

export interface AssessmentResult {
    ok: true;
    utterance: {
        score: number;
        grade: string;
        num_phones: number;
        num_errors: number;
        num_words: number;
        accuracy_pct: number;
        method: string;
        mode: string;
    };
    scores: {
        accuracy: { score: number; n_correct: number; n_total: number };
        fluency: { score: number; phones_per_sec: number; pause_ratio: number; n_long_pauses: number };
        completeness: { score: number; n_spoken: number; n_expected: number; n_omitted: number };
        prosody: { score: number; f0_std: number; is_monotone: boolean; n_break_errors: number };
        overall: {
            score: number;
            grade: string;
            breakdown: { accuracy: number; fluency: number; completeness: number; prosody: number };
            weights: { accuracy: number; fluency: number; completeness: number; prosody: number };
        };
    };
    errors: {
        summary: {
            mispronunciation: number;
            omission: number;
            insertion: number;
            unexpected_break: number;
            missing_break: number;
            monotone: number;
            total: number;
        };
        break_errors: AssessmentBreakError[];
        prosody_errors: unknown[];
    };
    words: AssessmentWord[];
    prosody: {
        pitch: { f0_mean: number; f0_std: number; f0_range: number; voiced_fraction: number };
        energy: { mean_db: number; std_db: number };
        speaking_rate: { phones_per_sec: number; phones_per_sec_net: number; total_pause_sec: number; pause_ratio: number };
        monotone: { is_monotone: boolean; severity: string | null; f0_std: number; f0_range: number };
        n_pauses: number;
    };
    flags: { prompt_deviation: boolean; low_confidence: boolean };
    metadata: {
        audio_path: string | null;
        reference_text: string;
        num_frames: number;
        duration_sec: number;
        sequence_probability: number;
    };
}

export interface AssessmentError {
    ok: false;
    error: string;
    detail?: string;
    message?: string;
}

export type AssessMethod = "gop_sa" | "gop_af";
export type AssessMode = "posterior" | "margin" | "logitmargin";

export interface AssessPronunciationOptions {
    method?: AssessMethod;
    mode?: AssessMode;
}

// ============= Standard API Response Types =============

export interface ApiSuccessResponse<T = unknown> {
    data: T;
    message: string | null;
}

export interface ApiErrorResponse {
    message: string;
}

// ============= Helper type guards =============

export function isCorrectedTextResponse(
    response: CorrectTextResponse | null | undefined
): response is CorrectedTextResponse {
    return response != null && "corrected_text" in response;
}

export function isNoCorrectionsResponse(
    response: CorrectTextResponse | null | undefined
): response is NoCorrectionsResponse {
    return response != null && "no_corrections" in response;
}
