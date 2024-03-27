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
    nodesInShortestPathOrder.unshift({
      row: currentNode.row,
      col: currentNode.col,
      direction: currentNode.direction,
    });
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

// 计算路线距离
export function getDistanceFromPath(path: []) {
  let len = 0;
  path.forEach((item) => {
    if (item.direction.includes('-')) {
      len += Number(Math.sqrt(2).toFixed(2));
    } else {
      ++len;
    }
  });
  return path.length;
}

function lerp(a, b, t) {
  return a * (1 - t) + b * t;
}

// 插值
export function smoothPath1(path, stepsPerSegment = 5) {
  const smoothedPath = [];
  for (let i = 0; i < path.length - 1; i++) {
    const segmentStart = path[i];
    const segmentEnd = path[i + 1];

    for (let t = 0; t <= 1; t += 1 / stepsPerSegment) {
      const x = lerp(segmentStart.x, segmentEnd.x, t);
      const z = lerp(segmentStart.z, segmentEnd.z, t);
      smoothedPath.push({ x, z });
    }
  }

  // 不要忘记添加路径的最后一个点
  smoothedPath.push(path[path.length - 1]);

  return smoothedPath;
}

// 贝塞尔曲线
export function smoothPathWithBezier(path, numSegments = 10) {
  const smoothedPath = [];
  const step = 1 / numSegments;

  for (let i = 0; i < path.length - 4; i++) {
    const p0 = path[i];
    const p3 = path[i + 4];
    const p1 = { x: (p0.x + p3.x) / 2, z: (p0.z + p3.z) / 2 };
    const p2 = { x: (p0.x + 2 * p1.x + p3.x) / 4, z: (p0.z + 2 * p1.z + p3.z) / 4 };

    for (let t = 0; t <= 1; t += step) {
      const x =
        Math.pow(1 - t, 3) * p0.x +
        3 * Math.pow(1 - t, 2) * t * p1.x +
        3 * (1 - t) * Math.pow(t, 2) * p2.x +
        Math.pow(t, 3) * p3.x;
      const z =
        Math.pow(1 - t, 3) * p0.z +
        3 * Math.pow(1 - t, 2) * t * p1.z +
        3 * (1 - t) * Math.pow(t, 2) * p2.z +
        Math.pow(t, 3) * p3.z;

      smoothedPath.push({ x, z });
    }
  }

  // 添加最后一个点
  smoothedPath.push(path[path.length - 1]);

  return smoothedPath;
}

// 定义三次贝塞尔曲线的函数
function cubicBezier(p0, p1, p2, p3, t) {
  var cX = 3 * (p1.x - p0.x),
    bX = 3 * (p2.x - p1.x) - cX,
    aX = p3.x - p0.x - cX - bX;

  var cY = 3 * (p1.z - p0.z),
    bY = 3 * (p2.z - p1.z) - cY,
    aY = p3.z - p0.z - cY - bY;

  var x = aX * Math.pow(t, 3) + bX * Math.pow(t, 2) + cX * t + p0.x;
  var z = aY * Math.pow(t, 3) + bY * Math.pow(t, 2) + cY * t + p0.z;

  return { x: x, z: z };
}

// 将路径点数组转换为贝塞尔曲线的点数组
export function smoothPath(points) {
  var smoothedPath = [];

  for (var i = 0; i < points.length - 3; i++) {
    var p0 = i === 0 ? points[i] : points[i - 1];
    var p1 = points[i];
    var p2 = points[i + 3];
    var p3 = i === points.length - 2 ? points[i + 1] : points[i + 2];

    for (var t = 0; t <= 1; t += 0.1) {
      // 步长可调整
      var point = cubicBezier(p0, p1, p2, p3, t);
      smoothedPath.push(point);
    }
  }

  return smoothedPath;
}
