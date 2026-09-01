const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL ?? "http://localhost:8000";

export type ArticleListItem = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  image_url: string | null;
  image_caption: string | null;
  type: "episode" | "editorial" | null;
  published_at: string;
  board_thread_id: number | null;
  comments_count: number;
  latest_comment_at: string | null;
  like_count: number;
  empathy_count: number;
  useful_count: number;
};

export type ArticleBlock = {
  id: number;
  type: "text" | "image";
  body: string | null;
  image_url: string | null;
  image_caption: string | null;
  sort_order: number;
};

export type ArticleDetail = ArticleListItem & {
  body: string;
  view_count: number;
  blocks: ArticleBlock[];
};

export type ArticleComment = {
  id: number;
  name: string | null;
  body: string;
  created_at: string;
};

export type NewsBlock = ArticleBlock;

export type NewsItem = {
  id: number;
  title: string;
  slug: string;
  body: string;
  published_at: string;
  blocks?: NewsBlock[] | null;
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
  image_url: string | null;
  image_caption: string | null;
  created_at: string;
  posts_count: number;
  latest_post_at: string | null;
  empathy_count: number;
  perspective_count: number;
};

export type BoardPost = {
  id: number;
  name: string | null;
  body: string;
  image_url: string | null;
  image_caption: string | null;
  empathy_count: number;
  perspective_count: number;
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
  image_caption: string | null;
  empathy_count: number;
  perspective_count: number;
  created_at: string;
  posts: BoardPost[];
};


export type HitokotoPost = {
  id: number;
  name: string | null;
  body: string;
  created_at: string;
  reports_count: number;
  pow_count: number;
  comments_count: number;
};

export type HitokotoComment = {
  id: number;
  name: string | null;
  body: string;
  created_at: string;
  reports_count: number;
};

export type OgiriPromptListItem = {
  id: number;
  title: string;
  body: string | null;
  image_url: string | null;
  published_at: string;
  answers_count: number;
};

export type OgiriAnswer = {
  id: number;
  name: string | null;
  body: string;
  funny_count: number;
  genius_count: number;
  created_at: string;
};

export type OgiriPromptDetail = OgiriPromptListItem & {
  answers: OgiriAnswer[];
};


type ApiResponse<T> = {
  data: T;
};

export type PaginationMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

type PaginatedApiResponse<T> = ApiResponse<T[]> & {
  meta: PaginationMeta;
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

export async function getArticlesPage(
  page = 1,
  perPage = 9,
  keyword = "",
): Promise<{ data: ArticleListItem[]; meta: PaginationMeta }> {
  const params = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  });
  if (keyword) params.set("q", keyword);

  const json = await fetchApi<PaginatedApiResponse<ArticleListItem>>(`/api/articles?${params.toString()}`);
  return { data: json.data, meta: json.meta };
}

export async function getArticleBySlug(slug: string): Promise<ArticleDetail> {
  const json = await fetchApi<ApiResponse<ArticleDetail>>(`/api/articles/${slug}`);
  return json.data;
}

export async function getArticleComments(slug: string): Promise<ArticleComment[]> {
  const json = await fetchApi<ApiResponse<ArticleComment[]>>(`/api/articles/${slug}/comments`);
  return json.data;
}

export async function createArticleComment(
  slug: string,
  input: { name?: string; body: string },
): Promise<ArticleComment> {
  const json = await fetchApi<ApiResponse<ArticleComment>>(`/api/articles/${slug}/comments`, {
    method: "POST",
    body: JSON.stringify(input),
  });

  return json.data;
}

export async function reactToArticle(
  slug: string,
  type: "like" | "empathy" | "useful",
): Promise<{ like_count: number; empathy_count: number; useful_count: number }> {
  const json = await fetchApi<
    ApiResponse<{ like_count: number; empathy_count: number; useful_count: number }>
  >(`/api/articles/${slug}/reactions`, {
    method: "POST",
    body: JSON.stringify({ type }),
  });

  return json.data;
}

export async function getNewsItems(): Promise<NewsItem[]> {
  const json = await fetchApi<ApiResponse<NewsItem[]>>("/api/news");
  return json.data;
}

export async function getNewsItemsPage(
  page = 1,
  perPage = 10,
  keyword = "",
): Promise<{ data: NewsItem[]; meta: PaginationMeta }> {
  const params = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  });
  if (keyword) params.set("q", keyword);

  const json = await fetchApi<PaginatedApiResponse<NewsItem>>(`/api/news?${params.toString()}`);
  return { data: json.data, meta: json.meta };
}

export async function getNewsItem(slug: string): Promise<NewsItem> {
  const json = await fetchApi<ApiResponse<NewsItem>>(`/api/news/${slug}`);
  return json.data;
}

export async function getBoardThreads(
  sort: "latest" | "popular" = "latest",
  keyword = "",
): Promise<BoardThreadListItem[]> {
  const params = new URLSearchParams({ sort });
  if (keyword) params.set("q", keyword);

  const json = await fetchApi<ApiResponse<BoardThreadListItem[]>>(
    `/api/threads?${params.toString()}`,
  );
  return json.data;
}

export async function getBoardThreadsPage(
  sort: "latest" | "popular" = "latest",
  keyword = "",
  page = 1,
  perPage = 10,
): Promise<{ data: BoardThreadListItem[]; meta: PaginationMeta }> {
  const params = new URLSearchParams({
    sort,
    page: String(page),
    per_page: String(perPage),
  });
  if (keyword) params.set("q", keyword);

  const json = await fetchApi<PaginatedApiResponse<BoardThreadListItem>>(
    `/api/threads?${params.toString()}`,
  );
  return { data: json.data, meta: json.meta };
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
  article_id?: number | null;
  title: string;
  name?: string;
  body: string;
  image?: File | null;
  imageCaption?: string;
}): Promise<{ id: number }> {
  const body = new FormData();
  if (input.article_id) body.append("article_id", String(input.article_id));
  body.append("title", input.title);
  body.append("name", input.name ?? "");
  body.append("body", input.body);
  if (input.image) body.append("image", input.image);
  if (input.imageCaption?.trim()) body.append("image_caption", input.imageCaption.trim());

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
    imageCaption?: string;
  },
): Promise<{ id: number }> {
  const body = new FormData();
  body.append("name", input.name ?? "");
  body.append("body", input.body);
  if (input.image) body.append("image", input.image);
  if (input.imageCaption?.trim()) body.append("image_caption", input.imageCaption.trim());

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

export async function reactToBoardPost(
  threadId: number,
  postId: number,
  type: "empathy" | "perspective",
): Promise<{ empathy_count: number; perspective_count: number }> {
  const json = await fetchApi<
    ApiResponse<{ empathy_count: number; perspective_count: number }>
  >(`/api/threads/${threadId}/posts/${postId}/reactions`, {
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

export async function getHitokotoPostsPage(
  page = 1,
  perPage = 30,
): Promise<{ data: HitokotoPost[]; meta: PaginationMeta }> {
  const params = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  });

  const json = await fetchApi<PaginatedApiResponse<HitokotoPost>>(
    `/api/hitokoto?${params.toString()}`,
  );
  return { data: json.data, meta: json.meta };
}

export async function createHitokotoPost(input: {
  name?: string;
  body: string;
}): Promise<HitokotoPost> {
  const json = await fetchApi<ApiResponse<HitokotoPost>>("/api/hitokoto", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return json.data;
}

export async function reportHitokotoPost(postId: number): Promise<void> {
  await fetchApi<void>(`/api/hitokoto/${postId}/report`, {
    method: "POST",
  });
}

export async function powHitokotoPost(
  postId: number,
): Promise<{ id: number; pow_count: number }> {
  const json = await fetchApi<ApiResponse<{ id: number; pow_count: number }>>(
    `/api/hitokoto/${postId}/pow`,
    { method: "POST" },
  );

  return json.data;
}

export async function getHitokotoComments(postId: number): Promise<HitokotoComment[]> {
  const json = await fetchApi<ApiResponse<HitokotoComment[]>>(
    `/api/hitokoto/${postId}/comments`,
  );
  return json.data;
}

export async function createHitokotoComment(
  postId: number,
  input: { name?: string; body: string },
): Promise<HitokotoComment> {
  const json = await fetchApi<ApiResponse<HitokotoComment>>(
    `/api/hitokoto/${postId}/comments`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );

  return json.data;
}

export async function reportHitokotoComment(commentId: number): Promise<void> {
  await fetchApi<void>(`/api/hitokoto/comments/${commentId}/report`, {
    method: "POST",
  });
}

export async function getOgiriPrompts(keyword = ""): Promise<OgiriPromptListItem[]> {
  const params = new URLSearchParams();
  if (keyword) params.set("q", keyword);
  const query = params.toString();
  const json = await fetchApi<ApiResponse<OgiriPromptListItem[]>>(
    "/api/ogiri/prompts" + (query ? "?" + query : ""),
  );
  return json.data;
}

export async function getOgiriPrompt(promptId: number): Promise<OgiriPromptDetail> {
  const json = await fetchApi<ApiResponse<OgiriPromptDetail>>(`/api/ogiri/prompts/${promptId}`);
  return json.data;
}

export async function createOgiriAnswer(
  promptId: number,
  input: { name?: string; body: string },
): Promise<{ id: number }> {
  const json = await fetchApi<ApiResponse<{ id: number }>>(`/api/ogiri/prompts/${promptId}/answers`, {
    method: "POST",
    body: JSON.stringify(input),
  });

  return json.data;
}

export async function reactToOgiriAnswer(
  promptId: number,
  answerId: number,
  type: "funny" | "genius",
): Promise<{ funny_count: number; genius_count: number }> {
  const json = await fetchApi<ApiResponse<{ funny_count: number; genius_count: number }>>(
    `/api/ogiri/prompts/${promptId}/answers/${answerId}/reactions`,
    {
      method: "POST",
      body: JSON.stringify({ type }),
    },
  );

  return json.data;
}
