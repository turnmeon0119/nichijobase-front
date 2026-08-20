export type NewsItem = {
  date: string;
  title: string;
  body: string;
};

export const newsItems: NewsItem[] = [
  {
    date: "2026.08.20",
    title: "日常BASEのWebサイトを準備しています",
    body: "Podcastで話したテーマを記事で読み直し、匿名掲示板で感想を残せる場所として、サイト全体の構成を整えています。",
  },
  {
    date: "2026.07.22",
    title: "投稿データの保存先をMySQLへ移行しました",
    body: "記事、掲示板、返信、リアクションが再デプロイ後も残るように、本番データベースをRailway MySQLへ切り替えました。",
  },
  {
    date: "2026.07.06",
    title: "掲示板と画像投稿の初期機能を追加しました",
    body: "記事を起点にスレッドを作成し、匿名で返信や画像投稿ができるようになりました。",
  },
];

export const programs = [
  {
    title: "Podcast Notes",
    description: "Podcastで話したテーマを、あとから読み直せる補足記事としてまとめます。",
    href: "/articles",
  },
  {
    title: "Community Board",
    description: "記事を起点に、匿名で感想や別視点を書き込める小さな掲示板です。",
    href: "/board",
  },
  {
    title: "BASE Gacha",
    description: "読むか、書くか、迷ったときに今日のアクションを引ける軽い遊びです。",
    href: "/gacha",
  },
];
