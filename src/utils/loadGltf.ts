import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { LoadingManager } from 'three';

let loader = null;

function creatLoader(manager: LoadingManager) {
  loader = new GLTFLoader(manager).setPath('src/resources/models/');
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('src/resources/draco/');
  loader.setDRACOLoader(dracoLoader);
  return loader;
}

function loadGltf(url: string) {
  return new Promise<Object>((resolve, reject) => {
    loader.load(url, function (gltf) {
      resolve(gltf);
    });
  });
}

export { loadGltf, loader, creatLoader };
