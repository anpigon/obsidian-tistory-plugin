export enum AuthType {
  USE_MY_TISTORY_APP = 'USE_MY_TISTORY_APP',
  EASY_AUTHENTICATION = 'EASY_AUTHENTICATION',
}

export interface TistoryPluginSettings {
  authType: AuthType;
  appId: string;
  secretKey: string;
}
