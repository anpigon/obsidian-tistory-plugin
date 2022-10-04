import { requestUrl } from 'obsidian';
import { TISTORY_REDIRECT_URI } from '~/constants';
import AuthenticationError from './AuthenticationError';

export function createTistoryAuthUrl({
  clientId,
  state,
  redirectUri = TISTORY_REDIRECT_URI,
}: {
  clientId: string;
  state?: string;
  redirectUri?: string;
}) {
  return `https://www.tistory.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;
}

export async function requestTistoryAccessToken(code: string) {
  const { json } = await requestUrl({
    url: `https://tistory-auth.vercel.app/api/oauth/access_token?code=${code}`,
  });
  if (json.hasOwnProperty('access_token')) {
    return json['access_token'];
  } else {
    throw new AuthenticationError();
  }
}
