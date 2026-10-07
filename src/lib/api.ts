// const BASE = import.meta.env.VITE_API_URL;
const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export async function api<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json() as Promise<T>;
}
