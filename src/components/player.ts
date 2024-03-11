import * as THREE from 'three';
import { Octree } from 'three/examples/jsm/math/Octree';
import { OctreeHelper } from 'three/examples/jsm/helpers/OctreeHelper';
import { Capsule } from 'three/examples/jsm/math/Capsule';
import capsuleHelper from './capsuleHelper';
import loadGltf from '@/utils/loaders';
import { scene } from './common/scene';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import creatLoader from './base/loader';

class Player {
  private player: undefined | GLTF;
  private playerCapsule!: Capsule;
  private allActions!: {};
  private currentAction!: {};
  private GRAVITY!: number;

  private R!: number;
  private H!: number;
  private playerColliderHelper!: THREE.Group<THREE.Object3DEventMap>;
  private playerFixVector!: THREE.Vector3;
  private playerVelocity!: THREE.Vector3;
  private playerDirection!: THREE.Vector3;
  private playerOnFloor!: boolean;
  private mouseTime!: number;
  private ForwardHoldTimeClock!: THREE.Clock;
  private cameraMoveSensitivity!: number;
  private keyStates = {
    // 使用W、A、S、D按键来控制前、后、左、右运动
    W: false,
    A: false,
    S: false,
    D: false,
    Space: false,
    leftMouseBtn: false,
  };
  playerActionState!: { forward: number; turn: number };
  container: any;
  gui: any;
  mixer: any;
  worldOctree: any;

  constructor(container, gui, worldOctree) {
    this.container = container;
    this.gui = gui;
    this.worldOctree = worldOctree;
    this.init();
  }

  init() {
    this.allActions = {};
    this.currentAction = {};
    this.GRAVITY = 10;

    this.R = 0.35;
    this.H = 1.85;
    this.playerCapsule = new Capsule(
      new THREE.Vector3(0, 0, this.R), //底部半球球心坐标
      new THREE.Vector3(0, 0, this.H - this.R), //顶部半球球心坐标
      this.R,
    );
    // 添加胶囊显示助手
    this.playerColliderHelper = capsuleHelper(this.R, this.H);
    // 修正角色位置使其触地
    this.playerFixVector = new THREE.Vector3(0, 0, 0.35);
    // 运动速度
    this.playerVelocity = new THREE.Vector3();
    // 运动方向
    this.playerDirection = new THREE.Vector3();

    // 角色是否在地面
    this.playerOnFloor = false;

    this.mouseTime = 0;

    // 按下前进按键的持续时间
    this.ForwardHoldTimeClock = new THREE.Clock();
    this.ForwardHoldTimeClock.autoStart = false;

    // 视角拖动灵敏度
    this.cameraMoveSensitivity = 0.4;

    // 角色运动状态
    this.playerActionState = {
      forward: 0,
      turn: 0,
    };
  }

  // 前进方向上的向量
  getForwardVector() {
    this.player.getWorldDirection(this.playerDirection);
    // this.playerDirection.z = 0;
    this.playerDirection.normalize();
    return this.playerDirection;
  }
  // 横移方向上的向量
  getSideVector() {
    this.player.getWorldDirection(this.playerDirection);
    // this.playerDirection.z = 0;
    this.playerDirection.normalize();
    if (this.playerActionState.forward != 0) this.playerDirection.cross(this.player.up);
    return this.playerDirection;
  }
  // 角色控制
  controls(deltaTime: number) {
    const speedDelta = deltaTime * (this.playerOnFloor ? 25 : 8);

    if (this.keyStates['W'] || this.keyStates['S']) {
      this.playerVelocity.add(this.getForwardVector().multiplyScalar(speedDelta));
    }

    if (this.keyStates['A'] || this.keyStates['D']) {
      this.playerVelocity.add(this.getSideVector().multiplyScalar(speedDelta));
    }

    if (this.playerOnFloor) {
      if (this.keyStates['Space']) {
        this.playerVelocity.z = 50;
      }
    }
  }

  // 角色碰撞检测
  playerCollisions() {
    const result = this.worldOctree.capsuleIntersect(this.playerCapsule);
    // console.log('resule', result);

    this.playerOnFloor = false;
    if (result) {
      this.playerOnFloor = result.normal.z > 0;
      if (!this.playerOnFloor) {
        this.playerVelocity.addScaledVector(
          result.normal,
          -result.normal.dot(this.playerVelocity),
        );
      }
      this.playerCapsule.translate(result.normal.multiplyScalar(result.depth));
    }
  }
  // 更新角色位置信息
  updatePlayer(deltaTime: number) {
    if (!(this.player instanceof THREE.Object3D)) return;

    let speedRatio = 4;
    let damping = Math.exp(-20 * deltaTime) - 1; // 阻尼减速

    // 下降
    if (!this.playerOnFloor) {
      this.playerVelocity.z -= this.GRAVITY * deltaTime;
      // 空气阻力
      damping *= 0.1;
      speedRatio = 3;
    }

    this.playerVelocity.addScaledVector(this.playerVelocity, damping);

    // 前进
    if (this.playerActionState.forward > 0) {
      if (this.playerActionState.turn != 0) {
        this.player.rotation.y -= this.playerActionState.turn * deltaTime;
      } else {
        this.player.rotation.y = Math.PI;
      }
      this.changeAction('run');
      // 前进状态持续2s以上转为跑步状态
      // if (this.ForwardHoldTimeClock.getElapsedTime() >= 2) {
      //   if (this.playerOnFloor) speedRatio = 4;
      //   this.changeAction('run');
      // } else {

      // }
    }
    // 后退
    if (this.playerActionState.forward < 0) {
      if (this.playerActionState.turn != 0) {
        this.player.rotation.y += this.playerActionState.turn * deltaTime;
      } else {
        this.player.rotation.y = 0;
      }
      this.changeAction('run');
    }
    // 转向
    if (this.playerActionState.forward == 0 && this.playerActionState.turn != 0) {
      this.changeAction('run');
      // this.player.rotation.y -= this.playerActionState.turn * deltaTime * 2;
      this.player.rotation.y = this.playerActionState.turn * (Math.PI / 2);
    }
    // 休息状态
    if (this.playerActionState.forward == 0 && this.playerActionState.turn == 0) {
      this.changeAction('idle');
    }

    const deltaPosition = this.playerVelocity
      .clone()
      .multiplyScalar(deltaTime * speedRatio); // 速度*时间 = 移动距离 (向量)
    deltaPosition.z /= speedRatio; // 速度系数不对高度分量产生效果

    this.playerCapsule.translate(deltaPosition);

    this.playerCollisions();

    this.player.position.copy(
      new THREE.Vector3().subVectors(this.playerCapsule.start, this.playerFixVector),
    ); // 更新角色位置，辅以修正向量角色触地
  }

  /**
   * 切换动作
   * @param {string} actionName 动画名称
   */
  changeAction(actionName: string) {
    if (this.allActions[actionName] && this.currentAction.name != actionName) {
      if (this.currentAction.name === 'idle') {
        this.executeCrossFade(actionName);
      } else {
        this.executeCrossFade(actionName);
      }
    }
  }

  /**
   * 切换和管理动画操作，确保正确地播放新的动画，并在过渡时使用淡入淡出效果，以提供更平滑的动画过渡。
   * @param actionName 动作名称
   */
  executeCrossFade(actionName: string) {
    const action = this.allActions[actionName];
    action.enabled = true;
    action.setEffectiveTimeScale(1);
    action.setEffectiveWeight(1);
    action.time = 0;
    this.currentAction.crossFadeTo(action, 0.35, true); //指定了混合时间为 0.35（秒），并且启用了混合的淡入淡出效果。
    this.currentAction = action;
  }

  // 复位
  teleportPlayerIfOob() {
    if (!(this.player instanceof THREE.Object3D)) return;
    if (this.player.position.z <= -25) {
      this.playerCapsule.start.set(0, 0.35, 0);
      this.playerCapsule.end.set(0, 1, 0);
      this.playerCapsule.radius = 0.35;
      this.player.position.copy(
        new THREE.Vector3().subVectors(this.playerCapsule.start, this.playerFixVector),
      );
      this.player.rotation.set(0, 0, 0);
    }
  }

  // 更新
  playerUpdate(deltaTime: number) {
    // 控制
    this.controls(deltaTime);
    // // 更新位置
    this.updatePlayer(deltaTime);
    // // 复位检测
    // this.teleportPlayerIfOob();
  }

  // 绑定事件
  keyListen = () => {
    let keyW = false;
    // 当某个键盘按下设置对应属性设置为true
    document.addEventListener('keydown', (event) => {
      if (event.code === 'KeyW') {
        this.keyStates.W = true;
        this.playerActionState.forward = 1;

        if (!keyW) {
          // keydown事件在按下按键不松时会持续激活，因此需进行状态控制，避免计时器重复计时
          this.ForwardHoldTimeClock.start();
          keyW = true;
        }
      }
      if (event.code === 'KeyA') {
        this.keyStates.A = true;
        this.playerActionState.turn = -1;
      }
      if (event.code === 'KeyS') {
        this.keyStates.S = true;
        this.playerActionState.forward = -1;
      }
      if (event.code === 'KeyD') {
        this.keyStates.D = true;
        this.playerActionState.turn = 1;
      }
      if (event.code === 'Space') {
        this.keyStates.Space = true;
      }
    });
    // 当某个键盘抬起设置对应属性设置为false
    document.addEventListener('keyup', (event) => {
      if (event.code === 'KeyW') {
        keyW = false;
        this.keyStates.W = false;
        this.playerActionState.forward = 0;
        this.ForwardHoldTimeClock.stop();
        this.ForwardHoldTimeClock.elapsedTime = 0;
      }
      if (event.code === 'KeyA') {
        this.keyStates.A = false;
        this.playerActionState.turn = 0;
      }
      if (event.code === 'KeyS') {
        this.keyStates.S = false;
        this.playerActionState.forward = 0;
      }
      if (event.code === 'KeyD') {
        this.keyStates.D = false;
        this.playerActionState.turn = 0;
      }
      if (event.code === 'Space') this.keyStates.Space = false;
    });
    // 鼠标按下时锁定禁用鼠标指针;
    // this.container.addEventListener('mousedown', (e: MouseEvent) => {
    //   // 鼠标左键被点击
    //   if (e.button == 0) {
    //     this.keyStates.leftMouseBtn = true;
    //   }
    //   this.mouseTime = performance.now();
    // });
    // 相机视角跟随鼠标旋转;
    // document.body.addEventListener('mousemove', (event) => {
    //   // 鼠标左键拖动时移动视角
    //   if (this.keyStates.leftMouseBtn) {
    //     if (this.cameraMoveSensitivity <= 0) this.cameraMoveSensitivity = 0.001;
    //     if (this.cameraMoveSensitivity > 1) this.cameraMoveSensitivity = 1;
    //     this.player.rotation.y -= event.movementX / (this.cameraMoveSensitivity * 1000);
    //     // camera.rotation.x -= event.movementY / (cameraMoveSensitivity * 1000);
    //   }
    // });
  };

  playerInit() {
    // 加载角色
    loadGltf('Xbot.glb').then((gltf: any) => {
      this.player = gltf.scene;
      this.player.rotateX(Math.PI / 2);

      scene.add(this.player);
      // this.player.position.set(10, 10, 20);
      this.player.add(this.playerColliderHelper);
      // 启用阴影
      this.player.traverse(function (object: any) {
        if (object.isMesh) object.castShadow = true;
      });
      // 关键帧动画
      const animations = gltf.animations;
      this.mixer = new THREE.AnimationMixer(this.player);

      for (let i = 0; i < animations.length; i++) {
        // agree,headShake,idle,run,sad_pose,sneak_pose,walk
        const clip = animations[i]; //休息、步行、跑步等动画的clip数据
        const action = this.mixer.clipAction(clip); //clip生成action
        action.name = clip.name; //action命名name
        // 批量设置所有动画动作的权重
        if (action.name === 'idle') {
          action.weight = 1.0; //默认播放Idle对应的休息动画
        } else {
          action.weight = 0.0; // 不设置0的话，权重相同，则所有动画会同时播放
        }
        action.play();
        // action动画动作名字作为actionObj的属性
        this.allActions[action.name] = action;
      }
      this.currentAction = this.allActions['idle'];
      // 初始化键盘事件
      this.keyListen(this.container);
    });
    this.gui.add({ colliderHelper: true }, 'colliderHelper').onChange((value) => {
      this.playerColliderHelper.visible = value;
    });

    this.gui
      .add({ cameraMoveSensitivity: this.cameraMoveSensitivity }, 'cameraMoveSensitivity')
      .step(0.1)
      .min(0)
      .max(1)
      .onChange((value) => {
        this.cameraMoveSensitivity = value;
      });
  }
}

export default Player;
