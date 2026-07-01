const BASE = '/api';

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  getMarket: () => fetchJSON(`${BASE}/market`),

  getNews: (limit = 10) => fetchJSON(`${BASE}/news?limit=${limit}`),

  predict: (data) =>
    fetchJSON(`${BASE}/predict`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  chat: (data) =>
    fetchJSON(`${BASE}/chat`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
