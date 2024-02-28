import * as THREE from 'three';

/**
 *
 * @param {number} R 半径
 * @param {number} H 高度
 * @returns CapsuleHelper
 */
export default function capsuleHelper(R: number, H: number) {
  const group = new THREE.Group();
  const material = new THREE.MeshLambertMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.5,
  });
  // 底部半球
  const geometry = new THREE.SphereGeometry(R, 25, 25, 0, 2 * Math.PI, 0, Math.PI / 2);
  geometry.rotateX(Math.PI);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = R;
  group.add(mesh);
  // 顶部半球
  const geometry2 = new THREE.SphereGeometry(R, 25, 25, 0, 2 * Math.PI, 0, Math.PI / 2);
  const mesh2 = new THREE.Mesh(geometry2, material);
  mesh2.position.set(0, H - R, 0);
  group.add(mesh2);
  // 中间圆柱
  const h = H - 2 * R;
  const geometry3 = new THREE.CylinderGeometry(R, R, h, 32, 1, true);
  geometry3.translate(0, h / 2 + R, 0);
  const mesh3 = new THREE.Mesh(geometry3, material);
  group.add(mesh3);
  return group;
}
