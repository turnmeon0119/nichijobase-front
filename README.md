# nichijobase Frontend

Next.js frontend for 日常BASE.

Backend repository:

- <https://github.com/turnmeon0119/nichijobase>

Production frontend:

- <https://nichijobase-front.vercel.app>

## 共同開発者向けの最初の確認

このリポジトリはフロントエンド側です。ユーザーがブラウザで見る画面、レイアウト、アニメーション、フォーム、API呼び出しを担当します。

データ保存、管理者API、DB、画像アップロード処理を触る場合は、バックエンドリポジトリを確認してください。

- 画面デザインやページを触る: `nichijobase-front`
- API / 管理画面 / DBを触る: `nichijobase`

ローカルで動かすために必要なもの:

- Node.js
- npm
- Git
- VSCodeなどのエディタ
- Docker Desktop（APIもローカルで動かす場合）

最初に確認するURL:

- フロント画面: <http://localhost:3000>
- 記事一覧: <http://localhost:3000/articles>
- 掲示板: <http://localhost:3000/board>
- API疎通確認: <http://localhost:8000/api/test>

作業前に守ること:

- `.env.local` はGitに入れない
- `NEXT_PUBLIC_` が付く環境変数はブラウザから見えるので、秘密情報を入れない
- 変更前に `git pull origin main` で最新化する
- できれば `main` ではなく作業ブランチを作る
- UI変更後は `npm run build` を確認する

## クローンから起動まで

初めて参加する場合は、フロントエンドとバックエンドを同じ `podcast-site` フォルダの中に並べて置くとわかりやすいです。

```bash
mkdir -p ~/development/podcast-site
cd ~/development/podcast-site

git clone https://github.com/turnmeon0119/nichijobase.git api
git clone https://github.com/turnmeon0119/nichijobase-front.git front
```

先にAPIを起動します。

```bash
cd ~/development/podcast-site/api
cp .env.example .env
docker compose up -d --build
docker compose exec -T app php artisan key:generate
docker compose exec -T app php artisan migrate --seed
```

APIの起動確認:

```bash
curl http://localhost:8000/api/test
```

次にフロントエンドを起動します。

```bash
cd ~/development/podcast-site/front
cp .env.example .env.local
npm install
npm run dev
```

ブラウザで <http://localhost:3000> を開きます。

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- Vercel

## What This Frontend Provides

- Top page
- Articles list and detail pages
- Article comments and reactions
- News list and detail pages
- Anonymous board list, thread detail, thread creation, and replies
- Board reactions and reports
- Gacha page
- Ogiri list and detail pages
- Shelf page for future goods
- Static pages such as programs, about, and contact

## Local Setup

Start the API first.

```bash
cd /Users/jumpeihirosawa/development/podcast-site/api
docker compose up -d
```

Then start the frontend.

```bash
cd /Users/jumpeihirosawa/development/podcast-site/front
cp .env.example .env.local
npm install
npm run dev
```

Frontend URL:

- <http://localhost:3000>

API URL:

- <http://localhost:8000>

## Environment Variables

Create `.env.local` from `.env.example`.

```bash
cp .env.example .env.local
```

Local values:

```env
API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Production values on Vercel:

```env
API_BASE_URL=https://nichijobase.onrender.com
NEXT_PUBLIC_API_BASE_URL=https://nichijobase.onrender.com
```

Do not put secret values in frontend environment variables. Values prefixed with `NEXT_PUBLIC_` are visible in the browser.

## Pages

```txt
/                  top
/programs          programs
/news              news list
/news/[slug]       news detail
/articles          article list
/articles/[slug]   article detail
/board             board list
/board/new         create board thread
/board/[id]        board thread detail
/gacha             gacha
/ogiri             ogiri list
/ogiri/[id]        ogiri detail
/shelf             future goods shelf
/about             about
/contact           contact
```

## Development Commands

```bash
npm run dev
npm run lint
npm run build
```

Use `npm run build` before pushing UI changes when possible.

## Collaboration Workflow

1. Pull the latest `main`.
2. Create a feature branch.
3. Make changes locally.
4. Run lint and build.
5. Commit and push the branch.
6. Open a Pull Request.
7. Merge after review.

Example:

```bash
git checkout main
git pull origin main
git checkout -b feature/board-card-ui
npm run lint
npm run build
git add .
git commit -m "Refine board card UI"
git push origin feature/board-card-ui
```

## Deployment

Vercel is connected to the GitHub repository.

- Push or merge to `main`.
- Vercel builds and deploys automatically.
- Check the Vercel deployment log if the site does not update.

## Troubleshooting

### `fetch failed` on local pages

The Laravel API is probably not running.

```bash
cd /Users/jumpeihirosawa/development/podcast-site/api
docker compose up -d
curl http://localhost:8000/api/test
```

### Docker says daemon is not running

Open Docker Desktop, wait until it finishes starting, then run Docker commands again.

### Port 3000 is already in use

Another Next.js process is running. Stop it or use the URL shown by `npm run dev`.

### Browser-side posting fails

Check `NEXT_PUBLIC_API_BASE_URL` in `.env.local` or Vercel environment variables.

