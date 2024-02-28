import * as THREE from 'three';

import { Line2 } from 'three/examples/jsm/lines/Line2';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';

const drawLightLine = (tempObj: THREE.Object3D) => {
  // 画光束
  const worldPosition = new THREE.Vector3();
  tempObj.getWorldPosition(worldPosition);
  // 起始点
  //   const startPoint = new THREE.Vector3(worldPosition.x, 0, worldPosition.z);
  const startPoint = [worldPosition.x, 0, worldPosition.z];
  // 终点
  //   const endPoint = new THREE.Vector3(
  //     worldPosition.x,
  //     worldPosition.y + 50,
  //     worldPosition.z,
  //   );
  const endPoint = [worldPosition.x, worldPosition.y + 100, worldPosition.z];
  //   let lineGeometry = new THREE.BufferGeometry().setFromPoints([startPoint, endPoint]);
  let lineGeometry = new LineGeometry();
  lineGeometry.setPositions([...startPoint, ...endPoint]);
  const material = new LineMaterial({
    color: '#FFF973',
    linewidth: 0.005,
  });
  const line = new Line2(lineGeometry, material);
  return line;
};

export default drawLightLine;
