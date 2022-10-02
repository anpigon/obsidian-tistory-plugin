import React, { ChangeEventHandler, useCallback, useEffect, useState } from 'react';

import { ENCRYPTED_PASSWORD, TISTORY_LOCAL_STORAGE_KEY } from '~/constants';
import { AuthType } from '~/types';
import { encrypt } from '~/helper/encrypt';
import TistoryPlugin from '~/TistoryPlugin';
import SettingItem from './SettingItem';
import TistoryClient from '~/tistory/TistoryClient';
import { TistoryAuthStorage } from '~/helper/storage';
import { Blog } from '~/tistory/types';

type Props = {
  plugin: TistoryPlugin;
  onAuth(callback: (ok: boolean) => void): void;
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

  const handleChangeAuthType: ChangeEventHandler<HTMLSelectElement> = (event) => {
    const newValue = event.target.value as AuthType;
    setAuthType(newValue);
    settings.authType = newValue;
    plugin.saveSettings();
  };

  const handleChangeAppId: ChangeEventHandler<HTMLInputElement> = (event) => {
    const newValue = event.target.value;
    setAppId(newValue);
    settings.appId = newValue;
    plugin.saveSettings();
  };

  const handleChangeSecretKey: ChangeEventHandler<HTMLInputElement> = useCallback(async (event) => {
    const newValue = event.target.value;
    setSecretKey(newValue);
    settings.secretKey = newValue.length === 72 ? await encrypt(newValue, ENCRYPTED_PASSWORD) : newValue;
    plugin.saveSettings();
  }, []);

  const isAppId = (value: string) => {
    return value.length === 32;
  };
  const isValidateSecretKey = (value: string) => {
    return value.length === 72 || value.length === 128;
  };
  const handleValidate = () => {
    const _isAppId = isAppId(appId);
    const _isValidateSecretKey = isValidateSecretKey(secretKey);
    setFormError((prev) => ({
      ...prev,
      appId: (appId || formError.appId) && !_isAppId ? '올바른 App ID를 입력해주세요.' : '',
      secretKey: (secretKey || formError.secretKey) && !_isValidateSecretKey ? '올바른 Secret Key를 입력해주세요.' : '',
    }));
    return _isAppId && _isValidateSecretKey;
  };

  const handleLogin = () => {
    // 인증을 시도하고 인증 성공 여부을 콜백 함수로 받는다.
    onAuth((isSuccess) => {
      setIsLogged(isSuccess);
    });
  };

  const handleLogout = () => {
    TistoryAuthStorage.clearTistoryAuthInfo();
    setIsLogged(false);
  };

  const loadAuthInfo = async () => {
    const accessInfo = TistoryAuthStorage.loadTistoryAuthInfo();
    // TODO: 인증 실패하면 에러 메시지 출력후 재로그인 팝업 노출하기
    if (accessInfo?.accessToken) {
      const client = new TistoryClient(accessInfo?.accessToken);
      const { blogs } = await client.getBlogs();
      setBlogs(blogs);
      setSelectedBlog(accessInfo?.selectedBlog || blogs[0].name);

      if (!accessInfo.selectedBlog) {
        TistoryAuthStorage.updateTistoryAuthInfo({ selectedBlog: blogs[0].name });
      }
    }
  };

  useEffect(() => {
    if (isLogged) {
      loadAuthInfo();
    }
  }, [isLogged]);

  useEffect(() => {
    if (authType === AuthType.USE_MY_TISTORY_APP) {
      setDisabledAuthButton(!handleValidate());
    } else {
      setDisabledAuthButton(false);
    }
  }, [authType, appId, secretKey]);

  const handleChangeBlog: ChangeEventHandler<HTMLSelectElement> = (event) => {
    const value = event.target.value;
    setSelectedBlog(value);
    TistoryAuthStorage.updateTistoryAuthInfo({ selectedBlog: value });
  };

  return (
    <div className="tistory">
      <h2>티스토리(Tistory)</h2>
      <SettingItem
        name="티스토리 인증 방식"
        description={
          <div>
            "간편 인증"은 개발자의 서버에서 인증하는 방식입니다. 서버 상태에 따라 인증이 안될 수도 있습니다.
            <br />
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
          <option value={AuthType.EASY_AUTHENTICATION}>간편 인증</option>
          <option value={AuthType.USE_MY_TISTORY_APP}>내 티스토리 앱 사용</option>
        </select>
      </SettingItem>

      {authType === AuthType.USE_MY_TISTORY_APP && (
        <>
          <SettingItem name="App ID" description="티스토리 앱 App ID를 입력하세요." errorMessage={formError.appId}>
            <input
              type="text"
              aria-label="티스토리 앱 App ID"
              defaultValue={settings.appId}
              onInput={handleChangeAppId}
              placeholder="티스토리 앱 App ID"
            />
          </SettingItem>
          <SettingItem
            name="Secret Key"
            description="티스토리 앱 Secret Key를 입력하세요."
            errorMessage={formError.secretKey}
          >
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

      {!isLogged && (
        <SettingItem
          name="티스토리 인증"
          description="인증하기 버튼을 눌러 티스토리 인증을 해주세요."
          errorMessage={disabledAuthButton && 'App ID와 Secret Key를 입력해주세요.'}
        >
          <button onClick={handleLogin} disabled={disabledAuthButton}>
            인증하기
          </button>
        </SettingItem>
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
              <option disabled>기본 블로그를 선택하세요.</option>
              {blogs?.map((blog) => {
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
    </div>
  );
};

export default SettingForm;
