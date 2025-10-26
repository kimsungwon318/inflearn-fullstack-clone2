"use client";

import { useSession, signOut } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  console.log(session);

  const handleLogout = () => {
    signOut({ callbackUrl: "/signin" });
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8">
      <h1 className="text-3xl font-bold">홈</h1>
      {session?.user?.email ? (
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-lg">로그인된 이메일:</p>
            <p className="text-2xl font-semibold text-green-600">
              {session.user.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white font-bold cursor-pointer rounded-sm px-6 py-2 hover:bg-red-600 transition-colors"
          >
            로그아웃
          </button>
        </div>
      ) : (
        <p className="text-gray-500">로그인되지 않음</p>
      )}
    </div>
  );
}
