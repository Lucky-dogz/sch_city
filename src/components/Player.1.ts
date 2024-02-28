import * as THREE from 'three';
import { Octree } from 'three/examples/jsm/math/Octree';
import { Capsule } from 'three/examples/jsm/math/Capsule';
import capsuleHelper from './capsuleHelper';
import { R, H } from './player';

class Player {
  player: null;
  playerCapsule: Capsule;
  constructor() {
    this.player = null;
    this.allActions = {};
    this.currentAction = {};
    this.GRAVITY = 3;
    this.worldOctree = new Octree();
    this.R = 0.35;
    this.H = 1.85;
    this.playerCapsule = new Capsule(
      new THREE.Vector3(0, 0, R), //底部半球球心坐标
      new THREE.Vector3(0, 0, H - R), //顶部半球球心坐标
      R,
    );
    // 添加胶囊显示助手
    this.playerColliderHelper = capsuleHelper(R, H);
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

    // 按键事件状态
    this.keyStates = {
      // 使用W、A、S、D按键来控制前、后、左、右运动
      W: false,
      A: false,
      S: false,
      D: false,
      Space: false,
      leftMouseBtn: false,
    };

    // 角色运动状态
    this.playerActionState = {
      forward: 0,
      turn: 0,
    };
  }
}
