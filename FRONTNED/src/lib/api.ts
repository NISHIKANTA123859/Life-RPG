export * from '../services/api';

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

