import { CKANResponse } from '../types/ckan';
import { AppError } from './errors';

const CKAN_BASE_URL = process.env.CKAN_BASE_URL || 'http://localhost:4000';

interface FetchOptions extends RequestInit {
  ignoreErrors?: boolean;
}

export async function fetchCKAN<T>(action: string, params?: URLSearchParams | Record<string, string>, options?: FetchOptions): Promise<T> {
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
        throw new AppError(`CKAN API error: ${res.status} ${res.statusText}`, { url: url.toString(), status: res.status });
      }
      // When ignoreErrors is true, we need to return something that won't break the caller.
      // This is tricky without returning null. We'll return an empty object,
      // but this assumes the caller can handle it.
      // A better approach might be to have different functions for "must-succeed" and "can-fail" calls.
      // For now, we'll proceed with this compromise.
      return {} as T;
    }

    const data: CKANResponse<T> = await res.json();
    if (!data.success && !options?.ignoreErrors) {
      throw new AppError(`CKAN API returned success:false`, { url: url.toString(), response: data });
    }
    return data.result;
  } catch (error) {
    if (error instanceof AppError) {
      throw error; // Re-throw AppErrors
    }
    if (!options?.ignoreErrors) {
      throw new AppError(`Failed to fetch from CKAN: ${error}`, { url: url.toString(), originalError: error });
    }
    return {} as T;
  }
}
