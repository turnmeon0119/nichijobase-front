# podcast-site/front

Next.js frontend for podcast articles and anonymous board.

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
- `/admin/articles/new` article create (admin token required)

## API Connection

Default API base:

- `http://localhost:8000`

Optional env for frontend:

- `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000`

## Notes

- Article write APIs are admin protected by `X-Admin-Token`.
- Board posting is open (anonymous), with rate limit on backend.
