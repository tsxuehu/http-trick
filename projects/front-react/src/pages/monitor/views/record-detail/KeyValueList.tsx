import React from 'react';
import './key-value-list.less';
interface IProps {
  keyValueObj: any;
}

export const KeyValueList: React.FC<IProps> = (props) => {
  const { keyValueObj } = props;
  return (
    <div className="keyvalue-wrapper">
      {Object.entries(keyValueObj).map(([key, value]) => (
        <div className="row" key={key}>
          <div className="name">{key}</div>
          <div className="value">{value}</div>
        </div>
      ))}
    </div>
  );
};
