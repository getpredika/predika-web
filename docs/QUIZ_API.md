# Quiz API Documentation

Base URL: `/api/quiz`

## Overview

The Quiz API provides two types of quizzes:
1. **Definition Quiz** - User sees a definition and selects the correct word from 4 options
2. **Listening Quiz** - User hears audio of a word and selects the correct definition from 4 options

All quiz endpoints support both authenticated and guest users (via `silentAuth` middleware).

---

## Endpoints

### 1. Generate Definition Quiz

Generates a quiz with 10 questions where users match definitions to words.

**Endpoint:** `GET /api/quiz/definition`

**Authentication:** Optional (guest users can play)

**Response:**
```json
{
  "data": {
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "quizType": "definition_quiz",
    "totalQuestions": 10,
    "questions": [
      {
        "id": 1,
        "wordId": 123,
        "definition": "Yon moun ki travay nan jaden",
        "example": "Kiltivatè a plante mayi nan jaden li.",
        "partOfSpeech": "n",
        "ipa": "kil.ti.va.tɛ",
        "options": ["doktè", "kiltivatè", "pwofesè", "chofè"],
        "correctIndex": 1
      }
    ]
  },
  "message": null
}
```

**Frontend Usage:**
```typescript
const response = await fetch('/api/quiz/definition', {
  headers: {
    'Authorization': `Bearer ${token}` // Optional
  }
});
const { data } = await response.json();

// Display each question
data.questions.forEach(question => {
  // Show: question.definition
  // Show options as buttons: question.options (array of 4 words)
  // User selects one of the words

  // After user answers, show immediate feedback:
  const correctWord = question.options[question.correctIndex];
  if (userSelection === correctWord) {
    showCorrectFeedback();
  } else {
    showWrongFeedback(correctWord);
  }
});
```

---

### 2. Generate Listening Quiz

Generates a quiz with 10 questions where users listen to audio and select the matching definition.

**Endpoint:** `GET /api/quiz/listening`

**Authentication:** Optional (guest users can play)

**Response:**
```json
{
  "data": {
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "quizType": "listening_quiz",
    "totalQuestions": 10,
    "questions": [
      {
        "id": 1,
        "wordId": 123,
        "audioUrl": "https://cdn.example.com/audio/conteuse/kiltivatè.mp3",
        "partOfSpeech": "n",
        "ipa": "kil.ti.va.tɛ",
        "options": [
          {
            "id": "A",
            "definition": "Yon moun ki geri malad",
            "example": "Doktè a egzamine pasyan an.",
            "word": "doktè"
          },
          {
            "id": "B",
            "definition": "Yon moun ki travay nan jaden",
            "example": "Kiltivatè a plante mayi.",
            "word": "kiltivatè"
          },
          {
            "id": "C",
            "definition": "Yon moun ki anseye",
            "example": "Pwofesè a ap esplike leson an.",
            "word": "pwofesè"
          },
          {
            "id": "D",
            "definition": "Yon moun ki kondui machin",
            "example": "Chofè a kondui bis la.",
            "word": "chofè"
          }
        ],
        "correctIndex": 1
      }
    ]
  },
  "message": null
}
```

**Frontend Usage:**
```typescript
const response = await fetch('/api/quiz/listening', {
  headers: {
    'Authorization': `Bearer ${token}` // Optional
  }
});
const { data } = await response.json();

// Display each question
data.questions.forEach(question => {
  // Play audio: question.audioUrl
  // Show 4 definition options as buttons
  // Each option has: id, definition, example, word
  // When user selects an option, store option.word for submission

  // After user answers, show immediate feedback:
  const correctOption = question.options[question.correctIndex];
  if (selectedOption.word === correctOption.word) {
    showCorrectFeedback();
  } else {
    showWrongFeedback(correctOption.definition);
  }
});
```

---

### 3. Submit Quiz Answers

Submit answers for a completed quiz and receive the score.

**Endpoint:** `POST /api/quiz/submit`

**Authentication:** Optional

**Request Body:**
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "answers": [
    {
      "questionNumber": 1,
      "wordId": 123,
      "userAnswer": "kiltivatè",
      "timeTaken": 3.5
    },
    {
      "questionNumber": 2,
      "wordId": 456,
      "userAnswer": "doktè",
      "timeTaken": 2.8
    }
  ]
}
```

**Important Notes:**
- For **Definition Quiz**: `userAnswer` is the word the user selected from the options
- For **Listening Quiz**: `userAnswer` is the `word` field from the selected option (NOT the option id)
- `timeTaken` is optional (in seconds)

**Response:**
```json
{
  "data": {
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "score": 8,
    "totalQuestions": 10,
    "scorePercentage": 80,
    "correctAnswers": 8,
    "timeTaken": 35.5,
    "results": [
      {
        "questionNumber": 1,
        "isCorrect": true,
        "correctWord": "kiltivatè",
        "userAnswer": "kiltivatè",
        "definition": "Yon moun ki travay nan jaden",
        "example": "Kiltivatè a plante mayi."
      },
      {
        "questionNumber": 2,
        "isCorrect": false,
        "correctWord": "pwofesè",
        "userAnswer": "doktè",
        "definition": "Yon moun ki anseye",
        "example": "Pwofesè a ap esplike leson an."
      }
    ]
  },
  "message": "Kiz la soumèt avèk siksè."
}
```

**Frontend Usage:**
```typescript
// For Definition Quiz
const answers = questions.map((q, index) => ({
  questionNumber: index + 1,
  wordId: q.wordId,
  userAnswer: selectedWord, // The word string user clicked
  timeTaken: timeSpentOnQuestion
}));

// For Listening Quiz
const answers = questions.map((q, index) => ({
  questionNumber: index + 1,
  wordId: q.wordId,
  userAnswer: selectedOption.word, // Use the 'word' field, NOT 'id'
  timeTaken: timeSpentOnQuestion
}));

const response = await fetch('/api/quiz/submit', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` // Optional
  },
  body: JSON.stringify({ sessionId, answers })
});
```

---

### 4. Get Quiz History

Get paginated history of completed quizzes for the authenticated user.

**Endpoint:** `GET /api/quiz/history`

**Authentication:** Required

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 20 | Items per page |
| quiz_type | string | - | Filter by quiz type: `definition_quiz` or `listening_quiz` |

**Response:**
```json
{
  "data": [
    {
      "sessionId": "550e8400-e29b-41d4-a716-446655440000",
      "quizType": "definition_quiz",
      "score": 8,
      "totalQuestions": 10,
      "scorePercentage": 80,
      "completedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "meta": {
    "total": 25,
    "perPage": 20,
    "currentPage": 1,
    "lastPage": 2
  }
}
```

**Frontend Usage:**
```typescript
const response = await fetch('/api/quiz/history?page=1&limit=10&quiz_type=definition_quiz', {
  headers: {
    'Authorization': `Bearer ${token}` // Required
  }
});
```

---

### 5. Get Quiz Statistics

Get overall quiz statistics for the authenticated user.

**Endpoint:** `GET /api/quiz/stats`

**Authentication:** Required

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| quiz_type | string | - | Filter by quiz type: `definition_quiz` or `listening_quiz` |

**Response:**
```json
{
  "data": {
    "totalQuizzes": 15,
    "averageScore": 75.5,
    "bestScore": 100,
    "totalQuestionsAnswered": 150,
    "totalCorrectAnswers": 113,
    "accuracyRate": 75.33,
    "recentActivity": [
      {
        "date": "2024-01-15",
        "quizzesCompleted": 3,
        "averageScore": 80
      },
      {
        "date": "2024-01-14",
        "quizzesCompleted": 2,
        "averageScore": 70
      }
    ]
  },
  "message": null
}
```

**Frontend Usage:**
```typescript
// Get all stats
const response = await fetch('/api/quiz/stats', {
  headers: {
    'Authorization': `Bearer ${token}` // Required
  }
});

// Get stats for specific quiz type
const response = await fetch('/api/quiz/stats?quiz_type=listening_quiz', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## Error Responses

### Validation Error (422)
```json
{
  "message": "ID sesyon pa valab"
}
```

### Not Found (404)
```json
{
  "message": "Kiz sa a pa jwenn."
}
```

### Duplicate Submission (409)
```json
{
  "message": "Kiz sa a deja soumèt."
}
```

### Insufficient Words (422)
```json
{
  "message": "Pa gen ase mo nan diksyonè a pou kreye yon kiz."
}
```

### Unauthorized (401)
```json
{
  "message": "Unauthorized access"
}
```

---

## Complete Flow Example

### Definition Quiz Flow
```typescript
// 1. Generate quiz
const quizRes = await fetch('/api/quiz/definition');
const { data: quiz } = await quizRes.json();

// 2. Store session ID
const sessionId = quiz.sessionId;

// 3. Display questions and collect answers
const userAnswers = [];
for (const question of quiz.questions) {
  // Display question.definition
  // Show question.options as clickable buttons
  // When user clicks an option:
  userAnswers.push({
    questionNumber: question.id,
    wordId: question.wordId,
    userAnswer: clickedOption, // The word string they clicked
    timeTaken: calculateTime()
  });
}

// 4. Submit answers
const submitRes = await fetch('/api/quiz/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ sessionId, answers: userAnswers })
});
const { data: results } = await submitRes.json();

// 5. Display results
console.log(`Score: ${results.score}/${results.totalQuestions}`);
results.results.forEach(r => {
  if (r.isCorrect) {
    console.log(`Q${r.questionNumber}: ✓ Correct!`);
  } else {
    // Show the correct answer when user was wrong
    console.log(`Q${r.questionNumber}: ✗ Wrong. You answered "${r.userAnswer}", correct was "${r.correctWord}"`);
  }
  // Can also show the definition for context
  console.log(`  Definition: ${r.definition}`);
});
```

### Listening Quiz Flow
```typescript
// 1. Generate quiz
const quizRes = await fetch('/api/quiz/listening');
const { data: quiz } = await quizRes.json();

// 2. Store session ID
const sessionId = quiz.sessionId;

// 3. Display questions and collect answers
const userAnswers = [];
for (const question of quiz.questions) {
  // Play audio from question.audioUrl
  // Show question.options as clickable cards with definition and example
  // When user clicks an option:
  userAnswers.push({
    questionNumber: question.id,
    wordId: question.wordId,
    userAnswer: clickedOption.word, // IMPORTANT: Use the 'word' field!
    timeTaken: calculateTime()
  });
}

// 4. Submit answers
const submitRes = await fetch('/api/quiz/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ sessionId, answers: userAnswers })
});
const { data: results } = await submitRes.json();

// 5. Display results - show correct answers for wrong responses
console.log(`Score: ${results.score}/${results.totalQuestions}`);
results.results.forEach(r => {
  if (r.isCorrect) {
    console.log(`Q${r.questionNumber}: ✓ Correct! The word was "${r.correctWord}"`);
  } else {
    console.log(`Q${r.questionNumber}: ✗ Wrong. Correct answer: "${r.correctWord}"`);
    console.log(`  Definition: ${r.definition}`);
  }
});
```

---

## How Correct Answers Work

Each question includes a `correctIndex` field (0-3) that indicates which option is the correct answer. This enables **immediate feedback** after each question.

### Using correctIndex for Immediate Feedback
```typescript
// Definition Quiz
const correctWord = question.options[question.correctIndex];
const isCorrect = userSelectedWord === correctWord;

// Listening Quiz
const correctOption = question.options[question.correctIndex];
const isCorrect = userSelectedOption.word === correctOption.word;
```

### After Submission
The response `results` array contains for each question:

| Field | Description |
|-------|-------------|
| `isCorrect` | `true` if user answered correctly |
| `correctWord` | The correct word (always revealed) |
| `userAnswer` | What the user submitted |
| `definition` | The definition of the correct word |
| `example` | Example sentence (can be null) |

### Example: Displaying Results
```typescript
// After submitting, show a review screen
results.results.forEach((result, index) => {
  const question = originalQuestions[index]; // Store questions when generating quiz

  // For Definition Quiz - highlight correct option
  if (quizType === 'definition_quiz') {
    question.options.forEach(option => {
      if (option === result.correctWord) {
        // Highlight this option in green (correct answer)
      }
      if (option === result.userAnswer && !result.isCorrect) {
        // Highlight this option in red (user's wrong choice)
      }
    });
  }

  // For Listening Quiz - highlight correct definition
  if (quizType === 'listening_quiz') {
    question.options.forEach(option => {
      if (option.word === result.correctWord) {
        // Highlight this definition in green (correct answer)
      }
      if (option.word === result.userAnswer && !result.isCorrect) {
        // Highlight this definition in red (user's wrong choice)
      }
    });
  }
});
```

---

## TypeScript Interfaces

```typescript
// Definition Quiz Question
interface DefinitionQuizQuestion {
  id: number;
  wordId: number;
  definition: string;
  example: string | null;
  partOfSpeech: string;
  ipa: string | null;
  options: string[];     // Array of 4 word strings
  correctIndex: number;  // Index (0-3) of the correct option
}

// Listening Quiz Question
interface ListeningQuizQuestion {
  id: number;
  wordId: number;
  audioUrl: string;
  partOfSpeech: string;
  ipa: string | null;
  options: Array<{
    id: string;        // 'A', 'B', 'C', or 'D'
    definition: string;
    example: string | null;
    word: string;      // Submit this value as userAnswer
  }>;
  correctIndex: number;  // Index (0-3) of the correct option
}

// Quiz Answer (for submission)
interface QuizAnswer {
  questionNumber: number;
  wordId: number;
  userAnswer: string;
  timeTaken?: number; // in seconds
}

// Submit Request
interface SubmitQuizRequest {
  sessionId: string; // UUID
  answers: QuizAnswer[];
}

// Quiz Result
interface QuizResult {
  sessionId: string;
  score: number;
  totalQuestions: number;
  scorePercentage: number;
  correctAnswers: number;
  timeTaken: number;
  results: Array<{
    questionNumber: number;
    isCorrect: boolean;
    correctWord: string;
    userAnswer: string;
    definition: string;
    example: string | null;
  }>;
}
```
