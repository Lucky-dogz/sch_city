function App() {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  /* 场景、相机、渲染器、相机轨道 */
  let camera = useRef<THREE.Camera>();
  let renderer = useRef<THREE.Renderer>();
  let controls = useRef<OrbitControls>();
  let school_map;
  let containerElement: any = useRef(null);

  const worldOctree = new Octree();
  // 灯光控制
  let lighter = {};
  let animationId = useRef(-1);
  let P = null;
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
    containerElement.current = document.getElementById('container');
    containerElement.current!.appendChild(renderer.current.domElement);
    // 设置相机位置
    camera.current.position.set(1, 1, 10);
    // 轨道
    controls.current = new OrbitControls(camera.current, renderer.current.domElement);

    // 添加坐标系
    const axesHelper = new THREE.AxesHelper(500);

    scene.add(axesHelper);

    /* 平面 */
    const planeGeometry = new THREE.PlaneGeometry(500, 500);
    const planeMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    // scene.add(plane);
    // worldOctree.fromGraphNode(plane);

    /* 长方体 */
    const boxGeometry = new THREE.BoxGeometry(10, 10, 10);
    const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    console.log('box', box);

    scene.add(box);
    worldOctree.fromGraphNode(box);

    initLight();
    initGUI();
  };

  useEffect(() => {
    init();
    // 场景添加glb文件
    loadMap();
    // 加载人物
    loadPlayer();
    // 添加背景天空
    // rgbeLoader();

    animate();
    // 组件销毁
    return () => {
      clear();
    };
  }, []);

  // 销毁前
  const clear = () => {
    cancelAnimationFrame(animationId.current);
    camera.current = null;
    renderer.current.dispose();
    controls.current.dispose();
    window.removeEventListener('resize', resizeUpdate);
    document.getElementById('container').removeChild(renderer.current.domElement);
  };

  // 设置灯光
  const initLight = () => {
    lighter.ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(lighter.ambientLight);

    lighter.directLight = new THREE.DirectionalLight(0xffffff, 2);
    lighter.directLight.position.set(10, 0, 200);
    scene.add(lighter.directLight);
  };

  // 设置GUI
  const initGUI = () => {
    const colorObj = {
      color: '#ffffff',
    };
    const folder_light = gui.addFolder('Lighting');
    folder_light.open();
    folder_light
      .add(lighter.ambientLight, 'intensity', 0, 2)
      .name('ambientLight')
      .onChange((value) => {
        renderer.current.render(scene, camera.current); // 当强度更改时重新渲染场景
      });
    folder_light
      .add(lighter.directLight, 'intensity', 0, 4)
      .name('directLight')
      .onChange((value) => {
        renderer.current.render(scene, camera.current); // 当强度更改时重新渲染场景
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

  // 校园地图加载
  const loadMap = () => {
    loadGltf('school.glb').then((gltf) => {
      console.log('gltf', gltf);
      school_map = gltf.scene;
      scene!.add(school_map);
      school_map.position.set(0, 0, 0);
      school_map.rotateZ(Math.PI);

      school_map.traverse((obj) => {
        if (obj.isMesh) {
          obj.castShadow = true;
        }

        console.log(obj);
      });
      worldOctree.fromGraphNode(school_map);

      const worldOctreeHelper = new OctreeHelper(worldOctree);
      worldOctreeHelper.visible = false;
      scene.add(worldOctreeHelper);

      gui.add({ OctreeDebug: false }, 'OctreeDebug').onChange(function (value) {
        worldOctreeHelper.visible = value;
      });
    });
  };

  // 人物加载
  const loadPlayer = () => {
    P = new Player(containerElement.current, gui, worldOctree);
    P.playerInit();
  };

  const animate = () => {
    // 渲染场景
    console.log('渲染场景...');
    // 开始计时
    const clock = new THREE.Clock();
    let previousTime = 0;
    const STEPS_PER_FRAME = 5;

    const tick = () => {
      stats.update();
      const deltaTime = Math.min(0.05, clock.getDelta()) / STEPS_PER_FRAME;

      const elapsedTime = clock.getElapsedTime();
      const mixerUpdateDelta = elapsedTime - previousTime;
      previousTime = elapsedTime;

      for (let i = 0; i < STEPS_PER_FRAME; i++) {
        P.playerUpdate(deltaTime);
      }
      if (P.mixer instanceof THREE.AnimationMixer) {
        P.mixer.update(mixerUpdateDelta);
      }
      renderer.current.render(scene, camera.current);
      controls.current.update();
      animationId.current = requestAnimationFrame(tick);
    };
    tick();
  };

  return <div id="container" style={{ width: width, height: height }}></div>;
}
