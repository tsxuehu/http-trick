import React from 'react';
import { createRoot } from 'react-dom/client';
import ContextMenuWrapper from './ContextMenuWrapper.tsx';

export interface ShowOptions {
  top: number;
  left: number;
  render: (close: () => void) => React.ReactNode;
}

export function showContextMenu(options: ShowOptions) {
  const { top, left, render } = options;
  const menuContainerDiv = document.createElement('div');
  document.body.appendChild(menuContainerDiv);

  const root = createRoot(menuContainerDiv);

  const destroy = () => {
    try {
      root.unmount();
      document.body.removeChild(menuContainerDiv);
    } catch (error) {}
  };
  root.render(
    React.createElement(ContextMenuWrapper, {
      top,
      left,
      renderContextMenu: render,
      close: destroy,
    }),
  );
}
