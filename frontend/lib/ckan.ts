import { CKANResponse } from '../types/ckan';

const CKAN_BASE_URL = process.env.CKAN_BASE_URL || 'http://localhost:4000';

interface FetchOptions extends RequestInit {
  ignoreErrors?: boolean;
}

export async function fetchCKAN<T>(action: string, params?: URLSearchParams | Record<string, string>, options?: FetchOptions): Promise<T | null> {
  const method = options?.method || 'GET';
  const url = new URL(`${CKAN_BASE_URL}/api/3/action/${action}`);
  
  let body: string | undefined;
  const headers = new Headers(options?.headers);
  headers.set('Accept', 'application/json');

  if (method === 'POST') {
    headers.set('Content-Type', 'application/json');
    if (params) {
      if (params instanceof URLSearchParams) {
        const obj: Record<string, string> = {};
        params.forEach((value, key) => obj[key] = value);
        body = JSON.stringify(obj);
      } else {
        body = JSON.stringify(params);
      }
    }
  } else if (params) {
    if (params instanceof URLSearchParams) {
      params.forEach((value, key) => url.searchParams.append(key, value));
    } else {
      Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));
    }
  }

  try {
    const res = await fetch(url.toString(), {
      ...options,
      method,
      headers,
      body,
    });

    if (!res.ok) {
      if (!options?.ignoreErrors) {
        console.error(`CKAN API error: ${res.status} ${res.statusText} for ${url.toString()}`);
      }
      return null;
    }

    const data: CKANResponse<T> = await res.json();
    return data.result;
  } catch (error) {
    if (!options?.ignoreErrors) {
      console.error(`Failed to fetch from CKAN: ${error} for ${url.toString()}`);
    }
    return null;
  }
}
