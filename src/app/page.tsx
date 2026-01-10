"use client"

import { useEffect, useState } from "react";

export default function Home() {
	const [message, setMessage] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	type HelloResponse = { message: string };

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const res = await fetch('/api/hello');
				if (!res.ok) throw new Error(`status ${res.status}`);
				const data = (await res.json()) as HelloResponse;
				if (mounted) setMessage(data.message ?? String(data));
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
	}, []);

	return (

				<div className="text-center sm:text-left">
					{loading ? (
						<p>Loading...</p>
					) : error ? (
						<p className="text-red-600">Error: {error}</p>
					) : (
						<p className="font-medium">{message}</p>
					)}
				</div>

	);
}
