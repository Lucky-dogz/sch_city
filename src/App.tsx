import './App.less';
import React, { useEffect, useRef, useState } from 'react';
import SchoolCanvas from '@/components/schoolCanvas';
import OperateBorad from './components/operateBorad';
import { Build } from './config/data';
import AsideButton from '@/components/asideButton';
import { CSSTransition } from 'react-transition-group';
import icon_first from '@/resources/images/first.svg';
import icon_resetCamera from '@/resources/images/reset.svg';
import icon_god from '@/resources/images/god.svg';

const App: React.FC = () => {
  const [loadingProcess, setLoadingProcess] = useState<number>(0);
  const [start, setStart] = useState<Build>();
  const [finish, setFinish] = useState<Build>();
  const [hasFound, setHasFound] = useState<boolean>(false);
  const [controlType, setControlType] = useState<'first' | 'god'>('god');
  const [sceneReady, setSceneReady] = useState<boolean>(false);
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
    hasFound && school.current.resetNavigation();
    school.current.startFindPath(start, finish);
    setHasFound(true);
  };

  // 切换视角
  const handlelChangeControl = () => {
    if (controlType === 'first') {
      // 设置为上帝视角
      setControlType('god');
      school.current.setControls('god');
    } else {
      setControlType('first');
      // 设置为第一人称视角
      school.current.setControls('first');
    }
  };

  // 重置镜头
  const handlelResetCamera = () => {
    school.current.initCamera(1500);
  };

  return (
    <div className="SCNU">
      {/* 学校展示 */}
      <SchoolCanvas
        ref={school}
        controlType={controlType}
        sceneReady={sceneReady}
        setSceneReady={setSceneReady}
      />
      <CSSTransition
        in={sceneReady}
        timeout={800}
        classNames={{
          enter: 'alert-enter',
          enterActive: 'alert-enter-active',
        }}
        unmountOnExit
      >
        <>
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
            {controlType === 'god' && (
              <AsideButton
                clickSth={handlelResetCamera}
                btn_value={'重置镜头'}
                btn_icon={icon_resetCamera}
              />
            )}
          </div>
        </>
      </CSSTransition>
    </div>
  );
};

export default App;
