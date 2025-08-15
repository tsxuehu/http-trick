import React, { ComponentClass, FunctionComponent } from "react";
import { createRoot } from "react-dom/client";
import { Future } from "@spring4js/concurrent";

export interface IBaseProps<IOk=any, ICancel = any> {
  onOk: (data: IOk) => void;
  onCancel: (data: ICancel) => void;
  onError: (error: Error) => void;
}

export function openDialog<IProps extends IBaseProps<IResult>, IResult = any>(dialog: FunctionComponent<IProps> | ComponentClass<IProps>, props: Omit<IProps, keyof IBaseProps>): Promise<IResult> {
  const future = new Future<IResult>();
  const dialogContainerDiv = document.createElement("div");
  document.body.appendChild(dialogContainerDiv);

  const root = createRoot(dialogContainerDiv);

  const destroy = () => {
    try {
      root.unmount();
      document.body.removeChild(dialogContainerDiv);
    } catch (error) {
    }
  };

  const dialogProps: IProps = {
    ...props,
    onOk: (data: any) => {
      destroy();
      future.resolve(data as IResult);
    },
    onCancel: (data: any) => {
      destroy();
      future.resolve(data as IResult);
    },
    onError: (error: Error) => {
      destroy();
      future.reject(error);
    }
  } as IProps;

  root.render(
    React.createElement(dialog, dialogProps)
  );
  return future.get();
}
