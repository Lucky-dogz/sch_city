import * as TWEEN from 'three/examples/jsm/libs/tween.module.js';

export function getAllNodes(grid: [][]) {
  const nodes: [] = [];
  for (const row of grid) {
    nodes.push(...row);
  }
  return nodes;
}

export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;

  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }

  return nodesInShortestPathOrder;
}

export async function tweenToColor(node, geometry, colors, duration = 300, options?) {
  for (let i = 0; i < colors.length; i++) {
    new TWEEN.Tween(node.faces[1].color)
      .to(colors[i], duration)
      .onUpdate(() => {
        geometry.colorsNeedUpdate = true;
      })
      .delay(i * 200)
      .start();
    new TWEEN.Tween(node.faces[2].color)
      .to(colors[i], duration)
      .onUpdate(() => {
        geometry.colorsNeedUpdate = true;
      })
      .delay(i * 200)
      .start();
  }

  if (options) {
    if (options.position) {
      var facesIndices = ['a', 'b', 'c'];
      facesIndices.forEach(function (indices) {
        new TWEEN.Tween(geometry.vertices[node.faces[1][indices]])
          .to({ y: 0.5 }, duration)
          .onUpdate(() => {
            geometry.verticesNeedUpdate = true;
          })
          .start();
        new TWEEN.Tween(geometry.vertices[node.faces[2][indices]])
          .to({ y: 0.5 }, duration)
          .onUpdate(() => {
            geometry.verticesNeedUpdate = true;
          })
          .start();
      });
      facesIndices.forEach(function (indices) {
        new TWEEN.Tween(geometry.vertices[node.faces[1][indices]])
          .to({ y: 0 }, duration)
          .onUpdate(() => {
            geometry.verticesNeedUpdate = true;
          })
          .delay(100)
          .start();
        new TWEEN.Tween(geometry.vertices[node.faces[2][indices]])
          .to({ y: 0 }, duration)
          .onUpdate(() => {
            geometry.verticesNeedUpdate = true;
          })
          .delay(100)
          .start();
      });
    }
  }
}
