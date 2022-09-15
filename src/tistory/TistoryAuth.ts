import { request } from 'obsidian';
import { TISTORY_REDIRECT_URI } from '~/constants';

const TISTORY_AUTH_BASE_URL = 'https://www.tistory.com/oauth';

export function createTistoryAuthUrl({
  clientId,
  state,
  redirectUri = TISTORY_REDIRECT_URI,
}: {
  clientId: string;
  state?: string;
  redirectUri?: string;
}) {
  return `${TISTORY_AUTH_BASE_URL}/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;
}

export async function requestTistoryAccessToken({
  code,
  clientId,
  clientSecretKey,
  redirectUri = TISTORY_REDIRECT_URI,
}: {
  code: string;
  clientId: string;
  clientSecretKey: string;
  redirectUri?: string;
}) {
  const responseText = await request({
    url: `${TISTORY_AUTH_BASE_URL}/access_token?client_id=${clientId}&client_secret=${clientSecretKey}&redirect_uri=${redirectUri}&code=${code}&grant_type=authorization_code`,
  });
  if (responseText.startsWith('access_token=')) {
    // 토큰값 저장
    const accessToken = responseText.replace('access_token=', '');
    return accessToken;
  } else {
    // TODO: AuthenticationError implementation 작성하기
    throw new Error('Authentication failed');
  }
}
