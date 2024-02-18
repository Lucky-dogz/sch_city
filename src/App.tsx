import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
// 引入three.js其他扩展库，对应版本查看文档，最新扩展库在addons文件夹下，eg：'three/addons/controls/OrbitControls.js';
// OrbitControls控件支持鼠标左中右键操作和键盘方向键操作
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

function App() {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  /* 场景、相机、渲染器、相机轨道 */
  let scene = useRef<THREE.Scene>();
  let camera = useRef<THREE.Camera>();
  let renderer = useRef<THREE.Renderer>();
  let controls = useRef<OrbitControls>();

  let donuts;
  let mixer;

  const resizeUpdate = (e: any) => {
    // 通过事件对象获取浏览器窗口的高度
    let h = e.target.innerHeight;
    let w = e.target.innerWidth;

    // 对应用大小进行重置
    renderer.current.setSize(w, h);
    setHeight(h);
    setWidth(w);
  };

  // 初始化---重置窗口大小
  useEffect(() => {
    // 页面刚加载完成后获取浏览器窗口的大小
    let h = window.innerHeight;
    setHeight(h);
    let w = window.innerWidth;
    setWidth(w);
    // 页面变化时获取浏览器窗口的大小
    window.addEventListener('resize', resizeUpdate);
    return () => {
      // 组件销毁时移除监听事件
      window.removeEventListener('resize', resizeUpdate);
    };
  }, []);

  // 初始化/销毁 应用
  useEffect(() => {
    // 创建场景
    scene.current = new THREE.Scene();
    // 创建相机
    camera.current = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    renderer.current = new THREE.WebGLRenderer({ antialias: true }); // 打开抗锯齿
    renderer.current.setSize(width, height);

    document.getElementById('container').appendChild(renderer.current.domElement);
    // 设置相机位置
    camera.current.position.set(1, 1, 1);

    controls.current = new OrbitControls(camera.current, renderer.current.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.current.add(ambientLight);
    // const directLight = new THREE.DirectionalLight(0xffffff, 2);
    // directLight.position.set(10, 0, 200);
    // scene.current.add(directLight);
    // 添加坐标系
    // const axesHelper = new THREE.AxesHelper(5);
    // scene.current.add(axesHelper);

    // 场景添加glb文件
    gltfLoader();
    // 添加背景天空
    rgbeLoader();
    animate();
    // 组件销毁时移除app应用
    return () => {
      document.getElementById('container').removeChild(renderer.current.domElement);
    };
  }, []);

  // 模型加载器
  const gltfLoader = () => {
    new GLTFLoader().load('../src/resources/models/donuts.glb', (gltf) => {
      console.log('gltf', gltf);

      donuts = gltf.scene;

      scene.current!.add(donuts);
      // donuts.position.set(0, 0, 0);
      // donuts.rotateX(Math.PI);
      mixer = new THREE.AnimationMixer(donuts);
      const clips = gltf.animations;
      // 播放所有动画
      clips.forEach((clip) => {
        const action = mixer.clipAction(clip);
        action.loop = THREE.LoopOnce;
        // 停在最后一帧
        action.clampWhenFinished = true;
        action.play();
      });
    });
  };

  // 纹理加载器
  const rgbeLoader = () => {
    new RGBELoader().load('../src/resources/sky2.hdr', function (texture) {
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
    if (donuts) {
      donuts.rotation.y += 0.01;
    }
    if (mixer) {
      mixer.update(0.02);
    }
    requestAnimationFrame(animate);
  };

  return <div id="container" style={{ width: width, height: height }}></div>;
}

export default App;
