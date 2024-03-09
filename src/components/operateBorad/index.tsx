import React, { useEffect, useState } from 'react';
import { Input, Select, Button } from 'antd';
import classNames from 'classnames';
import styles from './index.module.less';
import { Build, search_build } from '@/config/data';

interface Props {
  start: Build | undefined;
  finish: Build | undefined;
  changeStart: (node: Build) => void;
  changeFinish: (node: Build) => void;
  findPath: () => void;
}

const OperateBorad: React.FC<Props> = ({
  start,
  finish,
  changeStart,
  changeFinish,
  findPath,
}) => {
  const [startOptions, setStartOptions] = useState<Build[]>([]);
  const [finishOptions, setFinishOptions] = useState<Build[]>([]);

  // 模糊搜索
  const handleSearch = (type: 0 | 1, value: string) => {
    let kw = value.trim();
    if (!kw) return;
    const res = search_build(kw);
    if (type === 0) {
      setStartOptions(res);
    } else {
      setFinishOptions(res);
    }
  };

  // 选中
  const handleSelect = (type: 0 | 1, label: string) => {
    let node;
    if (type === 0) {
      startOptions.forEach((item) => {
        if (label === item.name) {
          node = item;
        }
      });
      changeStart(node!);
    } else {
      finishOptions.forEach((item) => {
        if (label === item.name) {
          node = item;
        }
      });
      changeFinish(node!);
    }
  };

  return (
    <div className={styles.routebox}>
      <div className={styles.routeboxInputs}>
        {/* 起点 */}
        <Select
          className={styles.startSelect}
          style={{ width: 200 }}
          showSearch
          value={start && start.name}
          placeholder="输入并选择起点"
          defaultActiveFirstOption={true}
          suffixIcon={null}
          onSearch={(value) => handleSearch(0, value)}
          onSelect={(label) => {
            handleSelect(0, label);
          }}
          notFoundContent={null}
          options={(startOptions || []).map((d) => ({
            value: d.name,
            label: d.name,
          }))}
        />
        <span className={styles.divideLine}>—</span>
        {/* 终点 */}
        <Select
          className={styles.finishSelect}
          style={{ width: 200 }}
          showSearch
          value={finish && finish.name}
          placeholder="输入并选择终点"
          defaultActiveFirstOption={true}
          suffixIcon={null}
          onSearch={(value) => handleSearch(1, value)}
          onSelect={(label) => {
            handleSelect(1, label);
          }}
          notFoundContent={null}
          options={(finishOptions || []).map((d) => ({
            value: d.name,
            label: d.name,
          }))}
        />
        <Button
          className={styles.findPathBtn}
          onClick={findPath}
          size="middle"
          type="primary"
        >
          开始寻路
        </Button>
      </div>
    </div>
  );
};

export default OperateBorad;
