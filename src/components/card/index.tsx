import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Flex, Tag, Image, Typography } from 'antd';
import styles from './index.module.less';
import { Build } from '@/config/data';
import food from '@/resources/images/food.svg';
import play from '@/resources/images/shopping.svg';
import dorm from '@/resources/images/dorm.svg';
import pb from '@/resources/images/public.svg';
const { Paragraph, Text } = Typography;
interface Props {
  build?: Build;
  showCard: boolean;
  hideCard: () => void;
  backCamera: () => void;
}

const Card: React.FC<Props> = ({ showCard, build, hideCard, backCamera }) => {
  const cardRef = useRef(null);
  const [ellipsis, setEllipsis] = useState(true);
  // useEffect(() => {
  //   //实现点击 本元素外的元素时，隐藏下拉列表（点击其他地方隐藏下拉列表）
  //   function handleOutsideClick(event) {
  //     if (cardRef.current && !cardRef.current.contains(event.target)) {
  //       hideCard();
  //       backCamera();
  //     }
  //   }
  //   document.addEventListener('click', handleOutsideClick);
  //   return () => {
  //     document.removeEventListener('click', handleOutsideClick);
  //   };
  // }, []);

  return (
    <>
      {showCard && (
        <div className={styles.cardBox}>
          <div
            ref={cardRef}
            className={classNames(styles.infoContainer, 'beauti-scroll-bar')}
          >
            <div className={styles.title}>
              {build?.type == 'food' && <img src={food} alt="" />}
              {build?.type == 'play' && <img src={play} alt="" />}
              {build?.type == 'dorm' && <img src={dorm} alt="" />}
              {!['food', 'play', 'dorm'].includes(build?.type) && <img src={pb} alt="" />}
              {build?.name}
            </div>
            <div className={styles.time}>{build?.info.timeLimit}</div>
            {/* tags */}
            <Flex gap="4px 0" wrap="wrap" style={{ fontSize: '12px' }}>
              {build?.info.tags?.map((item, index) => {
                return (
                  <Tag color="gold" key={index}>
                    {item}
                  </Tag>
                );
              })}
            </Flex>
            {/* info */}
            <div style={{ whiteSpace: 'pre-wrap' }}>
              <Paragraph
                key={ellipsis ? 'expanded' : 'collapsed'}
                ellipsis={
                  ellipsis
                    ? {
                        rows: 5,
                        expandable: true,
                        symbol: '更多',
                        onExpand: () => setEllipsis(!ellipsis),
                      }
                    : false
                }
              >
                {build?.info.brief}
                {!ellipsis && (
                  <span
                    className={styles.closeBrief}
                    onClick={() => setEllipsis(!ellipsis)}
                  >
                    收起
                  </span>
                )}
              </Paragraph>
            </div>

            {/* photo */}
            {build?.info.photo !== 'resa' && (
              <Flex wrap="wrap" gap={2}>
                <Image.PreviewGroup
                  preview={{
                    onChange: (current, prev) => {},
                    // console.log(`current index: ${current}, prev index: ${prev}`),
                  }}
                >
                  {new Array(build?.info.count).fill(0).map((item, index) => {
                    return (
                      <Image
                        key={index}
                        width={'30%'}
                        height={66}
                        src={build?.info.photo + '/img_' + (index + 1) + '.JPG'}
                      />
                    );
                  })}
                </Image.PreviewGroup>
              </Flex>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Card;
