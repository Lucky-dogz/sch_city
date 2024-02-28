import { PerspectiveCamera, Vector3 } from 'three';
import size from '@/config/size';
import { gui, debugObject } from '@/components/common/gui';

function createCamera() {
  const camera = new PerspectiveCamera(70, size.width / size.height, 0.1, 1000);
  camera.rotation.order = 'YXZ';
  const PerspectiveVectors = {
    first: new Vector3(0, 1.7, 0.3),
    third: new Vector3(0, 2, -2),
  };
  camera.position.copy(PerspectiveVectors.third);
  camera.lookAt(0, 1, 0);
  debugObject.firstView = false;
  gui.add(debugObject, 'firstView').onChange(() => {
    if (debugObject.firstView) {
      camera.position.copy(PerspectiveVectors.first);
    } else {
      camera.position.copy(PerspectiveVectors.third);
    }
  });
  return camera;
}
export { createCamera };
