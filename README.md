# Predika Web

Predika is a Vite + React web app for Haitian Creole language learning. The current product includes authentication, a public landing experience, and an authenticated studio with dictionary, quiz, speech, grammar, and progress tools.

## Features

- User authentication with email/password, OTP verification, password reset, and Google OAuth
- Public landing, privacy, and terms pages
- Authenticated studio mounted at `/studio`
- Dictionary search with word of the day, pronunciation, examples, synonyms, and antonyms
- Quiz modes for vocabulary and listening practice
- Text-to-speech generation with selectable voices and models
- Speech-to-text transcription with timestamped segments
- Pronunciation assessment with detailed scoring and transcript feedback
- Grammar and spelling correction for Haitian Creole text
- Progress dashboard backed by quiz history and stats

## Tech Stack

- [React 18](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Wouter](https://github.com/molefrog/wouter)
- [@tanstack/react-query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Recharts](https://recharts.org/)

## Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/getpredika/predika-web.git
   cd predika-web
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5173`.

## Configuration

- `VITE_API_URL`: overrides the default API base URL. If omitted, the app uses `https://api.predika.app`.

## Scripts

- `npm run dev`: start the Vite development server
- `npm run build`: build the production bundle
- `npm run lint`: run ESLint
- `npm run preview`: preview the production build locally
