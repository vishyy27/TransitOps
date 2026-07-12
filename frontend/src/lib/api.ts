const API_URL = 'http://localhost:3000';

function getAuthHeader() {
  const token = localStorage.getItem('transitops-auth-token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // If unauthorized, could trigger a logout event here
  if (response.status === 401) {
    localStorage.removeItem('transitops-auth-token');
    window.dispatchEvent(new Event('auth-expired'));
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = data.error || { message: 'An unexpected error occurred' };
    throw error;
  }

  return data.data; // Assuming backend sends { success: true, data: ... }
}

export const api = {
  get: (endpoint: string) => fetchWithAuth(endpoint, { method: 'GET' }),
  post: (endpoint: string, body: any) => fetchWithAuth(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  patch: (endpoint: string, body: any) => fetchWithAuth(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (endpoint: string) => fetchWithAuth(endpoint, { method: 'DELETE' }),
};
