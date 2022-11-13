import React, { ChangeEvent, PropsWithChildren, useEffect, useRef, useState } from 'react';

import { Category, Post } from '~/tistory/types';
import TistoryPlugin from '~/TistoryPlugin';
import { TistoryAuthStorage } from '~/helper/storage';
import SettingItem from '~/ui/components/SettingItem';
import { TistoryPublishOptions } from '~/ui/PublishConfirmModal';

type Props = PropsWithChildren<{
  plugin: TistoryPlugin;
  blogName: string;
  options: TistoryPublishOptions;
  onClose(): void;
  onPublish(result: TistoryPublishOptions): void;
}>;

const PublishConfirm: React.FC<Props> = (props) => {
  const { plugin, blogName, options, onClose, onPublish } = props;
  const { tistoryClient } = plugin;

  const tistoryBlogName = useRef(blogName);
  const [categories, setCategories] = useState<Category[]>([]);

  const [tistoryTitle, setTistoryTitle] = useState(options?.tistoryTitle ?? '');
  const [tistoryVisibility, setTistoryVisibility] = useState<Post['visibility']>(options?.tistoryVisibility ?? '3'); // 발행상태 (0: 비공개, 1: 공개(보호), 3: 공개)
  const [tistoryCategory, setTistoryCategory] = useState<string>(options?.tistoryCategory ?? '0'); // category: 카테고리 아이디 (기본값: 0)
  const [tistorySkipModal, setTistorySkipModal] = useState<boolean>(options?.tistorySkipModal ?? true); // category: 카테고리 아이디 (기본값: 0)

  const handleChangeVisibility = (event: ChangeEvent<HTMLInputElement>) => {
    setTistoryVisibility(event.target.value as Post['visibility']);
  };

  const handleChangeCategory = (event: ChangeEvent<HTMLSelectElement>) => {
    setTistoryCategory(event.target.value);
  };

  const handleChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTistoryTitle(event.target.value);
  };

  const handleChangeSkipModal = (event: ChangeEvent<HTMLInputElement>) => {
    setTistorySkipModal(event.target.checked);
  };

  const handlePublish = () => {
    const postParams: TistoryPublishOptions = {
      ...options,
      tistoryBlogName: tistoryBlogName.current,
      tistoryTitle,
      tistoryVisibility,
      tistoryCategory,
      tistorySkipModal,
    };
    onPublish(postParams);
  };

  useEffect(() => {
    (async function loadCategories() {
      if (!tistoryClient) return;

      // If no blog is selected, select the first blog automatically
      if (!tistoryBlogName.current) {
        const { blogs } = await tistoryClient.getBlogs();
        tistoryBlogName.current = blogs?.[0].name;
        TistoryAuthStorage.updateTistoryAuthInfo({ defaultBlogName: tistoryBlogName.current });
      }

      // Fetching a list of categories in a blog
      const { categories = [] } = await tistoryClient.getCategories(tistoryBlogName.current);
      setCategories(categories);

      // To automatically select a category
      const hasCategoryInBlog = Boolean(
        options?.tistoryCategory && categories.find(({ id }) => id === options?.tistoryCategory),
      );
      if (!hasCategoryInBlog) {
        setTistoryCategory('0');
      }
    })();
  }, []);

  return (
    <>
      <SettingItem name="공개/비공개">
        <label>
          <input
            type="radio"
            name="visibility"
            value="3"
            checked={String(tistoryVisibility) === '3'}
            onChange={handleChangeVisibility}
          />{' '}
          공개
        </label>
        <label>
          <input
            type="radio"
            name="visibility"
            value="0"
            checked={String(tistoryVisibility) === '0'}
            onChange={handleChangeVisibility}
          />{' '}
          비공개
        </label>
      </SettingItem>
      <SettingItem name="카테고리">
        <select
          className="dropdown"
          aria-label="티스토리 카테고리"
          onChange={handleChangeCategory}
          value={String(tistoryCategory)}
        >
          <option value="0">카테고리 없음</option>
          {categories?.map((cate) => {
            return (
              <option key={cate.id} value={cate.id}>
                {cate.label}
              </option>
            );
          })}
        </select>
      </SettingItem>
      <SettingItem name="제목">
        <input
          type="text"
          defaultValue={options?.tistoryTitle}
          onChange={handleChangeTitle}
          style={{ width: '100%' }}
        />
      </SettingItem>
      <SettingItem name="">
        <label htmlFor="tistorySkipModalRadioBox">수정할 때 모달창을 열지 않음</label>
        <input
          name="skipModal"
          type="checkbox"
          id="tistorySkipModalRadioBox"
          checked={tistorySkipModal}
          onChange={handleChangeSkipModal}
        />
      </SettingItem>
      <SettingItem name="">
        <button onClick={onClose}>취소</button>
        <button className="mod-cta" onClick={handlePublish}>
          발행하기
        </button>
      </SettingItem>
    </>
  );
};

export default PublishConfirm;
