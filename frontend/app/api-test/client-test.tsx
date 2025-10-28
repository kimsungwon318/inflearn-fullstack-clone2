"use client";

import { useApi } from "@/hooks/useApi";
import { useQuery } from "@tanstack/react-query";

export default function ClientTest() {
  const api = useApi();

  const { data, error, isLoading } = useQuery({
    queryKey: ["user-test"],
    queryFn: () => api.getUserTest(),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h2>클라이언트 컴포넌트 API 테스트</h2>
      <pre>{data}</pre>
    </div>
  );
}
