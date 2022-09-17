import React from 'react';
import { Notice, PluginSettingTab } from 'obsidian';
import { createRoot, Root } from 'react-dom/client';

import TistoryPlugin from '~/TistoryPlugin';
import { ENCRYPTED_PASSWORD, TISTORY_CLIENT_ID } from '~/constants';
import TistoryAuthModal from './components/TistoryAuthModal';
import SettingForm from './components/SettingForm';
import { AuthType, TistoryPluginSettings } from '~/types';
import { decrypt } from '~/helper/encrypt';
import { getTistoryAuthInfo, setTistoryAuthInfo } from '~/helper/storage';
import { requestTistoryAccessToken, createTistoryAuthUrl } from '~/tistory';

export const DEFAULT_SETTINGS: TistoryPluginSettings = {
  authType: AuthType.USE_MY_TISTORY_APP,
  appId: '',
  secretKey: '',
};

export default class TistorySettingTab extends PluginSettingTab {
  #root: Root | null;
  authModal?: TistoryAuthModal;
  state: string;

  constructor(private readonly plugin: TistoryPlugin) {
    super(plugin.app, plugin);
    this.state = '';

    // 티스토리 인증 콜팩 URL 프로토콜 리스닝 핸들러
    this.plugin.registerObsidianProtocolHandler('tistory-oauth', params => {
      if (!this.authModal || !this.authModal.isOpen) {
        return;
      }

      if (params.error) {
        // 오류가 발생한 경우 HTTP 오류 응답과 함께 오류 메시지가 응답값으로 옵니다.
        // error={error}&error_description={error-description}
        console.warn(params);
        this.handleTistoryAuthModalClose();
        const errorMessage = params.error_description?.replace(/_/g, ' ') ?? params.error;
        new Notice(`Authentication failed with error:\n${errorMessage}`);
        return;
      }

      const { code, state } = params;
      if (state !== this.state) {
        this.handleTistoryAuthModalClose();
        new Notice('Authentication failed with error: bad request');
        return;
      }

      this.handleTistoryAuthCallback(code);
    });
  }

  /** 티스토리 accessToken을 요청 */
  async handleTistoryAuthCallback(code: string) {
    const { authType } = this.plugin.settings;
    if (authType === AuthType.EASY_AUTHENTICATION) {
      // TODO: 인증 서버로 인증 요청하여 accessToken 발급 받기
      // ex: https://tistory-auth.example.com?client_id=${TISTORY_CLIENT_ID}&code=${code}
    } else if (authType === AuthType.USE_MY_TISTORY_APP) {
      const clientId = this.plugin.settings.appId;
      const clientSecretKey = await decrypt(this.plugin.settings.secretKey, ENCRYPTED_PASSWORD);
      const accessToken = await requestTistoryAccessToken({
        code,
        clientId,
        clientSecretKey,
      });

      // 토큰값 저장
      setTistoryAuthInfo({
        accessToken,
        selectedBlog: null,
      });

      this.handleTistoryAuthModalClose();

      this.plugin.createTistoryClient(accessToken);
    }
  }

  getClientId() {
    if (this.plugin.settings.authType === AuthType.USE_MY_TISTORY_APP) {
      return this.plugin.settings.appId;
    } else {
      return TISTORY_CLIENT_ID;
    }
  }

  // 티스토리 인증 요청 모달팝업 오픈
  handleTistoryAuthModalOpen(authCallback?: (ok: boolean) => void) {
    const state = (this.state = Date.now().toString(36));
    const clientId = this.getClientId();
    const authLink = createTistoryAuthUrl({ clientId, state });

    this.authModal = new TistoryAuthModal(this.plugin.app, authLink, async () => {
      // 모달 팝업이 닫히면 인증 성공 여부를 콜백 함수로 전달
      const isLogged = Boolean(getTistoryAuthInfo()?.accessToken);
      authCallback?.(isLogged);
    });
    this.authModal.open();
  }

  handleTistoryAuthModalClose() {
    if (this.authModal) {
      this.authModal.close();
      this.authModal = undefined;
    }
  }

  display(): void {
    const { containerEl } = this;

    if (!this.#root) {
      containerEl.empty();
      this.#root = createRoot(containerEl);
    }

    this.#root.render(
      <SettingForm plugin={this.plugin} onAuth={authCallback => this.handleTistoryAuthModalOpen(authCallback)} />,
    );
  }
}
