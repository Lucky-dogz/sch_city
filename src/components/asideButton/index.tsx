import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './index.module.less';

interface Props {
  btn_value: string;
  btn_icon: string;
  clickSth: () => void;
}

const AsideButton: React.FC<Props> = ({ btn_value, btn_icon, clickSth }) => {
  return (
    <button
      onClick={clickSth}
      className={classNames(styles.btn, styles.hover, styles.warning)}
    >
      <img src={btn_icon} alt="" />
      <span style={{ display: 'inline-block' }}>{btn_value}</span>
    </button>
  );
};

export default AsideButton;
