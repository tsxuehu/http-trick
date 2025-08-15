import React from 'react';
import cn from 'classnames';
import './context-menu.less';
import { BodyClickListener } from './body-click-listener.ts';

interface IProps {
  top: number;
  left: number;
  close: () => void;
  renderContextMenu: (close: () => void) => React.ReactNode;
}

interface IState {}

export default class ContextMenuWrapper extends React.PureComponent<IProps, IState> {
  divRef: React.RefObject<HTMLDivElement> = React.createRef();
  bodyClickListener: BodyClickListener | undefined;

  componentDidMount() {
    this.bodyClickListener = new BodyClickListener((event) => {
      const outsideClick = !this.divRef.current?.contains(event.target as Node);
      if (outsideClick) {
        this.props.close();
      }
    });
    this.bodyClickListener.start();
  }

  componentWillUnmount() {
    this.bodyClickListener?.stop();
  }

  render() {
    const { top, left } = this.props;
    return (
      <div
        ref={this.divRef}
        className={cn('ctx-menu-container')}
        style={{
          top: top + 'px',
          left: left + 'px',
        }}
        onClick={(e) => e.stopPropagation()}
        onContextMenu={(e) => e.stopPropagation()}
      >
        {this.props.renderContextMenu(this.props.close)}
      </div>
    );
  }
}
