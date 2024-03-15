import './App.css';
import React, { useEffect, useRef, useState } from 'react';
import SchoolCanvas from '@/components/schoolCanvas';
import OperateBorad from './components/operateBorad';
import { Build } from './config/data';

const App: React.FC = () => {
  const [loadingProcess, setLoadingProcess] = useState<number>(0);
  const [start, setStart] = useState<Build>();
  const [finish, setFinish] = useState<Build>();
  const [hasFinded, setHasFinded] = useState<boolean>(false);
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

  const findPath = () => {
    if (start && finish && start.name !== finish.name) {
      hasFinded && school.current.resetNavigation();
      school.current.startFindPath(start, finish);
      setHasFinded(true);
    }
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
    </div>
  );
};

export default App;
