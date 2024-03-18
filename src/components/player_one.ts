import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
let pointerControls: PointerLockControls;
let collidableObjects: any;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;
let cameraY = 3;
let raycaster;
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
let playerPos = new THREE.Vector3(50, 2, -70);

function initPlayer(scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.Renderer) {
  pointerControls = new PointerLockControls(camera, renderer.domElement);

  // 点击解锁
  pointerControls.addEventListener('lock', function () {
    console.log('Pointer Locked');
  });

  // esc暂停
  pointerControls.addEventListener('unlock', function () {
    console.log('Pointer Unlocked');
  });

  const onKeyDown = function (event: KeyboardEvent) {
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        moveForward = true;
        break;
      case 'ArrowLeft':
      case 'KeyA':
        moveLeft = true;
        break;
      case 'ArrowDown':
      case 'KeyS':
        moveBackward = true;
        break;
      case 'ArrowRight':
      case 'KeyD':
        moveRight = true;
        break;
      case 'Space':
        if (canJump === true) velocity.y += 50;
        canJump = false;
        break;
    }
  };

  const onKeyUp = function (event: KeyboardEvent) {
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        moveForward = false;
        break;

      case 'ArrowLeft':
      case 'KeyA':
        moveLeft = false;
        break;

      case 'ArrowDown':
      case 'KeyS':
        moveBackward = false;
        break;

      case 'ArrowRight':
      case 'KeyD':
        moveRight = false;
        break;
    }
  };

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
  scene.add(pointerControls.getObject());

  raycaster = new THREE.Raycaster(
    new THREE.Vector3(),
    new THREE.Vector3(0, -1, 0),
    0,
    10,
  );
}

function aupdatePlayer(delta: number) {
  if (pointerControls.isLocked === true) {
    raycaster.ray.origin.copy(pointerControls.getObject().position);
    // raycaster.ray.origin.y -= 10;
    const intersections = raycaster.intersectObjects([], false);
    const onObject = intersections.length > 0;

    // const delta = (time - prevTime) / 1000;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;
    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize(); // this ensures consistent movements in all directions

    if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

    if (onObject === true) {
      velocity.y = Math.max(0, velocity.y);
      canJump = true;
    }
    // console.log('-velocity.x * delta', -velocity.x * delta);
    // console.log('-velocity.z * delta', -velocity.z * delta);
    pointerControls.moveRight(-velocity.x * delta);
    pointerControls.moveForward(-velocity.z * delta);
    pointerControls.getObject().position.y += velocity.y * delta; // new behavior
    // console.log(pointerControls.getObject().position);

    if (pointerControls.getObject().position.y < cameraY) {
      velocity.y = 0;
      pointerControls.getObject().position.y = cameraY;
      canJump = true;
    }
  }
}

// 更新player
function updatePlayer(delta: number) {
  let playerSpeed = 300;
  // 惯性减速
  velocity.x -= velocity.x * 10.0 * delta;
  velocity.z -= velocity.z * 10.0 * delta;
  if (detectPlayerCollision() == false) {
    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize(); // this ensures consistent movements in all directions

    if (moveForward || moveBackward) velocity.z -= direction.z * playerSpeed * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * playerSpeed * delta;

    // 平行于xz平面，向侧面移动摄像机。
    pointerControls.moveRight(-velocity.x * delta);
    // 平行于xz平面，向前移动摄像机
    pointerControls.moveForward(-velocity.z * delta);
  } else {
    velocity.x = 0;
    velocity.z = 0;
  }

  velocity.y -= 9.8 * 50.0 * delta; // 50.0 = mass
  if (detectOnObject()) {
    velocity.y = Math.max(0, velocity.y);
    canJump = true;
  }
  pointerControls.getObject().position.y += velocity.y * delta;

  if (pointerControls.getObject().position.y < cameraY) {
    velocity.y = 0;
    pointerControls.getObject().position.y = cameraY;
    canJump = true;
  }
}

// 检查碰撞
function detectPlayerCollision() {
  let rotationMatrix;
  // Get direction of camera
  let cameraDirection = pointerControls.getDirection(new THREE.Vector3(0, 0, 0)).clone();
  let collisionDistance = 0.5;

  // Check which direction we're moving (not looking)
  // Flip matrix to that direction so that we can reposition the ray
  if (moveBackward) {
    rotationMatrix = new THREE.Matrix4();
    rotationMatrix.makeRotationY(degreesToRadians(180));
  } else if (moveLeft) {
    rotationMatrix = new THREE.Matrix4();
    rotationMatrix.makeRotationY(degreesToRadians(90));
  } else if (moveRight) {
    rotationMatrix = new THREE.Matrix4();
    rotationMatrix.makeRotationY(degreesToRadians(270));
  }

  // Player is not moving forward, apply rotation matrix needed
  if (rotationMatrix !== undefined) {
    cameraDirection.applyMatrix4(rotationMatrix);
  }

  // Apply ray to player camera
  let rayCaster = new THREE.Raycaster(
    pointerControls.getObject().position,
    cameraDirection,
  );

  // If our ray hit a collidable object, return true
  if (rayIntersect(rayCaster, collisionDistance)) {
    return true;
  } else {
    return false;
  }
}

// 检查是否在物体上方
function detectOnObject() {
  let collisionDistance = cameraY;
  let rayCaster = new THREE.Raycaster(
    pointerControls.getObject().position,
    new THREE.Vector3(0, -1, 0),
  );
  // rayCaster.ray.origin.y -= cameraY;
  if (rayIntersect(rayCaster, collisionDistance)) {
    return true;
  } else {
    return false;
  }
}

// 射线检测
function rayIntersect(ray: THREE.Raycaster, distance: any) {
  var intersects = ray.intersectObjects(collidableObjects);
  for (var i = 0; i < intersects.length; i++) {
    if (intersects[i].distance < distance) {
      return true;
    }
  }
  return false;
}

// 角度转弧度
function degreesToRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

function getPointerControl() {
  return pointerControls;
}

// 初始化碰撞集合
function initCollidableObjects(buildings: THREE.Scene) {
  collidableObjects = buildings;
}

// 获取当前玩家位置
function getPlayerPos() {
  return playerPos;
}

function setPlayerPos() {
  playerPos = pointerControls.getObject().position.clone();
}

export {
  updatePlayer,
  initPlayer,
  getPointerControl,
  initCollidableObjects,
  getPlayerPos,
  setPlayerPos,
};
