import { sizes } from './sizes';
let camera, renderer;
function resizeEvent() {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}
export function resizeEventListener(_camera, _renderer) {
  camera = _camera;
  renderer = _renderer;
  window.addEventListener('resize', resizeEvent);
}
export function clear() {
  window.removeEventListener('resize', resizeEvent);
}
