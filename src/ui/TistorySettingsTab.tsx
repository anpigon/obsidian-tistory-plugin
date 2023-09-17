import { Notice, PluginSettingTab } from 'obsidian';
import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { TISTORY_CLIENT_ID } from '~/constants';
import { TistoryAuthStorage } from '~/helper/storage';
import { createTistoryAuthUrl, requestTistoryAccessToken } from '~/tistory/TistoryAuth';
import TistoryPlugin from '~/TistoryPlugin';
import type { TistoryPluginSettings } from '~/types';
import SettingForm from './components/SettingForm';
import TistoryAuthModal from './components/TistoryAuthModal';

export const DEFAULT_SETTINGS: TistoryPluginSettings = {
  useMathjax: true,
};

export default class TistorySettingTab extends PluginSettingTab {
  #authModal?: TistoryAuthModal;
  #state: string;
  #callback?: (success: boolean) => void;

  constructor(private readonly plugin: TistoryPlugin) {
    super(plugin.app, plugin);
    this.#state = '';

    // 티스토리 인증 콜팩 URL 프로토콜 리스닝 핸들러
    this.plugin.registerObsidianProtocolHandler('tistory-oauth', (params) => {
      if (!this.#authModal || !this.#authModal.isOpen) {
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
      if (state !== this.#state) {
        this.handleTistoryAuthModalClose();
        new Notice('Authentication failed with error: bad request');
        return;
      }

      this.handleTistoryAuthCallback(code);
    });
  }

  /** 티스토리 accessToken을 요청 */
  async handleTistoryAuthCallback(code: string) {
    this.#authModal?.updateText('티스토리 인증에 성공했습니다. 모달창은 잠시 후 자동으로 닫힙니다.');

    const accessToken = await requestTistoryAccessToken(code);
    TistoryAuthStorage.saveTistoryAuthInfo({ accessToken });
    this.plugin.createTistoryClient(accessToken);
    this.#callback?.(true);
    this.#callback = undefined;

    // 인증 모달 닫기
    this.handleTistoryAuthModalClose();
  }

  // 티스토리 인증 요청 모달 팝업 오픈
  handleTistoryAuthModalOpen(callback: (success: boolean) => void) {
    this.#callback = callback;
    const state = (this.#state = Date.now().toString(36));
    const authLink = createTistoryAuthUrl({ clientId: TISTORY_CLIENT_ID, state });
    this.#authModal = new TistoryAuthModal(this.plugin.app, authLink);
    this.#authModal.open();
  }

  handleTistoryAuthModalClose() {
    if (this.#authModal) {
      this.#authModal.close();
      this.#authModal = undefined;
    }
  }

  display(): void {
    createRoot(this.containerEl).render(
      <SettingForm
        plugin={this.plugin}
        loggedIn={!!TistoryAuthStorage.getAccessToken()}
        onAuth={(cb) => this.handleTistoryAuthModalOpen(cb)}
      />,
    );
  }

  hide(): void {
    ReactDOM.unmountComponentAtNode(this.containerEl);
    super.hide();
  }
}
