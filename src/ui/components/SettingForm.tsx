import React, { ChangeEventHandler, useEffect, useState } from 'react';

import TistoryPlugin from '~/TistoryPlugin';
import SettingItem from './SettingItem';
import { TistoryAuthStorage } from '~/helper/storage';
import { Blog } from '~/tistory/types';

type Props = {
  plugin: TistoryPlugin;
  loggedIn: boolean;
  onAuth(callback: (success: boolean) => void): void;
};

const SettingForm: React.FC<Props> = ({ plugin, loggedIn, onAuth }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(loggedIn);
  const [selectedBlog, setSelectedBlog] = useState('');
  const [blogs, setBlogs] = useState<Blog[]>();

  const handleLogin = () => {
    // 인증을 시도하고 인증 성공 여부을 콜백 함수로 받는다.
    onAuth((success) => {
      setIsLoggedIn(success);
    });
  };

  const handleLogout = () => {
    plugin.logout();
    setIsLoggedIn(false);
  };

  const loadAuthInfo = async () => {
    const accessInfo = TistoryAuthStorage.loadTistoryAuthInfo();
    if (accessInfo?.accessToken) {
      plugin.createTistoryClient(accessInfo.accessToken);
      if (plugin.tistoryClient) {
        const { blogs } = await plugin.tistoryClient.getBlogs();
        setBlogs(blogs);
        setSelectedBlog(accessInfo?.defaultBlogName || blogs[0].name);
        if (!accessInfo.defaultBlogName) {
          TistoryAuthStorage.updateTistoryAuthInfo({ defaultBlogName: blogs[0].name });
        }
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadAuthInfo();
    }
  }, [isLoggedIn]);

  const handleChangeBlog: ChangeEventHandler<HTMLSelectElement> = (event) => {
    const value = event.target.value;
    setSelectedBlog(value);
    TistoryAuthStorage.updateTistoryAuthInfo({ defaultBlogName: value });
  };

  return (
    <div className="tistory">
      <h2>티스토리(Tistory)</h2>
      {!isLoggedIn && (
        <SettingItem name="티스토리 인증" description="인증하기 버튼을 눌러 티스토리 인증을 해주세요.">
          <button onClick={handleLogin}>인증하기</button>
        </SettingItem>
      )}

      {isLoggedIn && (
        <>
          <SettingItem name="티스토리 인증" description="인증을 해제하려면 로그아웃 버튼을 눌러주세요">
            <button onClick={handleLogout} className="mod-warning">
              로그아웃
            </button>
          </SettingItem>

          <SettingItem name="기본 블로그" description="글을 발행할 티스토리 기본 블로그를 선택하세요.">
            <select
              className="dropdown"
              aria-label="티스토리 블로그 선택"
              onChange={handleChangeBlog}
              value={selectedBlog}
              placeholder="기본 블로그를 선택하세요."
              disabled={!blogs?.length}
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
