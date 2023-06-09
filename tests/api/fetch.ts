import { HttpVerb } from '../../src/types';
import { Token } from '../../src/types/user';
import consts from '../consts';
import ApiError from './ApiError';

/**
 * Fetch some data from the backend
 *
 * @param method Type of request
 * @param route route to request to
 * @param token auth token
 * @param bodyParams request body or params
 *
 * @returns promise of the resolved data.
 */
export async function apiFetch (
  method: HttpVerb,
  route: string,
  token?: Token,
  bodyParams?: object
): Promise<object> {
  if (bodyParams === undefined) {
    bodyParams = {};
  }

  const headers = new Headers(
    token !== undefined
      ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      : { 'Content-Type': 'application/json' }
  );

  let url: string;
  let body: string | null; // JSON string

  if (['POST', 'PUT'].includes(method)) {
    // POST and PUT use a body
    url = `${consts.URL}${route}`;
    body = JSON.stringify(bodyParams);
  } else {
    // GET and DELETE use params
    url =
      `${consts.URL}${route}?` +
      new URLSearchParams(bodyParams as Record<string, string>);
    body = null;
  }

  // Now send the request
  let res: Response;
  try {
    res = await fetch(url, {
      method,
      body,
      headers,
    });
  } catch (err) {
    // Likely a network issue
    if (err instanceof Error) {
      throw new ApiError(null, err.message);
    } else {
      throw new ApiError(null, `Unknown request error ${err}`);
    }
  }

  // Decode the error
  let json: object;
  try {
    json = await res.json();
  } catch (err) {
    // JSON parse error
    if (err instanceof Error) {
      throw new ApiError(null, err.message);
    } else {
      throw new ApiError(null, `Unknown JSON error ${err}`);
    }
  }

  if ([400, 403].includes(res.status)) {
    // All 400 and 403 errors have an error message according to the spec
    const errorMessage = (json as { error: string | object }).error;
    throw new ApiError(res.status, errorMessage);
  }
  if (![200, 304].includes(res.status)) {
    // Unknown error
    throw new ApiError(res.status, `Request got status code ${res.status}`);
  }

  // Got valid data
  return Object.assign({}, json);
}
