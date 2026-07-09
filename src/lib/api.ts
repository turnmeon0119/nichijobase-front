const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL ?? "http://localhost:8000";

export type ArticleListItem = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  type: "episode" | "editorial" | null;
  published_at: string;
  board_thread_id: number | null;
};

export type ArticleDetail = ArticleListItem & {
  body: string;
  view_count: number;
};

export type BoardThreadArticle = {
  id: number;
  slug: string;
  title: string;
};

export type BoardThreadListItem = {
  id: number;
  article_id: number | null;
  article: BoardThreadArticle | null;
  title: string;
  name: string | null;
  body: string;
  created_at: string;
  posts_count: number;
  latest_post_at: string | null;
};

export type BoardPost = {
  id: number;
  name: string | null;
  body: string;
  image_url: string | null;
  created_at: string;
};

export type BoardThreadDetail = {
  id: number;
  article_id: number | null;
  article: BoardThreadArticle | null;
  title: string;
  name: string | null;
  body: string;
  image_url: string | null;
  empathy_count: number;
  perspective_count: number;
  created_at: string;
  posts: BoardPost[];
};

type ApiResponse<T> = {
  data: T;
};

async function fetchApi<T>(path: string, init?: RequestInit): Promise<T> {
  const isFormData = init?.body instanceof FormData;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
    ...init,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as
      | { message?: string; errors?: Record<string, string[]> }
      | null;

    const message =
      error?.message ||
      (error?.errors ? Object.values(error.errors).flat().join(" / ") : null) ||
      `API request failed: ${response.status}`;

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function getArticles(): Promise<ArticleListItem[]> {
  const json = await fetchApi<ApiResponse<ArticleListItem[]>>("/api/articles");
  return json.data;
}

export async function getArticleBySlug(slug: string): Promise<ArticleDetail> {
  const json = await fetchApi<ApiResponse<ArticleDetail>>(`/api/articles/${slug}`);
  return json.data;
}

export async function getBoardThreads(): Promise<BoardThreadListItem[]> {
  const json = await fetchApi<ApiResponse<BoardThreadListItem[]>>("/api/threads");
  return json.data;
}

export async function getBoardThread(threadId: number): Promise<BoardThreadDetail> {
  const json = await fetchApi<ApiResponse<BoardThreadDetail>>(`/api/threads/${threadId}`);
  return json.data;
}

export async function getBoardThreadByArticleSlug(slug: string): Promise<BoardThreadDetail | null> {
  const json = await fetchApi<ApiResponse<BoardThreadDetail | null>>(`/api/articles/${slug}/thread`);
  return json.data;
}

export async function createBoardThread(input: {
  article_id?: number;
  title: string;
  name?: string;
  body: string;
  image?: File | null;
}): Promise<{ id: number }> {
  const body = new FormData();
  if (input.article_id) body.append("article_id", String(input.article_id));
  body.append("title", input.title);
  body.append("name", input.name ?? "");
  body.append("body", input.body);
  if (input.image) body.append("image", input.image);

  const json = await fetchApi<ApiResponse<{ id: number }>>("/api/threads", {
    method: "POST",
    body,
  });

  return json.data;
}

export async function createBoardPost(
  threadId: number,
  input: {
    name?: string;
    body: string;
    image?: File | null;
  },
): Promise<{ id: number }> {
  const body = new FormData();
  body.append("name", input.name ?? "");
  body.append("body", input.body);
  if (input.image) body.append("image", input.image);

  const json = await fetchApi<ApiResponse<{ id: number }>>(`/api/threads/${threadId}/posts`, {
    method: "POST",
    body,
  });

  return json.data;
}

export async function reportBoardThread(threadId: number): Promise<void> {
  await fetchApi<void>(`/api/threads/${threadId}/report`, {
    method: "POST",
  });
}

export async function reactToBoardThread(
  threadId: number,
  type: "empathy" | "perspective",
): Promise<{ empathy_count: number; perspective_count: number }> {
  const json = await fetchApi<
    ApiResponse<{ empathy_count: number; perspective_count: number }>
  >(`/api/threads/${threadId}/reactions`, {
    method: "POST",
    body: JSON.stringify({ type }),
  });

  return json.data;
}

export async function reportBoardPost(threadId: number, postId: number): Promise<void> {
  await fetchApi<void>(`/api/threads/${threadId}/posts/${postId}/report`, {
    method: "POST",
  });
}
