"use server";
import { cookies } from "next/headers";

const AUTH_COOKIE_NAME =
  process.env.NODE_ENV === "production"
    ? "__Secure-next-auth.session-token"
    : "next-auth.session-token";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function getAuthToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME);
  return token?.value;
}

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  tokenOrIncludeAuth?: string | boolean
) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  } as Record<string, string>;

  // 토큰 처리
  let token: string | undefined;

  if (typeof tokenOrIncludeAuth === "string") {
    // 토큰이 직접 전달된 경우
    token = tokenOrIncludeAuth;
  } else if (tokenOrIncludeAuth !== false) {
    // 기본값(true) 또는 명시적으로 true인 경우 쿠키에서 가져오기
    token = await getAuthToken();
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
    cache: "no-store",
  };

  if (options.body && typeof options.body === "object") {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.status}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json() as Promise<T>;
  } else {
    return response.text() as Promise<T>;
  }
}

export async function getUserTest(token?: string) {
  return fetchApi<string>("/user-test", {}, token);
}
