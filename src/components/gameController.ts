import * as THREE from 'three';
import { Octree } from 'three/examples/jsm/math/Octree';
import { OctreeHelper } from 'three/examples/jsm/helpers/OctreeHelper';
import { Capsule } from 'three/examples/jsm/math/Capsule';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GUI } from 'dat.gui';
import CapsuleHelper from './capsuleHelper';

const GRAVITY = 30;
const NUM_SPHERES = 100; // 最大小球数量，超过该值将回收释放旧的小球
const SPHERE_RADIUS = 0.2;
const sphereGeometry = new THREE.IcosahedronGeometry(SPHERE_RADIUS, 5);
const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xdede8d });
const spheres = [];
let sphereIdx = 0;
const gui = new GUI();
// 八叉树，碰撞检测
const worldOctree = new Octree();
// 角色碰撞胶囊
const playerCollider = new Capsule(
  new THREE.Vector3(0, 0.35, 0),
  new THREE.Vector3(0, 1.5, 0),
  0.35,
);
const playerColliderHelper = CapsuleHelper(0.35, 1.85);
// 修正角色位置使其触地
const playerFixVector = new THREE.Vector3(0, 0.35, 0);
// 运动速度
const playerVelocity = new THREE.Vector3();
// 运动方向
const playerDirection = new THREE.Vector3();
// 角色是否在地面
let playerOnFloor = false;

let mouseTime = 0;

// 按下前进按键的持续时间
let ForwardHoldTimeClock = new THREE.Clock();
ForwardHoldTimeClock.autoStart = false;

// 视角拖动灵敏度
let cameraMoveSensitivity = 0.4;
gui
  .add({ cameraMoveSensitivity: cameraMoveSensitivity }, 'cameraMoveSensitivity')
  .step(0.1)
  .min(0)
  .max(1)
  .onChange(function (value) {
    cameraMoveSensitivity = value;
  });

// 按键事件状态
const keyStates = {
  // 使用W、A、S、D按键来控制前、后、左、右运动
  // false表示没有按下，true表示按下状态
  W: false,
  A: false,
  S: false,
  D: false,
  Space: false,
  leftMouseBtn: false,
};

// 角色运动状态
const playerActionState = {
  forward: 0,
  turn: 0,
};

// 投掷小球
function throwBall() {
  console.log('投掷小球');
  const sphere = spheres[sphereIdx];
  // 将相机视角的方向作为角色运动方向
  that.player.getWorldDirection(playerDirection);
  sphere.collider.center
    .copy(playerCollider.end)
    .addScaledVector(playerDirection, playerCollider.radius * 1.5);
  // throw the ball with more force if we hold the button longer, and if we move forward
  const impulse = 15 + 30 * (1 - Math.exp((mouseTime - performance.now()) * 0.001));

  sphere.velocity.copy(playerDirection).multiplyScalar(impulse);
  sphere.velocity.addScaledVector(playerVelocity, 2);

  sphereIdx = (sphereIdx + 1) % spheres.length;
}

// 角色碰撞检测
function playerCollisions() {
  const result = worldOctree.capsuleIntersect(playerCollider);
  playerOnFloor = false;

  if (result) {
    playerOnFloor = result.normal.y > 0;

    if (!playerOnFloor) {
      playerVelocity.addScaledVector(result.normal, -result.normal.dot(playerVelocity));
    }

    playerCollider.translate(result.normal.multiplyScalar(result.depth));
  }
}
// 更新角色位置信息
function updatePlayer(deltaTime) {
  if (!(that.player instanceof THREE.Object3D)) return;

  let speedRatio = 1.5;
  let damping = Math.exp(-20 * deltaTime) - 1; // 阻尼减速

  if (!playerOnFloor) {
    playerVelocity.y -= GRAVITY * deltaTime;
    // small air resistance
    damping *= 0.1;
    speedRatio = 2;
  }

  playerVelocity.addScaledVector(playerVelocity, damping);

  // console.log(playerVelocity)

  // console.log(playerActionState)
  // 前进
  if (playerActionState.forward > 0) {
    if (playerActionState.turn != 0) {
      that.player.rotation.y -= playerActionState.turn * deltaTime * 2;
    }
    // 前进状态持续2s以上转为跑步状态
    if (ForwardHoldTimeClock.getElapsedTime() > 2) {
      if (playerOnFloor) speedRatio = 4;
      changeAction('run');
    } else {
      changeAction('walk');
    }
  }
  if (playerActionState.forward < 0) {
    changeAction('walk');
  }
  // 原地转向
  if (playerActionState.forward == 0 && playerActionState.turn != 0) {
    changeAction('walk');
    that.player.rotation.y -= playerActionState.turn * deltaTime * 2;
  }
  // 休息状态
  if (playerActionState.forward == 0 && playerActionState.turn == 0) {
    changeAction('idle');
  }

  const deltaPosition = playerVelocity.clone().multiplyScalar(deltaTime * speedRatio); // 速度*时间 = 移动距离 (向量)
  deltaPosition.y /= speedRatio; // 速度系数不对高度分量产生效果
  playerCollider.translate(deltaPosition);

  playerCollisions();

  that.player.position.copy(
    new THREE.Vector3().subVectors(playerCollider.start, playerFixVector),
  ); // 更新角色位置，辅以修正向量角色触地
}

// 前进方向上的向量
function getForwardVector() {
  that.player.getWorldDirection(playerDirection);
  playerDirection.y = 0;
  playerDirection.normalize();

  return playerDirection;
}
// 横移方向上的向量
function getSideVector() {
  that.player.getWorldDirection(playerDirection);
  playerDirection.y = 0;
  playerDirection.normalize();
  playerDirection.cross(that.player.up);

  return playerDirection;
}

// 角色控制
function controls(deltaTime) {
  // gives a bit of air control
  const speedDelta = deltaTime * (playerOnFloor ? 25 : 8);

  if (keyStates['W']) {
    playerVelocity.add(getForwardVector().multiplyScalar(speedDelta));
  }

  if (keyStates['S']) {
    playerVelocity.add(getForwardVector().multiplyScalar(-speedDelta));
  }

  if (keyStates['A']) {
    playerVelocity.add(getSideVector().multiplyScalar(-speedDelta));
  }

  if (keyStates['D']) {
    playerVelocity.add(getSideVector().multiplyScalar(speedDelta));
  }

  if (playerOnFloor) {
    if (keyStates['Space']) {
      playerVelocity.y = 15;
    }
  }
}

function teleportPlayerIfOob() {
  if (!(that.player instanceof THREE.Object3D)) return;
  if (that.player.position.y <= -25) {
    playerCollider.start.set(0, 0.35, 0);
    playerCollider.end.set(0, 1, 0);
    playerCollider.radius = 0.35;
    that.player.position.copy(
      new THREE.Vector3().subVectors(playerCollider.start, playerFixVector),
    );
    that.player.rotation.set(0, 0, 0);
  }
}
/**
 * 切换动作
 * @param {string} actionName 动画名称
 */
function changeAction(actionName) {
  if (that.allActions[actionName] && that.currentAction.name != actionName) {
    if (that.currentAction.name === 'idle') {
      executeCrossFade(actionName);
    } else {
      executeCrossFade(actionName);
    }
    // console.log('切换至动作：',actionName)
  }
}
function executeCrossFade(actionName) {
  // that.currentAction.weight = 0    // 停止当前动画，设置权重为0
  const action = that.allActions[actionName];
  // action.weight = 1    // 播放当前动画
  action.enabled = true;
  action.setEffectiveTimeScale(1);
  action.setEffectiveWeight(1);
  action.time = 0;
  that.currentAction.crossFadeTo(action, 0.35, true);
  that.currentAction = action;
}
// debugObject.animations = {
//     run:()=>{
//         changeAction('run')
//     },
//     walk:()=>{
//         changeAction('walk')
//     },
//     idle:()=>{
//         changeAction('idle')
//     }
// }
// for(let obj in debugObject.animations){
//     gui.add(debugObject.animations,obj)
// }

export function gameUpdate(deltaTime) {
  // 控制
  controls(deltaTime);
  // 更新位置
  updatePlayer(deltaTime);
  // 复位检测
  teleportPlayerIfOob();
}

var that = null;
/**
 *
 * @param {ThreeApp} th
 */
export default function gameInit(th) {
  that = th;
  // 小球
  for (let i = 0; i < NUM_SPHERES; i++) {
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.castShadow = true;
    sphere.receiveShadow = true;

    that.scene.add(sphere);

    spheres.push({
      mesh: sphere,
      collider: new THREE.Sphere(new THREE.Vector3(0, -100, 0), SPHERE_RADIUS),
      velocity: new THREE.Vector3(),
    });
  }
  let keyW = false;
  // 当某个键盘按下设置对应属性设置为true
  document.addEventListener('keydown', (event) => {
    if (event.code === 'KeyW') {
      keyStates.W = true;
      playerActionState.forward = 1;
      if (!keyW) {
        // keydown事件在按下按键不松时会持续激活，因此需进行状态控制，避免计时器重复计时
        ForwardHoldTimeClock.start();
        keyW = true;
      }
      // console.log(ForwardHoldTimeClock.getElapsedTime())
    }
    if (event.code === 'KeyA') {
      keyStates.A = true;
      playerActionState.turn = -1;
    }
    if (event.code === 'KeyS') {
      keyStates.S = true;
      playerActionState.forward = -1;
    }
    if (event.code === 'KeyD') {
      keyStates.D = true;
      playerActionState.turn = 1;
    }
    if (event.code === 'Space') {
      keyStates.Space = true;
    }
  });
  // 当某个键盘抬起设置对应属性设置为false
  document.addEventListener('keyup', (event) => {
    if (event.code === 'KeyW') {
      keyW = false;
      keyStates.W = false;
      playerActionState.forward = 0;
      ForwardHoldTimeClock.stop();
      ForwardHoldTimeClock.elapsedTime = 0;
    }
    if (event.code === 'KeyA') {
      keyStates.A = false;
      playerActionState.turn = 0;
    }
    if (event.code === 'KeyS') {
      keyStates.S = false;
      playerActionState.forward = 0;
    }
    if (event.code === 'KeyD') {
      keyStates.D = false;
      playerActionState.turn = 0;
    }
    if (event.code === 'Space') keyStates.Space = false;

    // 保持按键打断前的状态
    // console.log(keyStates)
    playerActionState.forward = keyStates.W == true ? 1 : playerActionState.forward;
    playerActionState.turn = keyStates.A == true ? -1 : playerActionState.turn;
    playerActionState.forward = keyStates.S == true ? -1 : playerActionState.forward;
    playerActionState.turn = keyStates.D == true ? 1 : playerActionState.turn;
    // console.log(playerActionState)
  });
  // 鼠标按下时锁定禁用鼠标指针
  that.container.addEventListener('mousedown', (e) => {
    // document.body.requestPointerLock()
    if (e.button == 0) {
      // 鼠标左键被点击
      keyStates.leftMouseBtn = true;
    }
    mouseTime = performance.now();
  });
  // 鼠标按键抬起，投掷小球
  document.addEventListener('mouseup', (e) => {
    if (document.pointerLockElement !== null) throwBall();
    if (e.button == 0) {
      // 鼠标左键抬起
      keyStates.leftMouseBtn = false;
    }
  });
  // 相机视角跟随鼠标旋转
  document.body.addEventListener('mousemove', (event) => {
    // document.pointerLockElement === document.body
    // 鼠标左键拖动时移动视角
    if (keyStates.leftMouseBtn) {
      // console.log('mousemove')
      if (cameraMoveSensitivity <= 0) cameraMoveSensitivity = 0.001;
      if (cameraMoveSensitivity > 1) cameraMoveSensitivity = 1;
      that.player.rotation.y -= event.movementX / (cameraMoveSensitivity * 1000);
      that.camera.rotation.x -= event.movementY / (cameraMoveSensitivity * 1000);
    }
  });

  const loader = new GLTFLoader().setPath('/models/');
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('/draco/');
  loader.setDRACOLoader(dracoLoader);
  // 场景加载 collision-world.glb
  loader.load('collision-world.glb', (gltf) => {
    // gltf.scene.scale.set(0.002,0.002,0.002)
    that.scene.add(gltf.scene);

    // gltf.scene.getObjectByName("碰撞检测").visible = false
    worldOctree.fromGraphNode(gltf.scene);

    // 修改材质，启用阴影
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material.map) {
          child.material.map.anisotropy = 4;
        }
      }
    });

    const helper = new OctreeHelper(worldOctree);
    helper.visible = false;
    that.scene.add(helper);

    gui.add({ OctreeDebug: false }, 'OctreeDebug').onChange(function (value) {
      helper.visible = value;
    });
  });

  // 角色模型
  loader.load('Xbot.glb', (gltf) => {
    that.player = gltf.scene;
    that.scene.add(that.player);
    that.player.add(that.camera);
    that.player.add(playerColliderHelper);
    // 启用阴影
    that.player.traverse(function (object) {
      if (object.isMesh) object.castShadow = true;
    });
    // 关键帧动画
    // console.log('所有骨骼动画数据', gltf.animations);
    const animations = gltf.animations;
    that.mixer = new THREE.AnimationMixer(that.player);
    that.allActions = {};
    for (let i = 0; i < animations.length; i++) {
      // agree,headShake,idle,run,sad_pose,sneak_pose,walk
      const clip = animations[i]; //休息、步行、跑步等动画的clip数据
      const action = that.mixer.clipAction(clip); //clip生成action
      action.name = clip.name; //action命名name
      // 批量设置所有动画动作的权重
      if (action.name === 'idle') {
        action.weight = 1.0; //默认播放Idle对应的休息动画
      } else {
        action.weight = 0.0;
      }
      action.play();
      // action动画动作名字作为actionObj的属性
      that.allActions[action.name] = action;
    }
    that.currentAction = that.allActions['idle'];
  });
  gui.add({ colliderHelper: true }, 'colliderHelper').onChange(function (value) {
    playerColliderHelper.visible = value;
  });
}
