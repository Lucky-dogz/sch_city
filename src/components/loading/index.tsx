import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import styles from './index.module.less';

interface Props {
  progress: number;
  initCamera: () => void;
}

const Loading: React.FC<Props> = ({ progress, initCamera }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<number>(0);

  useEffect(() => {
    if (progress === 100) {
      setIsLoading(false);
      initCamera();
    }
  }, [progress]);

  return (
    isLoading && (
      <div className={styles.loading}>
        <span className={styles.progress}>{progress} %</span>
      </div>
    )
  );
};

export default Loading;
