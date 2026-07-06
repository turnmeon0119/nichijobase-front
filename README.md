# podcast-site/front

Next.js frontend for podcast articles and anonymous board.

Backend API:

- [turnmeon0119/nichijobase](https://github.com/turnmeon0119/nichijobase)

## Stack

- Next.js 16 (App Router)
- React + TypeScript
- Tailwind CSS

## Setup

```bash
cd /Users/jumpeihirosawa/development/podcast-site/front
npm install
npm run dev
```

Frontend URL:

- `http://localhost:3000`

## Pages

- `/` top page
- `/articles` article list
- `/articles/[slug]` article detail + linked board section
- `/board` board thread list
- `/board/new` create thread (anonymous)
- `/board/[id]` thread detail + reply form

## API Connection

Default API base:

- `http://localhost:8000`

Optional env for frontend:

- `API_BASE_URL=http://localhost:8000`
- `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000` (required for browser-side posting)

## Notes

- Article and board administration are handled by Laravel.
- Board posting is open (anonymous), with rate limit on backend.
- Public users can report threads and replies from the frontend.
