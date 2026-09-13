export * from '../services/api';

export function storeToken(token: string) {
  // Simple helper to persist the JWT access token in localStorage
  // Used by Register and Login pages that expect this utility.
  try {
    localStorage.setItem('access_token', token);
  } catch (e) {
    console.error('Failed to store token:', e);
  }
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const method = (init.method || 'GET').toLowerCase();
  const url = path.startsWith('/api') ? path.replace('/api', '') : path;

  let data;
  if (init.body) {
    try {
      data = JSON.parse(init.body as string);
    } catch {
      data = init.body;
    }
  }

  const response = await (await import('../services/api')).api.request({
    url,
    method,
    data,
  });

  return response.data as T;
}
