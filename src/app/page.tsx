"use client"

import Image from "next/image";
import { useEffect, useState } from "react";
import { signIn, signOut } from "next-auth/react";

export default function Home() {
	const [message, setMessage] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [image, setImage] = useState<string | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoggingIn, setIsLoggingIn] = useState(false);
	const [loginError, setLoginError] = useState<string | null>(null);

	type HelloResponse = { message: string; image: string | null };

	useEffect(() => {
		let mounted = true;

		// Check session
		(async () => {
			try {
				const res = await fetch('/api/auth/session');
				const session = await res.json() as {user?: {id: string; email: string; name: string}};
				if (mounted && session &&  session?.user) {
					setIsAuthenticated(true);
				}
			} catch (err) {
				console.error('Session check failed:', err);
			}
		})();

		return () => {
			mounted = false;
		};
	}, []);

	useEffect(() => {
		if (!isAuthenticated) {
			setLoading(false);
			return;
		}

		let mounted = true;
		(async () => {
			try {
				const res = await fetch('/api/hello');
				if (!res.ok) throw new Error(`status ${res.status}`);
				const data = (await res.json()) as HelloResponse;
				if (mounted) {
          setMessage(data.message ?? String(data));
          setImage(data.image ?? null);
        }
			} catch (err: unknown) {
				const msg = err instanceof Error ? err.message : String(err);
				if (mounted) setError(msg ?? 'Fetch error');
			} finally {
				if (mounted) setLoading(false);
			}
		})();
		return () => {
			mounted = false;
		};
	}, [isAuthenticated]);

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoggingIn(true);
		setLoginError(null);

		const formData = new FormData(e.currentTarget);
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		try {
			const result = await signIn('credentials', {
				email,
				password,
				redirect: false,
			});

			if (result?.error) {
				setLoginError('Invalid email or password');
			} else {
				setIsAuthenticated(true);
			}
		} catch (err) {
			setLoginError('An error occurred during login');
		} finally {
			setIsLoggingIn(false);
		}
	};

	const handleLogout = async () => {
		await signOut({ redirect: false });
		setIsAuthenticated(false);
		setMessage(null);
		setImage(null);
	};

	if (!isAuthenticated) {
		return (
			<div className="min-h-screen flex items-center justify-center p-4">
				<div className="w-full max-w-md">
					<h1 className="text-2xl font-bold text-center mb-6">Login</h1>
					<form onSubmit={handleLogin} className="space-y-4 bg-white p-8 rounded-lg shadow-md">
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
						{loginError && (
							<p className="text-red-600 text-sm">{loginError}</p>
						)}
						<button
							type="submit"
							disabled={isLoggingIn}
							className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
						>
							{isLoggingIn ? 'Logging in...' : 'Login'}
						</button>
						<p className="text-xs text-gray-500 text-center mt-4">
							Default credentials are pre-filled for testing
						</p>
					</form>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen p-8">
			<div className="max-w-4xl mx-auto">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-2xl font-bold">Welcome!</h1>
					<button
						onClick={handleLogout}
						className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
					>
						Logout
					</button>
				</div>
				<div className="text-center sm:text-left">
					{loading ? (
						<p>Loading...</p>
					) : error ? (
						<p className="text-red-600">Error: {error}</p>
					) : (
						<div>
							{image && (
								<Image 
									src={image} 
									title={message || ''} 
									alt={message || 'Hello Image'} 
									width={200} 
									height={200} 
								/>
							)}
							<p className="font-medium mt-4">{message}</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
