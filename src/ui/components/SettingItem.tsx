import React, { PropsWithChildren, ReactNode } from 'react';

type Props = PropsWithChildren<{
  name: string;
  description?: ReactNode;
  errorMessage?: ReactNode;
}>;

const SettingItem: React.FC<Props> = ({ name, description, errorMessage: error, children }) => {
  return (
    <div className="setting-item">
      <div className="setting-item-info">
        <div className="setting-item-name">{name}</div>
        {description && <div className="setting-item-description">{description}</div>}
        {error && <div className="setting-item-description mod-warning">{error}</div>}
      </div>
      <div className="setting-item-control">{children}</div>
    </div>
  );
};

export default SettingItem;
