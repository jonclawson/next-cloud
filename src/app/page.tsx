import { auth } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";
import LogoutButton from "@/components/LogoutButton";
import HelloContent from "@/components/HelloContent";

export default async function Home() {
  // Call auth() server-side to obtain session; cast to any to avoid overload mismatch
  const session = await (auth as any)();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="p-8 bg-white rounded-lg shadow">
          {session?.user ? (
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome back!</h1>
              <p className="text-gray-600 mb-2">You are logged in as:</p>
              <p className="text-lg font-semibold text-gray-900 mb-6">{session.user.email}</p>
              {session.user.name && <p className="text-gray-600 mb-6">Name: {session.user.name}</p>}
              <LogoutButton />
            </div>
          ) : (
            <div>
              <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Sign In</h1>
              <LoginForm />
            </div>
          )}
        </div>

        {session?.user && (
          <div className="p-8 bg-white rounded-lg shadow">
            <HelloContent />
          </div>
        )}
      </div>
    </div>
  );
}
