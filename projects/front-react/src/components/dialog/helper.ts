import React, { ComponentClass, FunctionComponent } from 'react';
import { createRoot } from 'react-dom/client';
import { Future } from '@spring4js/concurrent';

interface IRenderParams<OKData, CancelData> {
  onOk: (data: OKData) => void;
  onCancel: (data: CancelData) => void;
  onError: (error: Error) => void;
}

export interface IOpenOptions<OKData, CancelData> {
  render: (param: IRenderParams<OKData, CancelData>) => React.ReactNode;
}

export function openDialog<OKData = any, CancelData = any>(
  options: IOpenOptions<OKData, CancelData>,
): Promise<OKData | CancelData> {
  const future = new Future<OKData | CancelData>();
  const dialogContainerDiv = document.createElement('div');
  document.body.appendChild(dialogContainerDiv);

  const root = createRoot(dialogContainerDiv);

  const destroy = () => {
    try {
      root.unmount();
      document.body.removeChild(dialogContainerDiv);
    } catch (error) {}
  };
  const onOk = (data: OKData) => {
    destroy();
    future.resolve(data);
  };
  const onCancel = (data: CancelData) => {
    destroy();
    future.resolve(data);
  };
  const onError = (error: Error) => {
    destroy();
    future.reject(error);
  };

  root.render(options.render({ onOk, onCancel, onError }));
  return future.get();
}
