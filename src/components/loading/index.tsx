import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import '@/style/index.less';

interface Props {
  progress: number;
  moveCamera: () => void;
}

const Loading: React.FC<Props> = ({ progress, moveCamera }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<number>(0);

  useEffect(() => {
    if (progress === 100) {
      setIsLoading(false);
      moveCamera();
    }
  }, [progress]);

  return (
    isLoading && (
      <div className="loading">
        <span className="progress">{progress} %</span>
      </div>
    )
  );
};

export default Loading;
