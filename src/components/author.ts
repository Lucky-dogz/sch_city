import { load_font } from '@/utils/loaders';
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { Font } from 'three/examples/jsm/loaders/FontLoader';

let authorMesh, textMesh2, textGeo, materials: THREE.MeshPhongMaterial[];

let text = 'three.js',
  bevelEnabled = true,
  font: Font | undefined,
  fontName = 'optimer', // helvetiker, optimer, gentilis, droid sans, droid serif
  fontWeight = 'regular'; // normal bold
const height = 4,
  size = 10,
  curveSegments = 12,
  bevelThickness = 2,
  bevelSize = 1;

const mirror = false;

const fontMap = {
  helvetiker: 0,
  optimer: 1,
  gentilis: 2,
  'droid/droid_sans': 3,
  'droid/droid_serif': 4,
};

const weightMap = {
  regular: 0,
  bold: 1,
};

const reverseFontMap = [];
const reverseWeightMap = [];

for (const i in fontMap) reverseFontMap[fontMap[i]] = i;
for (const i in weightMap) reverseWeightMap[weightMap[i]] = i;

materials = [
  new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
  new THREE.MeshPhongMaterial({ color: 0xffffff }), // side
];

function loadFont() {
  load_font.load(fontName + '_' + fontWeight + '.typeface.json', function (response) {
    font = response;
  });
}

function createText() {
  textGeo = new TextGeometry(text, {
    font: font!,
    size: size,
    height: height,
    curveSegments: curveSegments,
    bevelThickness: bevelThickness,
    bevelSize: bevelSize,
    bevelEnabled: bevelEnabled,
  });

  //   文字
  authorMesh = new THREE.Mesh(textGeo, materials);

  authorMesh.rotation.x = 0;
  authorMesh.rotation.y = Math.PI * 2;

  //   镜像
  if (mirror) {
    textMesh2 = new THREE.Mesh(textGeo, materials);
    textMesh2.position.x = centerOffset;
    textMesh2.position.y = -hover;
    textMesh2.position.z = height;
    textMesh2.rotation.x = Math.PI;
    textMesh2.rotation.y = Math.PI * 2;
  }
  authorMesh.rotateX(-Math.PI / 2);
  //   authorMesh.rotateZ(Math.PI / 2);
  return authorMesh;
}

export { createText, loadFont };
