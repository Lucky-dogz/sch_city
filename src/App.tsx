import './App.less';
import React, { useEffect, useRef, useState } from 'react';
import SchoolCanvas from '@/components/schoolCanvas';
import OperateBorad from './components/operateBorad';
import { Build } from './config/data';
import AsideButton from '@/components/asideButton';
import icon_first from '@/resources/images/first.svg';
import icon_resetCamera from '@/resources/images/reset.svg';
import icon_god from '@/resources/images/god.svg';
const App: React.FC = () => {
  const [loadingProcess, setLoadingProcess] = useState<number>(0);
  const [start, setStart] = useState<Build>();
  const [finish, setFinish] = useState<Build>();
  const [hasFinded, setHasFinded] = useState<boolean>(false);
  const [controlType, setControlType] = useState<'first' | 'god'>('god');
  // const [currentGeo,setCurrentGeo] = useState({
  //   latitude:,
  //   longitude:
  // })
  const school = useRef(null);

  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     console.log('positon', position);
  //     // setPosition({
  //     //   latitude: position.coords.latitude,
  //     //   longitude: position.coords.longitude,
  //     // });
  //   });
  // }, []);

  useEffect(() => {
    console.log('start', start);
  }, [start?.name]);

  useEffect(() => {
    console.log('finish', finish);
  }, [finish?.name]);

  // 开始寻路
  const findPath = () => {
    if (start && finish && start.name !== finish.name) {
      hasFinded && school.current.resetNavigation();
      school.current.startFindPath(start, finish);
      setHasFinded(true);
    }
  };

  // 切换视角
  const handlelChangeControl = () => {
    if (controlType === 'first') {
      setControlType('god');
    } else {
      setControlType('first');
    }
  };

  const handlelResetCamera = () => {
    school.current.initCamera(1500);
  };

  return (
    <div className="SCNU">
      {/* 学校展示 */}
      <SchoolCanvas ref={school} />
      {/* 操作面板 */}
      <OperateBorad
        start={start}
        finish={finish}
        changeStart={setStart}
        changeFinish={setFinish}
        findPath={findPath}
      />
      {/* 侧边按钮栏 */}
      <div className="asideBtns">
        <AsideButton
          clickSth={handlelChangeControl}
          btn_value={controlType === 'first' ? '上帝视角' : '第一人称'}
          btn_icon={controlType === 'first' ? icon_god : icon_first}
        />
        <AsideButton
          clickSth={handlelResetCamera}
          btn_value={'重置镜头'}
          btn_icon={icon_resetCamera}
        />
      </div>
    </div>
  );
};

export default App;
