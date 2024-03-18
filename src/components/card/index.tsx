import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import styles from './index.module.less';
import { Build } from '@/config/data';

interface Props {
  build?: Build;
  showCard: boolean;
  hideCard: () => void;
}

const Card: React.FC<Props> = ({ showCard, build, hideCard }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    //实现点击 本元素外的元素时，隐藏下拉列表（点击其他地方隐藏下拉列表）
    function handleOutsideClick(event) {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        hideCard();
      }
    }
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <>
      {showCard && (
        <div ref={cardRef} className={styles.infoContainer}>
          <h2>{build?.name}</h2>
        </div>
      )}
    </>
  );
};

export default Card;
