import * as THREE from 'three';

import { Line2 } from 'three/examples/jsm/lines/Line2';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import { load_texture } from './loaders';

// 世界坐标转换成二维坐标
export const vectorToCoord = (x: number, z: number) => {
  let row = z + 470;
  let col = x + 350;
  return {
    row,
    col,
  };
};

// 画点
export const drawPoint = (row: number, col: number, color: any) => {
  const pointGeometry = new THREE.BufferGeometry();
  const vertices = new Float32Array([0, 0, 0]);
  pointGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  const pointMaterial = new THREE.PointsMaterial({ size: 1, color });
  const point = new THREE.Points(pointGeometry, pointMaterial);
  point.position.set(col - 350, 0, row - 470);
  return point;
};

// 画曲线
export const drawLine = () => {
  // for (let item of nodesToAnimate) {
  //   // this.pathPointArr.push(new THREE.Vector3(item.col - 350, 0, item.row - 470));
  //   // this.pathPointArr.push(new THREE.Vector3(item.col + 25, 0, item.row - 95));
  //   drawPoint(item.row, item.col, 0xff0000);
  // }
  // drawPoint(29, 25, 'green');
  // let curve = new THREE.CatmullRomCurve3(this.pathPointArr);
  // // 创建管道
  // let tubeGeometry = new THREE.TubeGeometry(curve, 100, 0.2, 20);
  // let material = new THREE.MeshBasicMaterial({
  //   // map: texture,
  //   color: 'red',
  //   // side: THREE.BackSide,
  //   // transparent: true,
  // });
  // let pathCurveMesh = new THREE.Mesh(tubeGeometry, material);
  // this.scene.add(pathCurveMesh);
};

// 画垂直光线
export const drawLightLine = (tempObj: THREE.Object3D) => {
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

// 流光效果
export const drawStreamingRoadLight = (road: []) => {
  let imgUrl = 'line1';
  let texture;
  // 纹理
  load_texture.load(`line/${imgUrl}.png`, function (tex) {
    texture = tex;
    tex.needsUpdate = true;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 1);
  });
  // 材质
  let material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
    transparent: true,
  });

  let points: THREE.Vector3[] = [];

  road.forEach((item: any) => {
    points.push(new THREE.Vector3(item.col - 350, 0.5, item.row - 470));
  });

  // 曲线
  let curve = new THREE.CatmullRomCurve3(points);
  // 创建管道
  let tubeGeometry = new THREE.TubeGeometry(curve, 100, 0.5, 20);
  let mesh = new THREE.Mesh(tubeGeometry, material);
  return {
    mesh,
    texture,
  };
};

const clearCache = (item) => {
  item.geometry.dispose();
  item.material.dispose();
};

export const removeObj = (obj: any) => {
  // 递归释放物体下的 几何体 和 材质
  if (obj.children.length) {
    let arr = obj.children.filter((x) => x);
    arr.forEach((item) => {
      if (item.children.length) {
        removeObj(item);
      } else {
        clearCache(item);
        item.clear();
      }
    });
    arr = null;
  } else {
    clearCache(obj);
  }
  obj.clear();
  console.log('obj', obj);
};

// initGroundColor = (groundGeometry, texture) => {
//   const indices = []; // 存储网格的索引数据，用于定义三角形
//   const vertices = []; // 存储网格的顶点坐标
//   const normals = []; // 存储网格的法线数据
//   const colors = []; // 存储每个顶点的颜色数据
//   const size = boardConfig.cols * boardConfig.rows;
//   const segments = boardConfig.cols * boardConfig.rows;
//   const halfSize = size / 2;
//   const segmentSize = size / segments;
//   const _color = new THREE.Color();
//   // generate vertices, normals and color data for a simple grid geometry

//   for (let i = 0; i <= segments; i++) {
//     const y = i * segmentSize - halfSize;
//     for (let j = 0; j <= segments; j++) {
//       const x = j * segmentSize - halfSize;
//       vertices.push(x, -y, 0);
//       normals.push(0, 1, 0);
//       if (i < 5 && j < 5) {
//         _color.setRGB(0, 1, 0);
//       } else {
//         _color.setRGB(1, 1, 1);
//       }
//       colors.push(_color.r, _color.g, _color.b);
//     }
//   }
//   for (let i = 0; i < segments; i++) {
//     for (let j = 0; j < segments; j++) {
//       const a = i * (segments + 1) + (j + 1);
//       const b = i * (segments + 1) + j;
//       const c = (i + 1) * (segments + 1) + j;
//       const d = (i + 1) * (segments + 1) + (j + 1);
//       // generate two faces (triangles) per iteration
//       indices.push(a, b, d); // face one
//       indices.push(b, c, d); // face two
//     }
//   }
//   // groundGeometry.setIndex(indices);
//   // groundGeometry.setAttribute(
//   //   'position',
//   //   new THREE.Float32BufferAttribute(vertices, 3),
//   // );
//   // groundGeometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
//   groundGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

//   const material = new THREE.MeshPhongMaterial({
//     map: texture,
//     side: THREE.FrontSide,
//     vertexColors: true,
//   });

//   let mesh = new THREE.Mesh(groundGeometry, material);
//   this.scene.add(mesh);
// };
