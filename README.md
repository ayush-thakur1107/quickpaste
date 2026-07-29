# QuickPaste

A minimal, no-login paste-sharing app. Paste text, get a short code, retrieve it anytime.

Built with Next.js 15 (App Router), TypeScript, MongoDB/Mongoose, Tailwind CSS, and Framer Motion.

## Features

- **No accounts, no passwords** — just a 7-character code
- Save text and retrieve it later from any device
- Optional **"Delete after reading"** — paste is removed after its first successful retrieval
- Character counter, 1 MB size limit, whitespace trimming
- Keyboard shortcuts: `Ctrl/Cmd + Enter` to generate, `Enter` to retrieve
- Last generated code cached in `localStorage` for quick re-copying after a refresh
- Copy-to-clipboard buttons with a "Copied!" confirmation
- Dark mode by default, with a light mode toggle
- Toast notifications and loading states throughout
- Responsive, accessible, production-ready UI

## Tech Stack

| Layer      | Choice                              |
|------------|--------------------------------------|
| Frontend   | Next.js 15 (App Router) + TypeScript |
| Backend    | Next.js API Routes                   |
| Database   | MongoDB + Mongoose                   |
| Styling    | Tailwind CSS (shadcn-style primitives) |
| Icons      | lucide-react                         |
| Animation  | Framer Motion                        |
| Toasts     | sonner                               |
| Theming    | next-themes                          |

## Project Structure

```
app/
  api/
    paste/route.ts       # POST /api/paste     — save text, returns a code
    retrieve/route.ts    # POST /api/retrieve  — look up text by code
  layout.tsx              # Root layout, theme provider, toaster
  page.tsx                 # Home page
  globals.css              # Tailwind + theme CSS variables
components/
  paste-app.tsx            # Main client component (tabs, state, API calls)
  theme-provider.tsx
  theme-toggle.tsx
  copy-button.tsx
  ui/                       # button, card, input, textarea, tabs, checkbox
lib/
  mongodb.ts                # Cached Mongoose connection helper
  generate-code.ts          # Short-code generator
  utils.ts                  # cn() class-merging helper
models/
  Paste.ts                  # Mongoose schema: code, text, deleteAfterReading, createdAt
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure MongoDB

Copy the example env file and add your connection string:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/quickpaste?retryWrites=true&w=majority
```

You can use a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster, or a local MongoDB instance:

```
MONGODB_URI=mongodb://localhost:27017/quickpaste
```

### 3. Run the dev server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

### 4. Build for production

```bash
npm run build
npm run start
```

## API Reference

### `POST /api/paste`

Save text and get back a code.

**Request body**
```json
{ "text": "your text here", "deleteAfterReading": false }
```

**Response — `201 Created`**
```json
{ "code": "A7KD91X" }
```

**Errors**
- `400` — empty text, or text exceeds 1 MB
- `500` — database error

### `POST /api/retrieve`

Look up text by code.

**Request body**
```json
{ "code": "A7KD91X" }
```

**Response — `200 OK`**
```json
{ "text": "your text here", "createdAt": "2026-01-01T12:00:00.000Z" }
```

**Errors**
- `400` — empty code
- `404` — `{ "error": "Code not found." }`
- `500` — database error

## Notes

- Codes are 7 characters, uppercase alphanumeric, excluding easily-confused characters (`0`, `O`, `1`, `I`).
- Code uniqueness is enforced at the database level (`unique: true` index) with automatic retry on the rare collision.
- Text is capped at 1 MB and trimmed of leading/trailing whitespace before saving.
- If "Delete after reading" is checked at save time, the paste is permanently deleted immediately after its first successful retrieval.
