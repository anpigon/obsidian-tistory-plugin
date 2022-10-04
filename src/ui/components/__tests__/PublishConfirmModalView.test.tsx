/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render } from '@testing-library/react';

import PublishConfirm, { PostOptions } from '~/ui/components/PublishConfirm';
import TistoryPlugin from '~/TistoryPlugin';
import TistoryClient from '~/tistory/TistoryClient';

describe('<PublishConfirmModalView />', () => {
  const onPublishMock = jest.fn();
  const onCloseMock = jest.fn();
  const pluginMock = {
    tistoryClient: new TistoryClient(''),
  } as any as TistoryPlugin;
  const blogName = 'anpigon';
  const options: PostOptions = {};

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