"use client"

import Image from "next/image";
import { useEffect, useState } from "react";

export function HelloContent() {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);

  type HelloResponse = { message: string; image: string | null };

  useEffect(() => {
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
  }, []);

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">API Content</h2>
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-red-600">Error: {error}</p>
      ) : (
        <div className="space-y-4">
          {image && (
            <div className="flex justify-center">
              <Image 
                src={image} 
                alt={message ?? "Hello Image"} 
                width={500} 
                height={500}
                className="rounded-lg"
              />
            </div>
          )}
          {message && (
            <p className="text-lg text-gray-800">{message}</p>
          )}
        </div>
      )}
    </div>
  );
}
