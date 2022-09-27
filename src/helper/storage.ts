import { TISTORY_LOCAL_STORAGE_KEY } from '~/constants';

export interface TistoryAuthInfo {
  accessToken: string | null;
  selectedBlog: string | null;
}

export class TistoryAuthStorage {
  static loadTistoryAuthInfo() {
    const data = localStorage.getItem(TISTORY_LOCAL_STORAGE_KEY);
    return data ? (JSON.parse(data) as TistoryAuthInfo) : null;
  }

  static saveTistoryAuthInfo(tistoryInfo: TistoryAuthInfo) {
    return localStorage.setItem(TISTORY_LOCAL_STORAGE_KEY, JSON.stringify(tistoryInfo));
  }

  static updateTistoryAuthInfo(tistoryInfo: Partial<TistoryAuthInfo>) {
    const oldData = this.loadTistoryAuthInfo() || {};
    const newData = Object.assign(oldData, tistoryInfo);
    return localStorage.setItem(TISTORY_LOCAL_STORAGE_KEY, JSON.stringify(newData));
  }

  static clearTistoryAuthInfo() {
    return localStorage.removeItem(TISTORY_LOCAL_STORAGE_KEY);
  }
}
