export const API_URL = process.env.A7_API_URL;

const A7_API_TOKEN = process.env.A7_API_TOKEN;

export const A7_API_HEADERS = new Headers({
  Authorization: `Bearer ${A7_API_TOKEN}`,
});

export async function fetchA7API(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: A7_API_HEADERS,
    ...options,
  });

  if (!response.ok) {
    throw new Error(`A7 API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
