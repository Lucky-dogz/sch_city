import './App.css';
import React from 'react';
import * as THREE from 'three';
// 引入three.js其他扩展库，对应版本查看文档，最新扩展库在addons文件夹下，eg：'three/addons/controls/OrbitControls.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Player from './components/player';
import { gui } from './components/common/gui';
import { Sky } from 'three/examples/jsm/objects/Sky';
import Stats from 'stats.js';
import { Octree } from 'three/examples/jsm/math/Octree';
import { OctreeHelper } from 'three/examples/jsm/helpers/OctreeHelper';
import { creatLoader, loadGltf } from './utils/loadGltf';
import Animations from './utils/animations';
import Tween from 'three/examples/jsm/libs/tween.module.js';
import '@/style/index.less';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import drawLightLine from './utils/drawLine';
import { build_data } from '@/config/data';
import classnames from 'classnames';
import { sizes } from './config/size';
import locIcon from '@/resources/images/loc-icon.svg';
import { getNodesInShortestPathOrder, tweenToColor } from './findPath/helper';
import { astar } from './findPath/astar';
import _ from 'lodash';
import Loading from './components/loading';
import { roadPoint } from '@/config/grid';

class SchoolController extends React.Component {
  renderer: null;
  scene: null;
  camera: null;
  mixers: [];
  targetLine: null; // 目前选中建筑物提示光束
  schoolBuildMeshList: THREE.Object3D[]; // 建筑合集
  container: React.RefObject<unknown>;
  controls: null;
  cols: number;
  rows: number;
  nodeDimensions: { width: number; height: number };
  grid: any[][];
  ground: THREE.Mesh;
  colors: any;
  start: { row: number; col: number };
  finish: { row: number; col: number };
  pathPointArr: THREE.Vector3[];
  road: THREE.Object3D<THREE.Object3DEventMap>;
  redPoint: { row: number; col: number };
  redPointMesh: any;
  constructor(props) {
    super(props);
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.controls = null;
    this.mixers = [];
    this.targetLine = null;
    this.schoolBuildMeshList = [];
    this.container = React.createRef();
    this.cols = 800;
    this.rows = 800;
    this.nodeDimensions = {
      width: 1,
      height: 1,
    };
    this.grid = Array.from({ length: this.rows }, () => new Array(this.cols));
    this.colors = {
      default: { r: 1, g: 1, b: 1 },
      start: { r: 0, g: 1, b: 0 },
      finish: { r: 1, g: 0, b: 0 },
      wall: { r: 0.109, g: 0.109, b: 0.45 },
      visited: { r: 0.329, g: 0.27, b: 0.968 },
      path: { r: 1, g: 1, b: 0 },
    };
    this.start = {
      row: 485,
      col: 404,
    };
    this.finish = {
      row: 510,
      col: 274,
    };
    this.pathPointArr = [];
    this.redPoint = { row: 400, col: 400 };
    this.redPointMesh = null;
  }

  state = {
    loadingProcess: 0,
    dataInitProgress: 0,
    sceneReady: false,
    guidePointList: [],
  };

  componentDidMount() {
    this.initThree();
  }

  componentWillUnmount() {
    this.setState = () => {
      return;
    };
  }

  initThree = () => {
    const clock = new THREE.Clock();

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
    this.camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 2000);
    this.camera.position.set(120, 1800, 120);
    // 轨道
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 0, 0);
    this.controls.enableDamping = true;
    // this.controls.enablePan = false; // 禁止平移
    this.controls.maxPolarAngle = 1.5;
    this.controls.minDistance = 0;
    this.controls.maxDistance = 1500;
    // 监视器
    const stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    // stats.dom.style.top = "20%"
    document.body.appendChild(stats.dom);
    // 添加坐标系
    const axesHelper = new THREE.AxesHelper(500);
    this.scene.add(axesHelper);
    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0);
    this.scene.add(ambientLight);
    // 平行光
    const directLight = new THREE.DirectionalLight(0xffffff, 0);
    directLight.position.set(10, 0, 200);
    this.scene.add(directLight);

    // 加载gui
    this.initGUI({ ambientLight, directLight });

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // 天空
    const sky = new Sky();
    sky.scale.setScalar(10000);
    this.scene.add(sky);
    const skyUniforms = sky.material.uniforms;
    skyUniforms['turbidity'].value = 20; // 云雾度
    skyUniforms['rayleigh'].value = 3;
    skyUniforms['mieCoefficient'].value = 0.005;
    skyUniforms['mieDirectionalG'].value = 0.08;

    // 太阳
    const sun = new THREE.Vector3();
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    const phi = THREE.MathUtils.degToRad(88); // 仰角
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
    // this.redPointMesh = this.drawPoint(this.redPoint.row, this.redPoint.col, 'red');
    // this.scene.add(this.redPointMesh);
    // gui
    //   .add(this.redPoint, 'row', 0, 799)
    //   .name('row')
    //   .onChange((value) => {
    //     this.redPointMesh.position.set(this.redPoint.col - 350, 0, value - 470);
    //   });

    // gui
    //   .add(this.redPoint, 'col', 0, 799)
    //   .name('col')
    //   .onChange((value) => {
    //     this.redPointMesh.position.set(value - 350, 0, this.redPoint.row - 470);
    //   });

    // 进度条加载器
    const manager = new THREE.LoadingManager(
      () => {
        console.log('资源加载完毕！');
        // 添加建筑物点击事件
        this.addBuildClickSelect();
      },
      (url, loaded, total) => {
        console.log('资源加载中：', Math.floor((loaded / total) * 100));
        this.setState({ loadingProcess: Math.floor((loaded / total) * 100) });
      },
    );
    // 初始化加载器
    creatLoader(manager);
    // 加载地图
    this.loadMap(manager);
    this.loadPlain(manager);
    setTimeout(() => {
      this.initGrid();
      this.startFindPath();
      // let res = [];
      // for (let i = 0; i < this.grid.length; i++) {
      //   for (let j = 0; j < this.grid[0].length; j++) {
      //     let obj = this.grid[i][j];
      //     if (obj.status === 'default') {
      //       res.push({
      //         row: obj.row,
      //         col: obj.col,
      //       });
      //     }
      //   }
      // }
      // console.log('res', res);
      // this.startFindPath();
    }, 2000);

    const animate = () => {
      stats && stats.update();
      this.controls && this.controls.update();
      const delta = clock.getDelta();
      this.mixers &&
        this.mixers.forEach((item) => {
          item.update(delta);
        });
      const timer = Date.now() * 0.0005;
      Tween && Tween.update();
      // this.camera && (this.camera.position.y += Math.sin(timer) * 0.05);
      // 不断检查交互点
      // this.checkPointShow();
      this.renderer.render(this.scene, this.camera);
    };
    this.renderer.setAnimationLoop(animate);
  };

  checkPointShow = () => {
    const raycaster = new THREE.Raycaster();
    if (this.state.sceneReady) {
      // 遍历每个交互点
      for (const point of this.state.guidePointList) {
        // 注册元素
        if (!point.element) {
          let element = document.querySelector('.build_' + point.id);
          // 添加元素点击事件
          this.addPointClickSelect('.build_' + point.id, point.position);
          point.element = element;
        }
        // 获取2D屏幕位置
        const screenPosition = point.position.clone();
        screenPosition.project(this.camera);
        raycaster.setFromCamera(screenPosition, this.camera);
        const intersects = raycaster.intersectObjects(this.scene.children);

        // 获取相交点的距离和点的距离
        const intersectionDistance = intersects[0].distance;
        const pointDistance = point.position.distanceTo(this.camera.position);
        if (pointDistance > 900) {
          point.element.classList.remove('visible');
        } else if (intersects[0].object.name === point.name) {
          // 未找到相交点，显示
          point.element.classList.add('visible');
        } else {
          // 相交点距离比点距离近，隐藏；相交点距离比点距离远，显示
          intersectionDistance < pointDistance
            ? point.element.classList.remove('visible')
            : point.element.classList.add('visible');
        }
        const translateX = screenPosition.x * sizes.width * 0.5;
        const translateY = -screenPosition.y * sizes.height * 0.5;
        point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
      }
    }
  };

  moveCamera = () => {
    Animations.animateCamera(
      this.camera,
      this.controls,
      { x: 110, y: 230, z: 60 },
      { x: 50, y: 0, z: -50 },
      2800,
      () => {
        this.setState({ sceneReady: true });
      },
    );
  };

  // 加载平面
  loadPlain = (manager) => {
    // Ground
    let gridWidth = this.cols * this.nodeDimensions.width,
      gridHeight = this.rows * this.nodeDimensions.height;
    let groundGeometry = new THREE.PlaneGeometry(
      gridWidth,
      gridHeight,
      gridWidth,
      gridHeight,
    );
    groundGeometry.rotateX(-Math.PI / 2);
    let loader = new THREE.TextureLoader(manager);
    loader.load(
      'src/resources/textures/ground.png',
      (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.x = this.rows;
        texture.repeat.y = this.cols;
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
        var size = this.cols * this.nodeDimensions.height;
        var divisions = this.cols;
        var gridHelper = new THREE.GridHelper(size, divisions, 0x5c78bd, 0x5c78bd);
        gridHelper.position.set(
          this.ground.position.x,
          this.ground.position.y + 0.05,
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

  // 初始化网格
  initGrid = () => {
    // 创建一个 Raycaster 对象
    let raycaster = new THREE.Raycaster();
    // 垂直向下向量
    let direction = new THREE.Vector3(0, -1, 0);
    let count = 0;
    for (let i = 0; i < roadPoint.length; i++) {
      let row = roadPoint[i].row;
      let col = roadPoint[i].col;
      this.grid[row][col] = this.createNode(row, col, 'default');
      ++count;
    }
    this.addProgress(count);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (!this.grid[i][j]) {
          this.grid[i][j] = this.createNode(i, j, 'wall');
          count++;
        }
      }
    }
    this.addProgress(count);
  };

  addProgress = _.throttle((count) => {
    this.setState({
      dataInitProgress: Math.floor((count / (this.cols * this.rows)) * 100),
    });
  }, 1000);

  // 创建节点
  createNode = (
    row: number,
    col: number,
    status: string,
    raycaster?: THREE.Raycaster,
    direction?: THREE.Vector3 | undefined,
  ) => {
    // let status = 'default';
    if (row == this.start.row && col == this.start.col) {
      status = 'start';
    } else if (row == this.finish.row && col == this.finish.col) {
      status = 'finish';
    }
    // let res = this.initWall({ row, col }, raycaster, direction);
    // if (res === 'wall') {
    //   status = res;
    // }
    let node = {
      id: row * this.cols + col,
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

  // 世界坐标转换成二维坐标
  vectorToCoord = (x: number, z: number) => {
    let row = z + 470;
    let col = x + 350;
    return {
      row,
      col,
    };
  };

  // 初始化墙
  initWall = (
    { row, col }: { row: number; col: number },
    raycaster: THREE.Raycaster,
    direction: THREE.Vector3 | undefined,
  ) => {
    let point = new THREE.Vector3(col - 350, 1, row - 470);
    // let point = new THREE.Vector3(col + 25, 1, row - 95);
    let ray = new THREE.Ray(point, direction);
    // 使用射线检测与所有建筑物的相交
    raycaster.set(ray.origin, ray.direction);
    let intersects = raycaster.intersectObject(this.road);
    // console.log('intersects', intersects);
    if (
      intersects.length &&
      // intersects[0].object.name !== '广场' &&
      intersects[0].object.name === '道路'
    ) {
      return null;
    }
    return 'wall';
  };

  // 校园地图加载
  loadMap = (manager: THREE.LoadingManager | undefined) => {
    const loader = new GLTFLoader(manager).setPath('src/resources/models/');
    loader.load('school.glb', (gltf: GLTF) => {
      console.log('校园地图加载完毕：', gltf);
      const school_map = gltf.scene;
      school_map.position.set(0, 0, 0);
      school_map.rotateY(Math.PI);
      this.scene.add(school_map);

      school_map.traverse((obj) => {
        if (obj.isMesh) {
          if (obj.name === '道路') {
            this.road = obj;
          }
          obj.castShadow = true;
          this.schoolBuildMeshList.push(obj);
          this.initGuidePoint(obj);
        }
      });
    });

    //   // worldOctree.fromGraphNode(school_map);

    //   // const worldOctreeHelper = new OctreeHelper(worldOctree);
    //   // worldOctreeHelper.visible = false;
    //   // scene.add(worldOctreeHelper);

    //   // gui.add({ OctreeDebug: false }, 'OctreeDebug').onChange(function (value) {
    //   //   worldOctreeHelper.visible = value;
    //   // });
    // });
  };

  // 开始寻路
  startFindPath = () => {
    console.log('开始寻路～');
    const startNode = this.grid[this.start.row][this.start.col];
    const finishNode = this.grid[this.finish.row][this.finish.col];
    // this.drawPoint(this.start.row, this.start.col, 'red');
    // this.drawPoint(this.finish.row, this.finish.col, 'red');
    let nodesToAnimate: any = [];
    let find_result;
    find_result = astar(this.grid, startNode, finishNode, nodesToAnimate);
    console.log('find_result:', find_result);
    if (find_result == false) {
      console.log('false');
      return;
    }
    console.log('path:', nodesToAnimate);
    // 最短距离节点集合
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    console.log(nodesInShortestPathOrder);
    this.animatePath(nodesToAnimate, nodesInShortestPathOrder, 500);
  };

  // 画出最短路径
  animatePath = (visitedNodesInOrder, nodesInShortestPathOrder, timerDelay) => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      // if (i === visitedNodesInOrder.length) {
      //   setTimeout(() => {
      //     this.animateShortestPath(nodesInShortestPathOrder, 5 * timerDelay);
      //   }, timerDelay * i);
      //   return;
      // }
      // if (
      //   (visitedNodesInOrder[i].row == this.start.row &&
      //     visitedNodesInOrder[i].col == this.start.col) ||
      //   (visitedNodesInOrder[i].row == this.finish.row &&
      //     visitedNodesInOrder[i].col == this.finish.col)
      // ) {
      //   continue;
      // }
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        this.drawPoint(node.row, node.col, 0xff0000);
        if (!node) return;
      }, timerDelay * i);
    }
  };

  // 画点
  drawPoint = (row: number, col: number, color) => {
    const pointGeometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([col - 350, 0, row - 470]);
    // const vertices = new Float32Array([col + 25, 0, row - 95]);
    pointGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    const pointMaterial = new THREE.PointsMaterial({ size: 1, color });
    const point = new THREE.Points(pointGeometry, pointMaterial);
    this.scene.add(point);
    return point;
  };

  // 画曲线
  drawLine = () => {
    // for (let item of nodesToAnimate) {
    //   // this.pathPointArr.push(new THREE.Vector3(item.col - 350, 0, item.row - 470));
    //   // this.pathPointArr.push(new THREE.Vector3(item.col + 25, 0, item.row - 95));
    //   this.drawPoint(item.row, item.col, 0xff0000);
    // }
    // this.drawPoint(29, 25, 'green');
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

  // 初始化导览交互点
  initGuidePoint = (mesh: THREE.Object3D) => {
    let guideInfo: any = null;
    build_data.forEach((obj) => {
      // 获取建筑相关信息
      if (obj.name === mesh.userData.name) {
        guideInfo = obj;
      }
    });
    if (guideInfo) {
      const w_pos = new THREE.Vector3();
      mesh.getWorldPosition(w_pos);
      // 添加坐标
      guideInfo.position = new THREE.Vector3(w_pos.x, w_pos.y * 1.2, w_pos.z);
      guideInfo.id = mesh.id;
      // 添加元素
      this.setState({ guidePointList: [...this.state.guidePointList, guideInfo] });
    }
  };

  // 添加元素点击事件
  addPointClickSelect = (className: string, position: THREE.Vector3) => {
    document.querySelector(className)?.addEventListener('click', (e) => {
      Animations.animateCamera(
        this.camera,
        this.controls,
        { x: position.x + 10, y: position.y + 100, z: position.z + 100 },
        { x: position.x, y: position.y, z: position.z },
        1600,
        () => {},
      );
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
      <div ref={this.container} className="school">
        <canvas className="webgl"></canvas>
        {/* 进度条 */}

        <Loading progress={this.state.dataInitProgress} moveCamera={this.moveCamera} />

        {/* copyright */}
        <a
          className="github"
          href="https://github.com/dragonir/3d"
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
      </div>
    );
  }
}

export default SchoolController;

// initGroundColor = (groundGeometry, texture) => {
//   const indices = []; // 存储网格的索引数据，用于定义三角形
//   const vertices = []; // 存储网格的顶点坐标
//   const normals = []; // 存储网格的法线数据
//   const colors = []; // 存储每个顶点的颜色数据
//   const size = this.cols * this.rows;
//   const segments = this.cols * this.rows;
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
