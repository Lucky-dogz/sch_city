import * as THREE from 'three';

import { Line2 } from 'three/examples/jsm/lines/Line2';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import { load_texture } from './loaders';
// import line from '@/resources/textures/line/line1.png';
import { smoothPath, smoothPathWithBezier } from '@/findPath/helper';
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
  const pointMaterial = new THREE.PointsMaterial({ size: 20, color });
  const point = new THREE.Points(pointGeometry, pointMaterial);
  point.position.set(col - 350, 1, row - 470);
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
export const drawStreamingRoadLight1 = (road: []) => {
  // let imgUrl = 'line1';
  let texture;
  // 纹理
  load_texture.load(line, function (tex) {
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

export const drawStreamingRoadLight = (road: any[]) => {
  const positions = [];
  let texture;
  const colors = [];
  let points = [];

  road.forEach((item: any) => {
    points.push({
      x: item.col - 350,
      z: item.row - 470,
    });
    // points.push(new THREE.Vector3(item.col - 350, 1, item.row - 470));
  });
  points = smoothPath(points);
  points.forEach((item: any) => {
    positions.push(item.x, 0.5, item.z);
    colors.push(1, 1, 0);
  });
  const geometry = new LineGeometry();
  geometry.setPositions(positions);
  geometry.setColors(colors);

  let matLine = new LineMaterial({
    color: 0xffffff,
    linewidth: 1, // in world units with size attenuation, pixels otherwise
    vertexColors: true,
    worldUnits: true,
    alphaToCoverage: true,
  });

  let mesh = new Line2(geometry, matLine);
  // mesh.computeLineDistances();
  mesh.scale.set(1, 1, 1);

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
};

export function drawCircle() {
  let vertexShader = `
      varying vec2 vUv;
      void main() {
          vUv = uv;
          vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * modelViewPosition;
      } `;
  let fragmentShader = `
      varying vec2 vUv;
      uniform float time;
      void main() {
          float distance = length(vUv - 0.5);
          float wave = sin(distance * 40.0 + time * 2.0);
          vec3 color = vec3(0.5, 0.7, 0.9); // 淡蓝色
          gl_FragColor = vec4(color, 0.6 - wave);
      }`;

  // 创建着色器材质
  var material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0.0 },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
  });

  // 创建几何体
  var geometry = new THREE.CircleGeometry(75, 64); // 半径为 5 的圆形，分段数为 64

  // 创建网格对象
  var circle = new THREE.Mesh(geometry, material);

  // 创建网格对象
  var circle = new THREE.Mesh(geometry, material);
  circle.position.set(658 - 350, 2, 158 - 470);
  circle.rotateX(Math.PI / 2);
  return {
    circle,
    material,
  };
}

export function drawCircle2() {
  // 创建圆圈的几何体
  var geometry = new THREE.CircleGeometry(50, 64); // 参数分别为：半径，分段数
  // 创建材质
  var material = new THREE.MeshBasicMaterial({
    color: 0x00ffff, // 透明淡蓝色
    transparent: true,
    opacity: 0.6, // 设置透明度
    side: THREE.DoubleSide,
  });
  // // 创建网格对象
  var circle = new THREE.Mesh(geometry, material);
  // // 将网格对象添加到场景中
  circle.position.set(658 - 350, 2, 158 - 470);
  circle.rotateX(Math.PI / 2);
  return circle;
}
