let camera, renderer;
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
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
function resizeEventListener(_camera, _renderer) {
  camera = _camera;
  renderer = _renderer;
  window.addEventListener('resize', resizeEvent);
}
function removeResizeListener() {
  window.removeEventListener('resize', resizeEvent);
}

const boardConfig = {
  cols: 800,
  rows: 800,
  nodeDimensions: {
    width: 1,
    height: 1,
  },
};

export { sizes, boardConfig, resizeEventListener, removeResizeListener };
