import React, { useEffect, useState } from 'react';
import { Input, Select, Button } from 'antd';
import classNames from 'classnames';
import styles from './index.module.less';
import { Build, search_build } from '@/config/data';
import loadBMap from '@/utils/loadBMap';

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
  const [positon, setPosition] = useState({});
  // const [BMapLoaded, setBMapLoaded] = useState<boolean>(false);

  // useEffect(() => {
  //   window.initBMap = () => {
  //     setBMapLoaded(true);
  //     //获取当前位置
  //     const BMap = window.BMapGL;
  //     console.log('BMap', BMap);
  //     const geolocation = new BMap.Geolocation();
  //     geolocation.getCurrentPosition(
  //       function (r) {
  //         console.log('r', r);
  //         setPosition({
  //           latitude: r.latitude,
  //           longitude: r.longitude,
  //         });
  //         // let mk = new BMap.Marker(r.point);
  //         // getAddress(r.point);
  //       },
  //       {
  //         enableHighAccuracy: true,
  //         maximumAge: 0,
  //       },
  //     );
  //     //获取地址信息，设置地址label
  //     // function getAddress(point) {
  //     //   var gc = new BMap.Geocoder();
  //     //   gc.getLocation(point, function (rs) {
  //     //     var addComp = rs.addressComponents;
  //     //     var address =
  //     //       addComp.province +
  //     //       addComp.city +
  //     //       addComp.district +
  //     //       addComp.street +
  //     //       addComp.streetNumber; //获取地址
  //     //     console.log(address);
  //     //   });
  //     // }
  //   };
  //   loadBMap();
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     console.log('positon', position);
  //   });
  // }, []);

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
    <>
      {/* 顶部操作栏 */}
      <div className={styles.routeBox}>
        <div className={styles.routeboxInputs}>
          {/* <div>
          当前经纬度：{positon.latitude} {positon.longitude}
        </div> */}
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
    </>
  );
};

export default OperateBorad;
