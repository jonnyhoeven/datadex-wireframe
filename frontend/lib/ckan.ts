import { CKANResponse } from '../types/ckan';

const CKAN_BASE_URL = process.env.CKAN_BASE_URL || 'http://localhost:4000';

export async function fetchCKAN<T>(action: string, params?: URLSearchParams | Record<string, string>, options?: RequestInit): Promise<T | null> {
  const url = new URL(`${CKAN_BASE_URL}/api/3/action/${action}`);
  
  if (params) {
    if (params instanceof URLSearchParams) {
      params.forEach((value, key) => url.searchParams.append(key, value));
    } else {
      Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));
    }
  }

  try {
    const res = await fetch(url.toString(), {
      ...options,
      headers: {
        'Accept': 'application/json',
        ...options?.headers,
      },
    });

    if (!res.ok) {
      console.error(`CKAN API error: ${res.status} ${res.statusText} for ${url.toString()}`);
      return null;
    }

    const data: CKANResponse<T> = await res.json();
    return data.result;
  } catch (error) {
    console.error(`Failed to fetch from CKAN: ${error} for ${url.toString()}`);
    return null;
  }
}
