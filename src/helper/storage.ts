import { TISTORY_LOCAL_STORAGE_KEY } from '~/constants';

export interface TistoryAuthInfo {
  accessToken: string | null;
  selectedBlog: string | null;
}

export function getTistoryAuthInfo() {
  const data = localStorage.getItem(TISTORY_LOCAL_STORAGE_KEY);
  return data ? (JSON.parse(data) as TistoryAuthInfo) : null;
}

export function setTistoryAuthInfo(tistoryInfo: TistoryAuthInfo) {
  return localStorage.setItem(TISTORY_LOCAL_STORAGE_KEY, JSON.stringify(tistoryInfo));
}

export function updateTistoryAuthInfo(tistoryInfo: Partial<TistoryAuthInfo>) {
  const oldData = getTistoryAuthInfo() || {};
  const newData = Object.assign(oldData, tistoryInfo);
  return localStorage.setItem(TISTORY_LOCAL_STORAGE_KEY, JSON.stringify(newData));
}

export function clearTistoryAuthInfo() {
  return localStorage.removeItem(TISTORY_LOCAL_STORAGE_KEY);
}
