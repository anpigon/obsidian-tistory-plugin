import React, { ChangeEvent, PropsWithChildren, useEffect, useState } from 'react';
import { Category, Post, PostParams } from '~/tistory/types';
import TistoryPlugin from '~/TistoryPlugin';
import SettingItem from './SettingItem';

export type PostOptions = Partial<PostParams>;

type Props = PropsWithChildren<{
  plugin: TistoryPlugin;
  blogName: string;
  options: PostOptions;
  onClose(): void;
  onPublish(result: PostOptions): void;
}>;

const PublicConfirmModalView: React.FC<Props> = props => {
  const { plugin, blogName, options, onClose, onPublish } = props;
  const { tistoryClient } = plugin;

  const [categories, setCategories] = useState<Category[]>([]);

  const [title, setTitle] = useState(options?.title);
  const [visibility, setVisibility] = useState<Post['visibility']>(options.visibility || '3'); // 발행상태 (0: 비공개, 1: 공개(보호), 3: 공개)
  const [category, setCategory] = useState<string>(options?.category || '0'); // category: 카테고리 아이디 (기본값: 0)

  const handleChangeVisibility = (event: ChangeEvent<HTMLInputElement>) => {
    setVisibility(event.target.value as Post['visibility']);
  };

  const handleChangeCategory = (event: ChangeEvent<HTMLSelectElement>) => {
    setCategory(event.target.value);
  };

  const handleChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSave = () => {
    onPublish({ visibility, category, title });
  };

  useEffect(() => {
    (async function loadCategories() {
      const getCategoriesResponse = await tistoryClient.getCategories(blogName);
      setCategories(getCategoriesResponse.categories);

      const hasCategoryInBlog = Boolean(
        options?.category && getCategoriesResponse.categories.find(({ id }) => id === options?.category),
      );
      if (!hasCategoryInBlog) {
        setCategory('0');
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
            checked={String(visibility) === '3'}
            onChange={handleChangeVisibility}
          />{' '}
          공개
        </label>
        <label>
          <input
            type="radio"
            name="visibility"
            value="0"
            checked={String(visibility) === '0'}
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
          value={String(category)}
        >
          <option value="0">카테고리 없음</option>
          {categories.map(cate => {
            return (
              <option key={cate.id} value={cate.id}>
                {cate.label}
              </option>
            );
          })}
        </select>
      </SettingItem>
      <SettingItem name="제목">
        <input type="text" defaultValue={options.title} onChange={handleChangeTitle} style={{ width: '100%' }} />
      </SettingItem>
      <SettingItem name="">
        <button onClick={onClose}>Cancel</button>
        <button className="mod-cta" onClick={handleSave}>
          Publish
        </button>
      </SettingItem>
    </>
  );
};

export default PublicConfirmModalView;
