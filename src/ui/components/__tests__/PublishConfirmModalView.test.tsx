/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render } from '@testing-library/react';

import PublishConfirm from '~/ui/components/PublishConfirm';
import TistoryPlugin from '~/TistoryPlugin';
import TistoryClient from '~/tistory/TistoryClient';
import { TistoryPublishOptions } from '~/ui/PublishConfirmModal';

describe('<PublishConfirmModalView />', () => {
  const onPublishMock = jest.fn();
  const onCloseMock = jest.fn();
  const pluginMock = {
    tistoryClient: new TistoryClient(''),
  } as any as TistoryPlugin;
  const blogName = 'anpigon';
  const options: TistoryPublishOptions = {
    tistoryBlogName: 'anpigon',
    tistoryVisibility: '0',
    tistoryCategory: undefined,
    tistoryTitle: '',
    tistoryTag: undefined,
    tistoryPostId: undefined,
    tistorySkipModal: false,
  };

  it('should render the confirm modalEl', () => {
    const { container } = render(
      <PublishConfirm
        plugin={pluginMock}
        blogName={blogName}
        options={options}
        onClose={onCloseMock}
        onPublish={onPublishMock}
      />,
    );
    expect(container).toBeInTheDocument();
  });
});
