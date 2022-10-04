import React, { ChangeEvent, PropsWithChildren, useEffect, useState, useRef } from 'react';
import { Category, Post } from '~/tistory/types';
import TistoryPlugin from '~/TistoryPlugin';
import SettingItem from './SettingItem';
import { TistoryAuthStorage } from '~/helper/storage';

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

const PublishConfirmModal: React.FC<Props> = (props) => {
  const { plugin, blogName, options, onClose, onPublish } = props;
  const { tistoryClient } = plugin;

  const tistoryBlogName = useRef(blogName);
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
      tistoryBlogName: tistoryBlogName.current,
      tistoryVisibility,
      tistoryCategory,
      tistoryTitle,
    });
  };

  useEffect(() => {
    (async function loadCategories() {
      // If no blog is selected, select the first blog automatically
      if (!tistoryBlogName.current) {
        const { blogs } = await tistoryClient.getBlogs();
        tistoryBlogName.current = blogs[0].name;
        if (tistoryBlogName.current) {
          TistoryAuthStorage.updateTistoryAuthInfo({ selectedBlog: tistoryBlogName.current });
        }
      }

      // Fetching a list of categories in a blog
      const { categories } = await tistoryClient.getCategories(tistoryBlogName.current);
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

export default PublishConfirmModal;
