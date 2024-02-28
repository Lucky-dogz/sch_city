export function clearRenderer(renderer: any) {
  renderer.dispose();
  renderer.forceContextLoss();
  renderer.context = null;
  renderer.domElement = null;
  renderer = null;
}
