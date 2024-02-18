import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
// 引入three.js其他扩展库，对应版本查看文档，最新扩展库在addons文件夹下，eg：'three/addons/controls/OrbitControls.js';
// OrbitControls控件支持鼠标左中右键操作和键盘方向键操作
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { GUI } from 'dat.gui';

function App() {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  /* 场景、相机、渲染器、相机轨道 */
  let scene = useRef<THREE.Scene>();
  let camera = useRef<THREE.Camera>();
  let renderer = useRef<THREE.Renderer>();
  let controls = useRef<OrbitControls>();
  let sch;
  // 灯光控制
  const lighter = {};
  // 调试ui
  let gui = null;

  const resizeUpdate = (e: any) => {
    // 通过事件对象获取浏览器窗口的高度
    let h = e.target.innerHeight;
    let w = e.target.innerWidth;

    // 对应用大小进行重置
    renderer.current.setSize(w, h);
    setHeight(h);
    setWidth(w);
  };

  // 初始化
  const init = () => {
    // 页面刚加载完成后获取浏览器窗口的大小
    let h = window.innerHeight;
    setHeight(h);
    let w = window.innerWidth;
    setWidth(w);
    // 页面变化时获取浏览器窗口的大小
    window.addEventListener('resize', resizeUpdate);

    // 创建场景
    scene.current = new THREE.Scene();
    // 创建相机
    camera.current = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    // 创建渲染器
    renderer.current = new THREE.WebGLRenderer({ antialias: true }); // 打开抗锯齿
    renderer.current.setSize(width, height);

    document.getElementById('container').appendChild(renderer.current.domElement);
    // 设置相机位置
    camera.current.position.set(1, 1, 250);
    controls.current = new OrbitControls(camera.current, renderer.current.domElement);

    // 添加坐标系
    const axesHelper = new THREE.AxesHelper(500);
    scene.current.add(axesHelper);

    initLight();
    initGUI();
  };

  useEffect(() => {
    init();
    // 场景添加glb文件
    gltfLoader();
    // 添加背景天空
    // rgbeLoader();
    animate();
    // 组件销毁
    return () => {
      beforeDestroy();
    };
  }, []);

  // 销毁前
  const beforeDestroy = () => {
    gui.destroy();
    // 组件销毁时移除监听事件
    window.removeEventListener('resize', resizeUpdate);
    document.getElementById('container').removeChild(renderer.current.domElement);
  };

  // 设置灯光
  const initLight = () => {
    lighter.ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.current.add(lighter.ambientLight);

    lighter.directLight = new THREE.DirectionalLight(0xffffff, 2);
    lighter.directLight.position.set(10, 0, 200);
    scene.current.add(lighter.directLight);
  };

  // 设置GUI
  const initGUI = () => {
    gui = new GUI();
    const colorObj = {
      color: '#ffffff',
    };
    const folder_light = gui.addFolder('Lighting');
    folder_light.open();
    folder_light
      .add(lighter.ambientLight, 'intensity', 0, 2)
      .name('ambientLight')
      .onChange((value) => {
        renderer.current.render(scene.current, camera.current); // 当强度更改时重新渲染场景
      });
    folder_light
      .add(lighter.directLight, 'intensity', 0, 4)
      .name('directLight')
      .onChange((value) => {
        renderer.current.render(scene.current, camera.current); // 当强度更改时重新渲染场景
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

  // 模型加载器
  const gltfLoader = () => {
    new GLTFLoader().load('./src/resources/models/ImageToStl.com_test.glb', (gltf) => {
      console.log('gltf', gltf);
      sch = gltf.scene;

      scene.current!.add(sch);
      sch.position.set(0, 0, 0);
      sch.rotateX(Math.PI);
    });
  };

  // 纹理加载器
  const rgbeLoader = () => {
    new RGBELoader().load('@/resources/sky2.hdr', function (texture) {
      scene.current!.background = texture;
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.current!.environment = texture;
      renderer.current!.outputEncoding = THREE.sRGBEncoding;
      // 重新渲染
      renderer.current!.render(scene.current, camera.current);
    });
  };

  const animate = () => {
    renderer.current.render(scene.current, camera.current);
    controls.current.update();
    requestAnimationFrame(animate);
  };

  return <div id="container" style={{ width: width, height: height }}></div>;
}

export default App;
