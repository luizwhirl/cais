// selo-fiea-frontend/src/services/apiClient.ts

// A URL base da sua API
const BASE_URL = 'http://localhost:3000/api/v1';

/**
 * Obtém o token de autenticação salvo no localStorage.
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

/**
 * Cria os headers padrão para as requisições.
 */
const getAuthHeaders = (isFormData = false): HeadersInit => {
  const token = getAuthToken();
  const headers: HeadersInit = {};

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Lida com a resposta da API, tratando sucessos e erros.
 */
const handleResponse = async (response: Response) => {
  // Para requisições DELETE ou outras que retornam 204 No Content
  if (response.status === 204) {
    return null;
  }
  
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Erro ${response.status}`);
  }
  
  return data;
};

// --- Métodos Principais ---

export const apiClient = {
  /**
   * Realiza uma requisição GET autenticada.
   */
  get: async (endpoint: string) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  /**
   * Realiza uma requisição POST autenticada com body JSON.
   */
  post: async (endpoint: string, body: unknown) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  /**
   * Realiza uma requisição PATCH autenticada com body JSON.
   */
  patch: async (endpoint: string, body: unknown) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  /**
   * Realiza uma requisição DELETE autenticada.
   */
  delete: async (endpoint: string) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  /**
   * Realiza o upload de arquivos (FormData) para um endpoint.
   */
  upload: async (endpoint: string, formData: FormData) => {
    const headers = new Headers();
    const token = getAuthToken();
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: headers,
      body: formData,
    });
    return handleResponse(response);
  },
  
  /**
   * Realiza uma requisição GET pública (sem autenticação).
   * Usado para validação de selos.
   */
  publicGet: async (endpoint: string) => {
     const response = await fetch(`${BASE_URL}${endpoint}`, {
       method: 'GET',
       headers: { 'Content-Type': 'application/json' },
     });
     return handleResponse(response);
  },
  
  /**
   * Realiza uma requisição POST pública (sem autenticação).
   * Usado para login, registro, etc.
   */
  publicPost: async (endpoint: string, body: unknown) => {
     const response = await fetch(`${BASE_URL}${endpoint}`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(body),
     });
     return handleResponse(response);
  }
};