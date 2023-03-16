import React, { ChangeEvent, PropsWithChildren, useEffect, useRef, useState } from 'react';

import { Category, Post } from '~/tistory/types';
import TistoryPlugin from '~/TistoryPlugin';
import { TistoryAuthStorage } from '~/helper/storage';
import SettingItem from '~/ui/components/SettingItem';
import { TistoryPublishOptions } from '~/ui/PublishConfirmModal';
import { dateFormat } from '~/helper/dateFormat';

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
  const [tistoryTags, setTistoryTags] = useState(options?.tistoryTags ?? '');
  const [tistoryVisibility, setTistoryVisibility] = useState<Post['visibility']>(options?.tistoryVisibility ?? '3'); // 발행상태 (0: 비공개, 1: 공개(보호), 3: 공개)
  const [tistoryPublished, setTistoryPublished] = useState<string>(options?.tistoryPublished ?? ''); // 발행시간
  const [tistoryScheduled, setTistoryScheduled] = useState<string>(options?.tistoryPublished ? '1' : '0'); // 0: 현재발행, 1: 예약발행
  const [tistoryCategory, setTistoryCategory] = useState<string>(options?.tistoryCategory ?? '0'); // category: 카테고리 아이디 (기본값: 0)
  const [tistorySkipModal, setTistorySkipModal] = useState<boolean>(options?.tistorySkipModal ?? true); // category: 카테고리 아이디 (기본값: 0)

  useEffect(() => {
    if (tistoryVisibility === '0') {
      setTistoryScheduled('0');
      setTistoryPublished('');
    }
  }, [tistoryVisibility]);

  const handleChangeVisibility = (event: ChangeEvent<HTMLInputElement>) => {
    setTistoryVisibility(event.target.value as Post['visibility']);
  };

  const handleChangeCategory = (event: ChangeEvent<HTMLSelectElement>) => {
    setTistoryCategory(event.target.value);
  };

  const handleChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTistoryTitle(event.target.value);
  };

  const handleChangeTag = (event: ChangeEvent<HTMLInputElement>) => {
    setTistoryTags(event.target.value);
  };

  const handleChangeSkipModal = (event: ChangeEvent<HTMLInputElement>) => {
    setTistorySkipModal(event.target.checked);
  };

  const handlePublish = () => {
    const postParams: TistoryPublishOptions = {
      ...options,
      tistoryBlogName: tistoryBlogName.current,
      tistoryTitle,
      tistoryTags: tistoryTags,
      tistoryVisibility,
      tistoryCategory,
      tistorySkipModal,
      tistoryPublished,
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
      <SettingItem
        name={
          <span>
            태그<small> 콤마(,)로 구분</small>
          </span>
        }
      >
        <input type="text" defaultValue={options?.tistoryTags} onChange={handleChangeTag} style={{ width: '100%' }} />
      </SettingItem>
      <SettingItem name="발행일">
        <label>
          <input
            type="radio"
            name="scheduled"
            value="0"
            checked={tistoryScheduled === '0'}
            onChange={(e) => {
              setTistoryPublished('');
              setTistoryScheduled(e.target.value);
            }}
          />{' '}
          현재
        </label>
        <label>
          <input
            type="radio"
            name="scheduled"
            disabled={tistoryVisibility === '0'}
            value="1"
            checked={tistoryScheduled === '1'}
            onChange={(e) => {
              setTistoryScheduled(e.target.value);
            }}
          />{' '}
          예약
        </label>{' '}
        <input
          type="datetime-local"
          min={dateFormat(new Date())}
          disabled={tistoryScheduled === '0'}
          value={tistoryPublished}
          onChange={(e) => {
            setTistoryPublished(e.target.value);
          }}
        />
      </SettingItem>
      <SettingItem name="">
        <label htmlFor="tistorySkipModalRadioBox">다음부터 수정할 때 모달창을 열지 않음</label>
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
