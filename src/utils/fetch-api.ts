export async function fetchApi<T = any>(
  path: string,
  options: { method?: "GET" | "POST"; headers?: Record<string, string>; body?: any } = {}
): Promise<T> {
  const apiUrl = process.env.NEXT_PUBLIC_API;
  if (!apiUrl) {
    throw new Error("API URL is missing in environment variables!");
  }

  const apiBase = apiUrl.endsWith("/api") ? apiUrl : `${apiUrl}/api`;
  const fetchUrl = `${apiBase.replace(/\/$/, "")}${path.startsWith("/") ? path : "/" + path}`;

  const fetchOptions: RequestInit = {
    method: options.method || "GET",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  };

  if (fetchOptions.method === "POST" && options.body) {
    fetchOptions.body = typeof options.body === "string" ? options.body : JSON.stringify(options.body);
  }


  const response = await fetch(fetchUrl, fetchOptions);

  if (!response.ok) {
    const errorText = await response.text(); // Debugging actual API response
    throw new Error(`Failed to fetch: ${fetchUrl} (${response.status} ${response.statusText}) - ${errorText}`);
  }

  try {
    return await response.json() as T;
  } catch (e) {
    throw new Error(`Invalid JSON in API response: ${(e as Error).message}`);
  }
}
