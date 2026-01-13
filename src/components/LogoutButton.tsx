"use client"

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import React from "react";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="mt-4 inline-block bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
    >
      Logout
    </button>
  );
}
