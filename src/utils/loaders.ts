import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { TextureLoader } from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

let load_gltf: GLTFLoader, load_texture: TextureLoader, load_font: FontLoader;

function initLoaders(manager: THREE.LoadingManager) {
  load_gltf = new GLTFLoader(manager).setPath('src/resources/models/');
  load_texture = new TextureLoader(manager).setPath('src/resources/textures/');
  load_font = new FontLoader(manager).setPath('src/resources/fonts/');
  //   const dracoLoader = new DRACOLoader();
  //   dracoLoader.setDecoderPath('src/resources/draco/');
  //   loader.setDRACOLoader(dracoLoader);
}

// function loadGltf(url: string) {
//   return new Promise<GLTF>((resolve, reject) => {
//     loader.load(url, function (gltf: GLTF) {
//       resolve(gltf);
//     });
//   });
// }

export { initLoaders, load_gltf, load_texture, load_font };
