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
import loadAMap from '@/utils/loadAMap';

interface LL {
  longitude: number;
  latitude: number;
}

const App: React.FC = () => {
  const [start, setStart] = useState<Build>();
  const [finish, setFinish] = useState<Build>();
  const [controlType, setControlType] = useState<'first' | 'god'>('god');
  const [sceneReady, setSceneReady] = useState<boolean>(false);
  const [location, setLocation] = useState<LL>({
    longitude: 0,
    latitude: 0,
  });
  const [tagsShow, setTagsShow] = useState<boolean>(true);
  const [BMapLoaded, setBMapLoaded] = useState<boolean>(false);
  const [distance, setDistance] = useState<number>();
  const school = useRef(null);
  // useEffect(() => {
  //   window.initAMap = () => {
  //     AMap.plugin('AMap.Geolocation', function () {
  //       var geolocation = new AMap.Geolocation({
  //         enableHighAccuracy: true, // 是否使用高精度定位，默认：true
  //         // timeout: 10000, // 设置定位超时时间，默认：无穷大
  //         // offset: [10, 20],  // 定位按钮的停靠位置的偏移量
  //         // zoomToAccuracy: true,  //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
  //         // position: 'RB' //  定位按钮的排放位置,  RB表示右下
  //       });

  //       geolocation.getCurrentPosition(function (status, result) {
  //         if (status == 'complete') {
  //           onComplete(result);
  //         } else {
  //           onError(result);
  //         }
  //       });

  //       function onComplete(data) {
  //         // data是具体的定位信息
  //         console.log('success', data);
  //         // setLocation({
  //         // latitude: data.position.latitude,
  //         // longitude: r.longitude,
  //         // )}
  //       }

  //       function onError(data) {
  //         // 定位出错
  //         console.log('error', data);
  //       }
  //     });
  //   };
  //   loadAMap();
  // }, []);

  const findPath = () => {
    school.current.resetNavigation();
    let len = school.current.startFindPath(start, finish);
    if (len) {
      setDistance(len);
    }
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

  // 标签开关
  const switchTagsShow = (checked: boolean) => {
    setTagsShow(checked);
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
        tagsShow={tagsShow}
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
            switchTagsShow={switchTagsShow}
            distance={distance}
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
          {/* copyright */}
          <a
            className="github"
            href="https://github.com/Lucky-dogz/sch_city"
            target="_blank"
            rel="noreferrer"
          >
            <svg
              height="36"
              aria-hidden="true"
              viewBox="0 0 16 16"
              version="1.1"
              width="36"
              data-view-component="true"
            >
              <path
                fill="#FFFFFF"
                fillRule="evenodd"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
              ></path>
            </svg>
            <span className="author">@Lucky-dogz</span>
          </a>
        </>
      </CSSTransition>
    </div>
  );
};

export default App;

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
//         // setLocation({
//         //   latitude: r.latitude,
//         //   longitude: r.longitude,
//         // });
//         var convertor = new BMap.Convertor();
//         convertor.translate([ggPoint], 5, 6, (data) => {
//           console.log('BD09墨卡托', data);
//           setLocation({
//             latitude: data.points[0].lat,
//             longitude: data.points[0].lng,
//           });
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

// useEffect(() => {
//   console.log('start', start);
// }, [start?.name]);

// useEffect(() => {
//   console.log('finish', finish);
// }, [finish?.name]);

// 开始寻路

// useEffect(() => {
//   navigator.geolocation.getCurrentPosition((position) => {
//     console.log('positon', position);
//     // setPosition({
//     //   latitude: position.coords.latitude,
//     //   longitude: position.coords.longitude,
//     // });
//   });
// }, []);
