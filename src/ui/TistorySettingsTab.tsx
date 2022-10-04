import React from 'react';
import { Notice, PluginSettingTab } from 'obsidian';
import { createRoot, Root } from 'react-dom/client';

import TistoryPlugin from '~/TistoryPlugin';
import { TISTORY_CLIENT_ID } from '~/constants';
import TistoryAuthModal from './components/TistoryAuthModal';
import SettingForm from './components/SettingForm';
import { TistoryPluginSettings } from '~/types';
import { TistoryAuthStorage } from '~/helper/storage';
import { createTistoryAuthUrl, requestTistoryAccessToken } from '~/tistory/TistoryAuth';

export const DEFAULT_SETTINGS: TistoryPluginSettings = {};

export default class TistorySettingTab extends PluginSettingTab {
  #root: Root | null;
  authModal?: TistoryAuthModal;
  state: string;

  constructor(private readonly plugin: TistoryPlugin) {
    super(plugin.app, plugin);
    this.state = '';

    // 티스토리 인증 콜팩 URL 프로토콜 리스닝 핸들러
    this.plugin.registerObsidianProtocolHandler('tistory-oauth', (params) => {
      if (!this.authModal || !this.authModal.isOpen) {
        return;
      }

      if (params.error) {
        // 오류가 발생한 경우 HTTP 오류 응답과 함께 오류 메시지가 응답값으로 옵니다.
        // error={error}&error_description={error-description}
        console.warn(params);
        this.handleTistoryAuthModalClose(false);
        const errorMessage = params.error_description?.replace(/_/g, ' ') ?? params.error;
        new Notice(`Authentication failed with error:\n${errorMessage}`);
        return;
      }

      const { code, state } = params;
      if (state !== this.state) {
        this.handleTistoryAuthModalClose(false);
        new Notice('Authentication failed with error: bad request');
        return;
      }

      this.handleTistoryAuthCallback(code);
    });
  }

  /** 티스토리 accessToken을 요청 */
  async handleTistoryAuthCallback(code: string) {
    const accessToken = await requestTistoryAccessToken(code);

    // 내 블로그 목록 가져오기
    this.plugin.createTistoryClient(accessToken);
    const { blogs } = await this.plugin.tistoryClient.getBlogs();

    // 토큰값 저장
    TistoryAuthStorage.saveTistoryAuthInfo({
      accessToken,
      selectedBlog: blogs?.[0].name ?? '',
    });

    // 인증 모달 닫기
    this.handleTistoryAuthModalClose(true);
  }

  // 티스토리 인증 요청 모달팝업 오픈
  handleTistoryAuthModalOpen(callback?: (ok: boolean) => void) {
    const state = (this.state = Date.now().toString(36));
    const authLink = createTistoryAuthUrl({ clientId: TISTORY_CLIENT_ID, state });
    this.authModal = new TistoryAuthModal(this.plugin.app, authLink, async () => {
      // 모달 팝업이 닫히면 인증 성공 여부를 콜백 함수로 전달
      callback?.(Boolean(this.authModal?.isSuccess));
    });
    this.authModal.open();
  }

  handleTistoryAuthModalClose(isSuccess: boolean) {
    if (this.authModal) {
      this.authModal.isSuccess = isSuccess;
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
      <SettingForm plugin={this.plugin} onAuth={(callback) => this.handleTistoryAuthModalOpen(callback)} />,
    );
  }
}
