import React, { ChangeEventHandler, useCallback, useEffect, useState } from 'react';

import { ENCRYPTED_PASSWORD, TISTORY_LOCAL_STORAGE_KEY } from '~/constants';
import { AuthType } from '~/types';
import { encrypt } from '~/helper/encrypt';
import TistoryPlugin from '~/TistoryPlugin';
import SettingItem from './SettingItem';
import TistoryClient from '~/tistory/TistoryClient';
import { clearTistoryAuthInfo, getTistoryAuthInfo, updateTistoryAuthInfo } from '~/helper/storage';
import { Blog } from '~/tistory/types';

type Props = {
  plugin: TistoryPlugin;
  onAuth(authCallback?: (ok: boolean) => void): void;
};

const SettingForm: React.FC<Props> = ({ plugin, onAuth }) => {
  const settings = plugin.settings;

  const [isLogged, setIsLogged] = useState(Boolean(localStorage.getItem(TISTORY_LOCAL_STORAGE_KEY)));
  const [disabledAuthButton, setDisabledAuthButton] = useState(true);
  const [authType, setAuthType] = useState<AuthType>(settings.authType);
  const [appId, setAppId] = useState(settings.appId);
  const [secretKey, setSecretKey] = useState(settings.secretKey);
  const [formError, setFormError] = useState({
    appId: '',
    secretKey: '',
  });
  const [selectedBlog, setSelectedBlog] = useState('');
  const [blogs, setBlogs] = useState<Blog[]>();

  const handleChangeAuthType: ChangeEventHandler<HTMLSelectElement> = event => {
    const newValue = event.target.value as AuthType;
    setAuthType(newValue);
    settings.authType = newValue;
    plugin.saveSettings();
  };

  const handleChangeAppId: ChangeEventHandler<HTMLInputElement> = event => {
    const newValue = event.target.value;
    setAppId(newValue);
    if (newValue.length === 32) {
      settings.appId = newValue;
      plugin.saveSettings();
      setFormError(prev => ({
        ...prev,
        appId: '',
      }));
    } else {
      setFormError(prev => ({
        ...prev,
        appId: '올바른 App ID를 입력해주세요.',
      }));
    }
  };

  const handleChangeSecretKey: ChangeEventHandler<HTMLInputElement> = useCallback(async event => {
    const newValue = event.target.value;
    setSecretKey(newValue);
    if (newValue.length === 72) {
      settings.secretKey = await encrypt(newValue, ENCRYPTED_PASSWORD);
      plugin.saveSettings();
      setFormError(prev => ({
        ...prev,
        secretKey: '',
      }));
    } else {
      setFormError(prev => ({
        ...prev,
        secretKey: '올바른 Secret Key를 입력해주세요.',
      }));
    }
  }, []);

  const handleLogin = () => {
    // 인증을 시도하고 인증 성공 여부을 콜백 함수로 받는다.
    onAuth(async result => {
      setIsLogged(result);
    });
  };

  const handleLogout = () => {
    clearTistoryAuthInfo();
    setIsLogged(false);
  };

  useEffect(() => {
    if (authType === AuthType.USE_MY_TISTORY_APP && appId.length !== 32 && secretKey.length !== 72) {
      setDisabledAuthButton(true);
    } else {
      setDisabledAuthButton(false);
    }
  }, [authType, appId, secretKey]);

  const loadAuthInfo = async () => {
    const accessInfo = getTistoryAuthInfo();
    // TODO: 인증 실패하면 에러 메시지 출력후 재로그인 팝업 노출하기
    if (accessInfo?.accessToken) {
      const client = new TistoryClient(accessInfo?.accessToken);
      const { blogs } = await client.getBlogs();
      setBlogs(blogs);
      setSelectedBlog(accessInfo?.selectedBlog || blogs[0].name);
    }
  };

  useEffect(() => {
    if (isLogged) {
      loadAuthInfo();
    }
  }, [isLogged]);

  const handleChangeBlog: ChangeEventHandler<HTMLSelectElement> = event => {
    const value = event.target.value;
    setSelectedBlog(value);
    updateTistoryAuthInfo({ selectedBlog: value });
  };

  return (
    <div className="tistory">
      <h2>티스토리(Tistory)</h2>
      <SettingItem
        name="티스토리 인증 방식"
        description={
          <div>
            "내 티스토리 앱 사용" 방식을 권장합니다. 티스토리 앱 생성은{' '}
            <a href="https://www.tistory.com/guide/api/manage/register">티스토리 오픈 API</a>
            에서 가능합니다.
          </div>
        }
      >
        <select
          className="dropdown"
          aria-label="티스토리 인증 방식 선택 옵션"
          onChange={handleChangeAuthType}
          defaultValue={settings.authType}
        >
          <option value={AuthType.USE_MY_TISTORY_APP}>내 티스토리 앱 사용</option>
          <option value={AuthType.EASY_AUTHENTICATION} disabled>
            간편 인증
          </option>
        </select>
      </SettingItem>

      {authType === AuthType.USE_MY_TISTORY_APP && (
        <>
          <SettingItem name="App ID" description="티스토리 앱 App ID를 입력하세요." error={formError.appId}>
            <input
              type="text"
              aria-label="티스토리 앱 App ID"
              defaultValue={settings.appId}
              onInput={handleChangeAppId}
              placeholder="티스토리 앱 App ID"
            />
          </SettingItem>
          <SettingItem name="Secret Key" description="티스토리 앱 Secret Key를 입력하세요." error={formError.secretKey}>
            <input
              type="password"
              aria-label="티스토리 앱 Secret Key"
              defaultValue={settings.secretKey}
              onInput={handleChangeSecretKey}
              placeholder="티스토리 앱 Secret Key"
            />
          </SettingItem>
        </>
      )}

      {isLogged && (
        <>
          <SettingItem name="티스토리 인증" description="인증을 해제하려면 로그아웃 버튼을 눌러주세요">
            <button onClick={handleLogout} className="mod-warning">
              로그아웃
            </button>
          </SettingItem>

          <SettingItem name="티스토리 기본 블로그" description="글을 발행할 티스토리 블로그를 선택하세요.">
            <select
              className="dropdown"
              aria-label="티스토리 블로그 선택"
              onChange={handleChangeBlog}
              value={selectedBlog}
            >
              {blogs?.map(blog => {
                return (
                  <option key={blog.blogId} id={blog.blogId} value={blog.name}>
                    {blog.title} ({blog.url.replace(/^https?:\/\//, '')})
                  </option>
                );
              })}
            </select>
          </SettingItem>
        </>
      )}

      {!isLogged && (
        <SettingItem name="티스토리 인증" description="인증하기 버튼을 눌러 티스토리 인증을 해주세요.">
          <button onClick={handleLogin} disabled={disabledAuthButton}>
            인증하기
          </button>
        </SettingItem>
      )}
    </div>
  );
};

export default SettingForm;
