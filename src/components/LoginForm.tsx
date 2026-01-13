"use client"

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      const result: any = await signIn("credentials", { redirect: false, email, password });
      if (result?.error) {
        setLoginError("Invalid email or password");
      } else {
        router.refresh();
      }
    } catch (err) {
      setLoginError("An error occurred during login");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          defaultValue="test@example.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-2">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          defaultValue="password123"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loginError && <p className="text-red-600 text-sm">{loginError}</p>}

      <button
        type="submit"
        disabled={isLoggingIn}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoggingIn ? "Logging in..." : "Login"}
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">Default credentials are pre-filled for testing</p>
    </form>
  );
}
