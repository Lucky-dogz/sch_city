import * as THREE from 'three';

let scene = new THREE.Scene();

const createScene = () => {
  if (scene) return scene;
  scene = new THREE.Scene();
  return scene;
};

const clearScene = () => {
  scene = null;
};

export { scene, createScene, clearScene };
