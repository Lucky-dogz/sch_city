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
import loadBMap from '@/utils/loadBMap';

interface LL {
  longitude: number;
  latitude: number;
}

const App: React.FC = () => {
  const [loadingProcess, setLoadingProcess] = useState<number>(0);
  const [start, setStart] = useState<Build>();
  const [finish, setFinish] = useState<Build>();
  const [hasFound, setHasFound] = useState<boolean>(false);
  const [controlType, setControlType] = useState<'first' | 'god'>('god');
  const [sceneReady, setSceneReady] = useState<boolean>(false);
  const [location, setLocation] = useState<LL>({
    longitude: 0,
    latitude: 0,
  });
  const [BMapLoaded, setBMapLoaded] = useState<boolean>(false);
  const school = useRef(null);

  // useEffect(() => {
  //   window.initBMap = () => {
  //     setBMapLoaded(true);
  //     //获取当前位置
  //     const BMap = window.BMapGL;
  //     const geolocation = new BMap.Geolocation();
  //     geolocation.getCurrentPosition(
  //       function (r) {
  //         let ggPoint = new BMap.Point(r.longitude, r.latitude);
  //         console.log('r', r);
  //         var convertor = new BMap.Convertor();
  //         convertor.translate([ggPoint], 5, 6, (data) => {
  //           console.log('BD09墨卡托', data);
  //           // setLocation({
  //           //   latitude: data.points[0].lat,
  //           //   longitude: data.points[0].lng,
  //           // });
  //         });

  //         // let mk = new BMap.Marker(r.point);
  //         // getAddress(r.point);
  //       },
  //       {
  //         enableHighAccuracy: true,
  //         maximumAge: 0,
  //       },
  //     );

  //     // 获取地址信息，设置地址label
  //     function getAddress(point) {
  //       var gc = new BMap.Geocoder();
  //       gc.getLocation(point, function (rs) {
  //         var addComp = rs.addressComponents;
  //         var address =
  //           addComp.province +
  //           addComp.city +
  //           addComp.district +
  //           addComp.street +
  //           addComp.streetNumber; //获取地址
  //         console.log(address);
  //       });
  //     }
  //   };
  //   loadBMap();
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
        location={location}
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

// useEffect(() => {
//   navigator.geolocation.getCurrentPosition((position) => {
//     console.log('positon', position);
//     setPosition({
//       latitude: position.coords.latitude,
//       longitude: position.coords.longitude,
//     });
//   });
// }, []);
