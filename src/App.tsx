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
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import drawLightLine from './utils/drawLine';

class SchoolController extends React.Component {
  renderer: null;
  scene: null;
  camera: null;
  mixers: never[];
  targetLine: null;
  constructor(props) {
    super(props);
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.mixers = [];
    this.targetLine = null;
  }

  state = {
    loadingProcess: 0,
    sceneReady: false,
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

    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

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
    this.camera.position.set(100, -100, 500);
    // 轨道
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.enableDamping = true;
    // controls.enablePan = false;
    // controls.maxPolarAngle = 1.5;
    // controls.minDistance = 50;
    // controls.maxDistance = 1200;
    // 监视器
    const stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    // stats.dom.style.top = "20%"
    document.body.appendChild(stats.dom);
    // 添加坐标系
    const axesHelper = new THREE.AxesHelper(500);
    this.scene.add(axesHelper);
    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);
    // 平行光
    const directLight = new THREE.DirectionalLight(0xffffff, 2);
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

    // 进度条加载器
    const manager = new THREE.LoadingManager();
    manager.onProgress = async (url, loaded, total) => {
      console.log(Math.floor((loaded / total) * 100));

      if (Math.floor((loaded / total) * 100) === 100) {
        this.setState({ loadingProcess: Math.floor((loaded / total) * 100) });
        Animations.animateCamera(
          this.camera,
          controls,
          { x: 0, y: 40, z: 140 },
          { x: 0, y: 0, z: 0 },
          4000,
          () => {
            this.setState({ sceneReady: true });
          },
        );
      } else {
        this.setState({ loadingProcess: Math.floor((loaded / total) * 100) });
      }
    };
    // 初始化加载器
    creatLoader(manager);

    // 加载地图
    this.loadMap();

    // 点
    const raycaster = new THREE.Raycaster();
    const points = [
      {
        position: new THREE.Vector3(10, 46, 0),
        element: document.querySelector('.point-0'),
      },
      {
        position: new THREE.Vector3(-10, 8, 24),
        element: document.querySelector('.point-1'),
      },
      {
        position: new THREE.Vector3(30, 10, 70),
        element: document.querySelector('.point-2'),
      },
      {
        position: new THREE.Vector3(-100, 50, -300),
        element: document.querySelector('.point-3'),
      },
      {
        position: new THREE.Vector3(-120, 50, -100),
        element: document.querySelector('.point-4'),
      },
    ];

    // 添加点击事件交互
    document.querySelectorAll('.point').forEach((item) => {
      item.addEventListener('click', (event) => {
        let className = event.target.classList[event.target.classList.length - 1];
        switch (className) {
          case 'label-0':
            Animations.animateCamera(
              this.camera,
              controls,
              { x: -15, y: 80, z: 60 },
              { x: 0, y: 0, z: 0 },
              1600,
              () => {},
            );
            break;
          case 'label-1':
            Animations.animateCamera(
              this.camera,
              controls,
              { x: -20, y: 10, z: 60 },
              { x: 0, y: 0, z: 0 },
              1600,
              () => {},
            );
            break;
          case 'label-2':
            Animations.animateCamera(
              this.camera,
              controls,
              { x: 30, y: 10, z: 100 },
              { x: 0, y: 0, z: 0 },
              1600,
              () => {},
            );
            break;
          default:
            Animations.animateCamera(
              this.camera,
              controls,
              { x: 0, y: 40, z: 140 },
              { x: 0, y: 0, z: 0 },
              1600,
              () => {},
            );
            break;
        }
      });
    });

    const animate = () => {
      requestAnimationFrame(animate);
      stats && stats.update();
      controls && controls.update();
      const delta = clock.getDelta();
      this.mixers &&
        this.mixers.forEach((item) => {
          item.update(delta);
        });
      const timer = Date.now() * 0.0005;
      Tween && Tween.update();
      // this.camera && (this.camera.position.y += Math.sin(timer) * 0.05);
      if (this.state.sceneReady) {
        // 遍历每个点
        for (const point of points) {
          // 获取2D屏幕位置
          const screenPosition = point.position.clone();
          screenPosition.project(this.camera);
          raycaster.setFromCamera(screenPosition, this.camera);
          const intersects = raycaster.intersectObjects(this.scene.children, true);
          if (intersects.length === 0) {
            // 未找到相交点，显示
            point.element.classList.add('visible');
          } else {
            // 找到相交点
            // 获取相交点的距离和点的距离
            const intersectionDistance = intersects[0].distance;
            const pointDistance = point.position.distanceTo(this.camera.position);
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
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  };

  // 校园地图加载
  loadMap = () => {
    loadGltf('school.glb').then((gltf: GLTF) => {
      console.log('school', gltf);
      const school_map = gltf.scene;
      this.scene.add(school_map);
      school_map.position.set(0, 0, 0);
      school_map.rotateY(Math.PI);
      school_map.traverse((obj) => {
        if (obj.isMesh) {
          obj.castShadow = true;
        }
        // console.log(obj);
      });
      this.addClickSelect();
      // worldOctree.fromGraphNode(school_map);

      // const worldOctreeHelper = new OctreeHelper(worldOctree);
      // worldOctreeHelper.visible = false;
      // scene.add(worldOctreeHelper);

      // gui.add({ OctreeDebug: false }, 'OctreeDebug').onChange(function (value) {
      //   worldOctreeHelper.visible = value;
      // });
    });
  };

  // 添加鼠标点击交叉事件
  addClickSelect = () => {
    const mousePosition = new THREE.Vector2();
    const rayCaster = new THREE.Raycaster();
    window.addEventListener('click', (e) => {
      // 鼠标坐标转换为Webgl标准设备坐标---归一化
      mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
      // 射线计算
      rayCaster.setFromCamera(mousePosition, this.camera);
      // 对参数中的网格模型对象进行射线交叉计算，返回交叉选中的对象数组
      const intersects = rayCaster.intersectObjects(this.scene.children);
      // 遍历查找对应对象
      for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.userData.name) {
          // intersects[i].object.material.color.set('black');
          let tempObj = intersects[i].object;
          this.targetLine && this.scene.remove(this.targetLine);
          this.targetLine = drawLightLine(tempObj);
          this.scene.add(this.targetLine);
          break;
        }
      }
    });
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
      <div className="school">
        <canvas className="webgl"></canvas>
        {/* 进度条 */}
        {this.state.loadingProcess === 100 ? (
          ''
        ) : (
          <div className="loading">
            <span className="progress">{this.state.loadingProcess} %</span>
          </div>
        )}
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

        <div className="point point-0">
          <div className="label label-0">1</div>
          <div className="text">
            灯塔：矗立在海岸的岩石之上，白色的塔身以及红色的塔屋，在湛蓝色的天空和深蓝色大海的映衬下，显得如此醒目和美丽。
          </div>
        </div>
        <div className="point point-1">
          <div className="label label-1">2</div>
          <div className="text">
            小船：梦中又见那宁静的大海，我前进了，驶向远方，我知道我是船，只属于远方。这一天，我用奋斗作为白帆，要和明天一起飘扬，呼喊。
          </div>
        </div>
        <div className="point point-2">
          <div className="label label-2">3</div>
          <div className="text">
            沙滩：宇宙展开的一小角。不想说来这里是暗自疗伤，那过于矫情，只想对每一粒沙子，每一朵浪花问声你们好吗
          </div>
        </div>
        <div className="point point-3">
          <div className="label label-3">4</div>
          <div className="text">
            飞鸟：在苍茫的大海上，狂风卷集着乌云。在乌云和大海之间，海燕像黑色的闪电，在高傲地飞翔。
          </div>
        </div>
        <div className="point point-4">
          <div className="label label-4">5</div>
          <div className="text">
            礁石：寂寞又怎么样？礁石都不说话，但是水流过去之后，礁石留下。
          </div>
        </div>
      </div>
    );
  }
}

export default SchoolController;
