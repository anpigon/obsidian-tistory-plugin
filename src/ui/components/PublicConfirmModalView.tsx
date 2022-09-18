import React, { ChangeEvent, PropsWithChildren, useEffect, useState } from 'react';
import { Category, Post } from '~/tistory/types';
import TistoryPlugin from '~/TistoryPlugin';
import SettingItem from './SettingItem';

export type PostOptions = Partial<{
  tistoryBlogName: string;
  tistoryPostId: string;
  tistoryTitle: string;
  tistoryVisibility: '0' | '1' | '3';
  tistoryCategory: string;
  tistoryTag: string;
  tistoryPublished: string;
  tistorySlogan: string;
  tistoryAcceptComment: '0' | '1';
  tistoryPostUrl: string;
  title: string;
  tag: string;
}>;

type Props = PropsWithChildren<{
  plugin: TistoryPlugin;
  blogName: string;
  options: PostOptions;
  onClose(): void;
  onPublish(result: PostOptions): void;
}>;

const PublicConfirmModalView: React.FC<Props> = (props) => {
  const { plugin, blogName, options, onClose, onPublish } = props;
  const { tistoryClient } = plugin;

  const [categories, setCategories] = useState<Category[]>([]);

  const [tistoryTitle, setTistoryTitle] = useState(options?.tistoryTitle);
  const [tistoryVisibility, setTistoryVisibility] = useState<Post['visibility']>(options?.tistoryVisibility ?? '3'); // 발행상태 (0: 비공개, 1: 공개(보호), 3: 공개)
  const [tistoryCategory, setTistoryCategory] = useState<string>(options?.tistoryCategory ?? '0'); // category: 카테고리 아이디 (기본값: 0)

  const handleChangeVisibility = (event: ChangeEvent<HTMLInputElement>) => {
    setTistoryVisibility(event.target.value as Post['visibility']);
  };

  const handleChangeCategory = (event: ChangeEvent<HTMLSelectElement>) => {
    setTistoryCategory(event.target.value);
  };

  const handleChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTistoryTitle(event.target.value);
  };

  const handlePublish = () => {
    onPublish({
      tistoryVisibility,
      tistoryCategory,
      tistoryTitle,
    });
  };

  useEffect(() => {
    (async function loadCategories() {
      const getCategoriesResponse = await tistoryClient.getCategories(blogName);
      setCategories(getCategoriesResponse.categories);

      const hasCategoryInBlog = Boolean(
        options?.tistoryCategory && getCategoriesResponse.categories.find(({ id }) => id === options?.tistoryCategory),
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
          {categories.map((cate) => {
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
        <button onClick={onClose}>취소</button>
        <button className="mod-cta" onClick={handlePublish}>
          발행하기
        </button>
      </SettingItem>
    </>
  );
};

export default PublicConfirmModalView;
