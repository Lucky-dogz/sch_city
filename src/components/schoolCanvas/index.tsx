import './index.less';
import React from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { gui } from '../common/gui';
import { Sky } from 'three/examples/jsm/objects/Sky';
import Stats from 'stats.js';
import { initLoaders, load_gltf, load_texture } from '@/utils/loaders';
import Animations from '@/utils/animations';
import Tween from 'three/examples/jsm/libs/tween.module.js';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { Build, buildNameMap, build_data } from '@/config/data';
import classnames from 'classnames';
import locIcon from '@/resources/images/loc-icon.svg';
import { getDistanceFromPath, getNodesInShortestPathOrder } from '@/findPath/helper';
import { astar } from '@/findPath/astar';
import _ from 'lodash';
import Loading from '@/components/loading';
import { roadPoint } from '@/config/grid';
import { drawCircle, drawStreamingRoadLight, removeObj } from '@/utils';
import school from '@/resources/models/school.glb';
import ground from '@/resources/textures/ground.png';
import {
  removeResizeListener,
  resizeEventListener,
  sizes,
  boardConfig,
} from '@/config/resize';
import {
  getPlayerPos,
  getPointerControl,
  initCollidableObjects,
  initPlayer,
  setPlayerPos,
  updatePlayer,
} from '../player_one';
import TWEEN from 'three/examples/jsm/libs/tween.module.js';
import Card from '../card';
import { llToCoord, llToCoord2 } from '@/utils/lngLatToXY';

interface props {
  loadingProcess: number;
  controlType: 'first' | 'god';
}

class SchoolCanvas extends React.Component {
  renderer: null;
  scene: null;
  camera: null;
  targetLine: null; // 目前选中建筑物提示光束
  schoolBuildMeshList: THREE.Object3D[]; // 建筑合集
  container: React.RefObject<unknown>;
  orbitControls: null;
  controls: null;
  grid: any[][];
  ground: THREE.Mesh;
  roadstreamingLine: THREE.Mesh | undefined;
  road: THREE.Object3D<THREE.Object3DEventMap>;
  redPoint: { row: number; col: number };
  redPointMesh: any;
  stats: Stats;
  Pointer: THREE.Vector2;
  HOVERED: any;
  circleMaterial: THREE.ShaderMaterial;
  cloudsArr: THREE.Object3D[];

  constructor(props) {
    super(props);
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.orbitControls = null;
    this.controls = null;
    this.targetLine = null;
    this.schoolBuildMeshList = [];
    this.container = React.createRef();
    this.grid = Array.from(
      { length: boardConfig.rows },
      () => new Array(boardConfig.cols),
    );
    this.redPoint = { row: 400, col: 400 };
    this.redPointMesh = null;
    this.cloudsArr = [];
    // 监视器
    // this.stats = new Stats();
    // this.stats.showPanel(0);
    // this.stats.dom.style.inset = '';
    // this.stats.dom.style.right = '10px';
    // this.stats.dom.style.top = '10px';
    // document.body.appendChild(this.stats.dom);
    this.Pointer = new THREE.Vector2();
    this.HOVERED = null;
  }

  state = {
    loadingProcess: 0,
    dataInitProgress: 0,
    guidePointList: [],
    showCard: false,
    currentCardValue: undefined,
  };

  componentDidMount() {
    this.initThree();
  }

  componentWillUnmount() {
    removeResizeListener();
    this.clearScene();
    this.setState = () => {
      return;
    };
  }
  clearScene = () => {
    this.scene.traverse((child) => {
      if (child.material) {
        child.material.dispose();
      }
      if (child.geometry) {
        child.geometry.dispose();
      }
      child = null;
    });

    // 场景中的参数释放清理或者置空等
    // this.renderer.forceContextLoss();
    this.renderer.dispose();
    this.scene.clear();
    this.scene = null;
    this.camera = null;
    this.controls = null;
    this.renderer.domElement = null;
    this.renderer = null;
  };

  initThree = () => {
    this.initBaseScene();
    this.initLight();
    this.addAmbient();
    resizeEventListener(this.camera, this.renderer);

    // this.redPointMesh = drawPoint(400, 400, 'red');
    // this.scene.add(this.redPointMesh);
    // gui
    //   .add(this.redPoint, 'row', 0, 799, 1)
    //   .name('row')
    //   .onChange((value) => {
    //     this.redPointMesh.position.set(this.redPoint.col - 350, 1, value - 470);
    //   });

    // gui
    //   .add(this.redPoint, 'col', 0, 799, 1)
    //   .name('col')
    //   .onChange((value) => {
    //     this.redPointMesh.position.set(value - 350, 1, this.redPoint.row - 470);
    //   });

    // 进度条加载器
    const manager = new THREE.LoadingManager(
      () => {
        console.log('资源加载完毕！');
        // const authorMesh = createText();
        // authorMesh.position.set(200, 0, 150);
        // this.scene.add(authorMesh);
      },
      (url, loaded, total) => {
        console.log('资源加载中：', Math.floor((loaded / total) * 100));
        this.setState({ loadingProcess: Math.floor((loaded / total) * 100) });
      },
    );

    // 初始化加载器
    initLoaders(manager);
    // 加载地图
    this.loadMap();
    // 加载作者文字
    // loadFont();
    this.initGrid();
    // 添加鼠标悬浮事件
    this.addPointerHover();

    const c = drawCircle();
    this.circleMaterial = c.material;
    // this.scene.add(c.circle);
    // this.loadPlain();
    // setTimeout(() => {
    //   this.initGrid();
    //   // this.startFindPath();
    //   let res = [];
    //   for (let i = 0; i < this.grid.length; i++) {
    //     for (let j = 0; j < this.grid[0].length; j++) {
    //       let obj = this.grid[i][j];
    //       if (obj.status === 'default') {
    //         res.push({
    //           row: obj.row,
    //           col: obj.col,
    //         });
    //       }
    //     }
    //   }
    //   console.log('res', res);
    // }, 2000);
    // 测试fps用
    // let t = 0;
    // let count = 0;
    // let flag = true;
    const clock = new THREE.Clock();
    const animate = () => {
      let delta = clock.getDelta();
      // if (t <= 120) {
      //   count++;
      //   t += delta;
      // } else {
      //   if (flag) {
      //     console.log('fps：', t / count);
      //     flag = false;
      //   }
      // }
      requestAnimationFrame(animate);
      this.stats && this.stats.update();
      const timer = Date.now() * 0.002;
      Tween && Tween.update();

      if (this.props.controlType == 'first' && this.controls.isLocked === true) {
        updatePlayer(delta);
      }
      if (this.props.location.latitude) {
        let coor = llToCoord([
          this.props.location.longitude,
          this.props.location.latitude,
        ]);
        c.circle.position.set(coor.col - 350, 1, coor.row - 470);
        this.circleMaterial && (this.circleMaterial.uniforms.time.value -= 0.06);
      }
      if (this.props.sceneReady) {
        // 不断检查交互点
        this.checkPointShow();
        if (this.props.controlType == 'god') {
          // this.checkBuildHover();
          this.camera && (this.camera.position.y += Math.sin(timer) * 0.09);
        }
      } else {
        if (this.camera.position.y < 1250 && this.camera.position.y > 500) {
          this.cloudsArr.forEach((item, index) => {
            if (item.name.includes('Cloudr')) {
              item.position.x -= delta * item.userData.x;
              item.position.z += delta * item.userData.z;
            } else {
              item.position.x += delta * item.userData.x;
              item.position.z -= delta * item.userData.z;
            }
          });
        }
      }
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  };

  // 设置视角
  setControls = (type: 'god' | 'first') => {
    if (type === 'first') {
      console.log('first');
      this.camera.near = 1;
      this.camera.fov = 55;
      this.camera.far = 900;
      this.camera.updateProjectionMatrix();
      this.controls.enabled = false;
      this.controls = getPointerControl();
      let pos = getPlayerPos();
      new TWEEN.Tween(this.camera.position)
        .to(pos, 2000)
        .easing(TWEEN.Easing.Exponential.Out)
        .start();
      new TWEEN.Tween(this.camera.rotation)
        .to({ x: 0, y: (5 * Math.PI) / 4, z: 0 }, 2000)
        .easing(TWEEN.Easing.Exponential.Out)
        .start();
    } else {
      console.log('god');
      setPlayerPos();
      this.camera.near = 10;
      this.camera.fov = 75;
      this.camera.far = 2000;
      this.camera.updateProjectionMatrix();
      this.controls = this.orbitControls;
      this.controls.enabled = true;
      setTimeout(() => {
        this.initCamera(1500);
      }, 200);
    }
  };

  // 初始化基本场景
  initBaseScene = () => {
    // 渲染器
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('canvas.webgl'),
      antialias: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(sizes.width, sizes.height);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // 场景
    this.scene = new THREE.Scene();
    // 相机
    this.camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 10, 2000);
    this.camera.position.set(120, 1280, 120);
    // 轨道
    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbitControls.target.set(0, 0, 0);
    this.orbitControls.enableDamping = true;
    this.orbitControls.enablePan = false; // 禁止平移
    this.orbitControls.maxPolarAngle = 1.5;
    this.orbitControls.minDistance = 100;
    this.orbitControls.maxDistance = 2000;
    this.controls = this.orbitControls;
    // 初始化鼠标控制器（第一人称）
    initPlayer(this.scene, this.camera, this.renderer);
    // 添加坐标系
    // const axesHelper = new THREE.AxesHelper(500);
    // this.scene.add(axesHelper);
  };

  // 初始化灯光
  initLight = () => {
    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    this.scene.add(ambientLight);
    // 平行光
    const directLight = new THREE.DirectionalLight(0xffffff, 4);
    directLight.position.set(10, 0, 200);
    this.scene.add(directLight);

    // 加载gui
    // this.initGUI({ ambientLight, directLight });
  };

  // 增加环境
  addAmbient = () => {
    // 天空
    const sky = new Sky();
    sky.scale.setScalar(10000);
    this.scene.add(sky);
    const skyUniforms = sky.material.uniforms;
    skyUniforms['turbidity'].value = 10; // 云雾度
    skyUniforms['rayleigh'].value = 3;
    skyUniforms['mieCoefficient'].value = 0.005;
    skyUniforms['mieDirectionalG'].value = 0.08;

    // 太阳
    const sun = new THREE.Vector3();
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    const phi = THREE.MathUtils.degToRad(89); // 仰角
    const theta = THREE.MathUtils.degToRad(200); // 方位角
    sun.setFromSphericalCoords(1, phi, theta);

    sky.material.uniforms['sunPosition'].value.copy(sun);
    this.scene.environment = pmremGenerator.fromScene(sky).texture;

    // gui
    //   .add({ color: 2 }, 'color', 0, 360)
    //   .name('phi')
    //   .onChange((value) => {
    //     let phi = THREE.MathUtils.degToRad(value); // 仰角
    //     sun.setFromSphericalCoords(1, phi, theta);
    //     sky.material.uniforms['sunPosition'].value.copy(sun);
    //   });
    // gui
    //   .add({ color: 2 }, 'color', 0, 360)
    //   .name('theta')
    //   .onChange((value) => {
    //     let theta = THREE.MathUtils.degToRad(value); // 方位角
    //     sun.setFromSphericalCoords(1, phi, theta);
    //     sky.material.uniforms['sunPosition'].value.copy(sun);
    //   });
  };

  // 初始化网格
  initGrid = () => {
    // 创建一个 Raycaster 对象
    // let raycaster = new THREE.Raycaster();
    // // 垂直向下向量
    // let direction = new THREE.Vector3(0, -1, 0);
    // let count = 0;
    for (let i = 0; i < roadPoint.length; i++) {
      let row = roadPoint[i].row;
      let col = roadPoint[i].col;
      this.grid[row][col] = this.createNode(row, col, 'default');
    }
    for (let i = 0; i < boardConfig.rows; i++) {
      for (let j = 0; j < boardConfig.cols; j++) {
        if (!this.grid[i][j]) {
          this.grid[i][j] = this.createNode(i, j, 'wall');
          // this.grid[i][j] = this.createNode(i, j, raycaster, direction);
          // count++;
        }
      }
    }
    // this.setState({
    //   dataInitProgress: Math.floor((count / (boardConfig.cols * boardConfig.rows)) * 100),
    // });
  };

  // 创建节点
  createNode = (
    row: number,
    col: number,
    status: string,
    // raycaster?: THREE.Raycaster,
    // direction?: THREE.Vector3 | undefined,
  ) => {
    // let status = 'default';
    // let res = this.initWall({ row, col }, raycaster, direction);
    // if (res === 'wall') {
    //   status = res;
    // }
    let node = {
      id: row * boardConfig.cols + col,
      row,
      col,
      status,
      distance: Infinity,
      totalDistance: Infinity,
      heuristicDistance: null,
      direction: null,
      weight: 0,
      previousNode: null,
    };
    return node;
  };

  resetNavigation = () => {
    if (!this.roadstreamingLine) return;
    // 重置节点
    for (let i = 0; i < roadPoint.length; i++) {
      let row = roadPoint[i].row;
      let col = roadPoint[i].col;
      Object.assign(this.grid[row][col], {
        status: 'default',
        distance: Infinity,
        totalDistance: Infinity,
        heuristicDistance: null,
        direction: null,
        weight: 0,
        previousNode: null,
      });
    }
    //  清除流光线路
    console.log('清理线路');
    this.scene.remove(this.roadstreamingLine);
    this.roadstreamingLine = null;
  };

  // 初始化墙
  initWall = (
    { row, col }: { row: number; col: number },
    raycaster: THREE.Raycaster,
    direction: THREE.Vector3 | undefined,
  ) => {
    let point = new THREE.Vector3(col - 350, 1, row - 470);
    let ray = new THREE.Ray(point, direction);
    // 使用射线检测与所有建筑物的相交
    raycaster.set(ray.origin, ray.direction);
    let intersects = raycaster.intersectObject(this.road);
    if (intersects.length && intersects[0].object.name === '道路') {
      return null;
    }
    return 'wall';
  };

  // 加载平面
  loadPlain = () => {
    // Ground
    let gridWidth = boardConfig.cols * boardConfig.nodeDimensions.width,
      gridHeight = boardConfig.rows * boardConfig.nodeDimensions.height;
    let groundGeometry = new THREE.PlaneGeometry(
      gridWidth,
      gridHeight,
      gridWidth,
      gridHeight,
    );
    groundGeometry.rotateX(-Math.PI / 2);
    load_texture.load(
      ground,
      (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.x = boardConfig.rows;
        texture.repeat.y = boardConfig.cols;
        var groundMaterial = new THREE.MeshLambertMaterial({
          map: texture,
          side: THREE.FrontSide,
          vertexColors: false,
        });
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.position.y = 0.3;
        // this.scene.add(this.ground);
        this.ground.position.set(50, 0, -70);
        // Grid helper
        var size = boardConfig.cols * boardConfig.nodeDimensions.height;
        var divisions = boardConfig.cols;
        var gridHelper = new THREE.GridHelper(size, divisions, 0x5c78bd, 0x5c78bd);
        gridHelper.position.set(
          this.ground.position.x,
          this.ground.position.y + 1,
          this.ground.position.z,
        );
        this.scene.add(gridHelper);
      },
      undefined,
      function (error) {
        console.log(error);
      },
    );
  };

  // 校园地图加载
  loadMap = () => {
    load_gltf.load(school, (gltf: GLTF) => {
      // console.log('校园地图加载完毕：', gltf);
      const school_map = gltf.scene;
      school_map.position.set(0, 0, 0);
      school_map.rotateY(Math.PI);
      this.scene.add(school_map);
      school_map.traverse((obj) => {
        if (obj.name === '道路') {
          this.road = obj;
        }
        if (buildNameMap.has(obj.name)) {
          // obj.castShadow = true;
          this.schoolBuildMeshList.push(obj);
          this.initGuidePoint(obj);
        }
        if (obj.name.includes('Cloud')) {
          this.cloudsArr.push(obj);
        }
        if (obj.name.includes('山')) {
          this.schoolBuildMeshList.push(obj);
          obj.material = new THREE.MeshLambertMaterial({
            color: '#5C9034',
          });
        }
      });
    });
  };

  // 开始寻路
  startFindPath = (start: Build, finish: Build) => {
    console.log('开始寻路～');
    const startNode = this.grid[start.coordinate.row][start.coordinate.col];
    const finishNode = this.grid[finish.coordinate.row][finish.coordinate.col];
    let nodesToAnimate: any = [];
    let find_result;
    // 查找
    find_result = astar(this.grid, startNode, finishNode, nodesToAnimate);
    console.log('find_result:', find_result);
    if (find_result == false) {
      console.log('没找到路径');
      return null;
    }
    // 最短距离节点集合
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    let length = getDistanceFromPath(nodesInShortestPathOrder);
    this.animatePath(nodesInShortestPathOrder);
    return length;
  };

  // 画出最短路径
  animatePath = (nodesInShortestPathOrder: any[]) => {
    const { mesh } = drawStreamingRoadLight(nodesInShortestPathOrder);
    this.roadstreamingLine = mesh;
    this.scene.add(this.roadstreamingLine);
  };

  // 检查建筑物的名字是否展示
  checkPointShow = () => {
    let raycaster = new THREE.Raycaster();
    // 遍历每个交互点
    for (const point of this.state.guidePointList) {
      // 注册元素
      if (!point.element) {
        let element = document.querySelector('.build_' + point.id);
        point.element = element;
        // 添加元素点击事件
        this.addPointClickSelect('.build_' + point.id, point.position, point);
      }
      // 获取2D屏幕位置
      const screenPosition = point.position.clone();
      screenPosition.project(this.camera);

      raycaster.setFromCamera(screenPosition, this.camera);
      const intersects = raycaster.intersectObjects(this.schoolBuildMeshList, false);
      const pointDistance = point.position.distanceTo(this.camera.position);

      if (intersects.length) {
        // 获取相交点的距离和点的距离
        const intersectionDistance = intersects[0].distance;
        if (intersects[0].object.name === point.name) {
          // 未找到相交点，显示
          point.element.classList.add('visible');
        } else {
          // 相交点距离比点距离近，隐藏；相交点距离比点距离远，显示
          intersectionDistance < pointDistance
            ? point.element.classList.remove('visible')
            : point.element.classList.add('visible');
        }
      } else {
        point.element.classList.add('visible');
      }
      if (pointDistance > 800) {
        point.element.classList.remove('visible');
      }
      const translateX = screenPosition.x * sizes.width * 0.5;
      const translateY = -screenPosition.y * sizes.height * 0.5;
      point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
    }
    raycaster = null;
  };

  // 检查建筑物是否被鼠标hover
  checkBuildHover = () => {
    let raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(this.Pointer, this.camera);
    const intersects = raycaster.intersectObjects(this.schoolBuildMeshList, false);
    if (intersects.length > 0) {
      if (this.HOVERED != intersects[0].object) {
        if (this.HOVERED) {
          // this.HOVERED.material.emissive.setHex(this.HOVERED.currentHex);
          this.HOVERED.scale.set(1, 1, 1);
        }
        this.HOVERED = intersects[0].object;
        // this.HOVERED.currentHex = this.HOVERED.material.emissive.getHex();
        // this.HOVERED.material.emissive.setHex(0xff0000);
        this.HOVERED.scale.set(1.1, 1.1, 1.1);
      }
    } else {
      if (this.HOVERED) {
        // this.HOVERED.material.emissive.setHex(this.HOVERED.currentHex);
        this.HOVERED.scale.set(1, 1, 1);
      }
      this.HOVERED = null;
    }
    raycaster = null;
  };

  // 初始化相机位置
  initCamera = (time: number, callback?: () => void) => {
    this.state.showCard && this.setState({ showCard: false });
    Animations.animateCamera(
      this.camera,
      this.controls,
      { x: 110, y: 250, z: 100 },
      { x: 0, y: 0, z: -50 },
      time,
      callback,
    );
  };

  resetCamera = () => {
    this.initCamera(3200, () => {
      this.orbitControls.maxDistance = 700;
      this.cloudsArr.forEach((item) => {
        this.scene.remove(item);
        removeObj(item);
      });
      this.cloudsArr = [];
      this.props.setSceneReady(true);
      // 添加建筑物点击事件
      this.addBuildClickSelect();
      // 初始化碰撞集合
      initCollidableObjects(this.scene.children);
    });
  };

  // 初始化导览交互点
  initGuidePoint = (mesh: THREE.Object3D) => {
    let guideInfo: any = null;
    build_data.forEach((obj) => {
      // 获取建筑相关信息
      if (obj.name === mesh.name) {
        guideInfo = obj;
        if (obj.name === '25号楼菜鸟驿站') {
          obj.name = '25号楼/菜鸟驿站';
        }
      }
    });
    if (guideInfo) {
      const w_pos = new THREE.Vector3();
      mesh.getWorldPosition(w_pos);
      // 添加坐标
      guideInfo.position = new THREE.Vector3(w_pos.x, w_pos.y * 1.1, w_pos.z);
      guideInfo.id = mesh.id;
      // 添加元素
      this.setState({ guidePointList: [...this.state.guidePointList, guideInfo] });
    }
  };

  // 添加元素点击事件
  addPointClickSelect = (
    className: string,
    position: THREE.Vector3,
    cardValue: Build,
  ) => {
    // 传建筑物info进行展示
    document.querySelector(className)?.addEventListener('click', (e) => {
      this.state.showCard && this.setState({ showCard: false });
      Animations.animateCamera(
        this.camera,
        this.controls,
        { x: position.x - 10, y: position.y + 80, z: position.z + 80 },
        { x: position.x - 50, y: position.y, z: position.z },
        1500,
        () => {
          this.controls.enabled = false;
          this.setState({ showCard: true });
          this.setState({ currentCardValue: cardValue });
        },
      );
    });
  };

  // 添加元素悬浮事件
  addPointerHover = () => {
    document.addEventListener('mousemove', (event) => {
      this.Pointer.x = (event.clientX / sizes.width) * 2 - 1;
      this.Pointer.y = -(event.clientY / sizes.height) * 2 + 1;
    });
  };

  // 添加建筑物点击事件
  addBuildClickSelect = () => {
    const mousePosition = new THREE.Vector2();
    const rayCaster = new THREE.Raycaster();
    // window.addEventListener('click', (e) => {
    //   // 鼠标坐标转换为Webgl标准设备坐标---归一化
    //   mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    //   mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
    //   // 射线计算
    //   rayCaster.setFromCamera(mousePosition, this.camera);
    //   // 对参数中的网格模型对象进行射线交叉计算，返回交叉选中的对象数组
    //   const intersects = rayCaster.intersectObjects(this.scene.children);
    //   // 遍历查找对应对象
    //   for (let i = 0; i < intersects.length; i++) {
    //     if (intersects[i].object.userData.name) {
    //       // intersects[i].object.material.color.set('black');
    //       let tempObj = intersects[i].object;
    //       this.targetLine && this.scene.remove(this.targetLine);
    //       this.targetLine = drawLightLine(tempObj);
    //       this.scene.add(this.targetLine);
    //       break;
    //     }
    //   }
    // });
  };

  // 设置GUI
  initGUI = (lighter: any) => {
    const colorObj = {
      color: '#ffffff',
    };
    const folder_light = gui.addFolder('Lighting');
    folder_light.open();
    folder_light
      .add(lighter.ambientLight, 'intensity', 0, 2)
      .name('ambientLight')
      .onChange((value) => {
        this.renderer.render(this.scene, this.camera); // 当强度更改时重新渲染场景
      });
    folder_light
      .add(lighter.directLight, 'intensity', 0, 4)
      .name('directLight')
      .onChange((value) => {
        this.renderer.render(this.scene, this.camera); // 当强度更改时重新渲染场景
      });

    folder_light
      .addColor(colorObj, 'color')
      .name('ambientColor')
      .onChange((value) => {
        lighter.ambientLight.color.set(value);
      });
    folder_light
      .addColor(colorObj, 'color')
      .name('directColor')
      .onChange((value) => {
        lighter.directLight.color.set(value);
      });
  };

  render() {
    return (
      <div
        ref={this.container}
        className="school"
        onClick={() => {
          this.props.controlType === 'first' && this.controls.lock();
        }}
      >
        <canvas className="webgl"></canvas>
        {/* 进度条 */}
        <Loading progress={this.state.loadingProcess} initCamera={this.resetCamera} />
        {/* 渲染交互元素 */}
        {this.state.guidePointList.length &&
          this.state.guidePointList.map((obj: any) => {
            return (
              <div className={classnames('point', 'build_' + obj.id)} key={obj.id}>
                <div className="dynamic">
                  <img src={locIcon} className="label-icon" />
                  <span className="name">{obj.name}</span>
                </div>
              </div>
            );
          })}
        {/* 介绍卡片 */}
        <Card
          showCard={this.state.showCard}
          hideCard={() => this.setState({ showCard: false })}
          build={this.state.currentCardValue}
          backCamera={this.initCamera}
        />
      </div>
    );
  }
}

export default SchoolCanvas;
