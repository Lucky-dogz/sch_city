import _, { has } from 'lodash';

// 初始节点
// const test = {
//   "id": 30,
//   "row": 1,
//   "col": 0,
//   "status": "default",
//   "distance": Infinity,
//   "totalDistance": Infinity,
//   "heuristicDistance": null,
//   "direction": null,
//   "weight": 0,
//   "previousNode": null
// }

// A * 算法
export function astar(grid, start, target, close_set) {
  // Initialze nodes
  start.distance = 0;
  start.direction = 'right';
  start.totalDistance = 0;

  let open_set = [start];
  while (open_set.length) {
    let currentNode = getClosetNode(open_set);
    if (currentNode.distance === Infinity) return false;
    currentNode.status = 'visited';
    close_set.push(currentNode);

    if (currentNode.id === target.id) return 'success!';

    let neighbors = getNeighbors(currentNode, grid);
    open_set.push(...neighbors);
    // console.log('hasChanged', _.cloneDeep(hasChanged));
    open_set = open_set.filter(
      (neighbor) => neighbor.status !== 'visited' && neighbor.status !== 'wall',
    );
    updateNeighbors(currentNode, neighbors, target);
  }
  return false;
}

// 获取最近节点
function getClosetNode(open_set: any[]) {
  let currentClosest, index;
  for (let i = 0; i < open_set.length; i++) {
    if (!currentClosest || currentClosest.totalDistance > open_set[i].totalDistance) {
      currentClosest = open_set[i];
      index = i;
    } else if (currentClosest.totalDistance === open_set[i].totalDistance) {
      if (currentClosest.heuristicDistance > open_set[i].heuristicDistance) {
        currentClosest = open_set[i];
        index = i;
      }
    }
  }
  open_set.splice(index!, 1);
  return currentClosest;
}

function updateNeighbors(node, neighbors, target) {
  for (let neighbor of neighbors) {
    updateNode(node, neighbor, target);
  }
}

// 更新节点
function updateNode(currentNode, targetNode, actualTargetNode?) {
  let distance = getDistance(currentNode, targetNode);
  let distanceToCompare;
  // 启发式函数为求曼哈顿距离
  if (!targetNode.heuristicDistance) {
    targetNode.heuristicDistance = diagonalDistance(targetNode, actualTargetNode);
  }
  distanceToCompare = currentNode.distance + targetNode.weight + distance[0];

  if (distanceToCompare < targetNode.distance) {
    targetNode.distance = distanceToCompare;
    targetNode.previousNode = currentNode;
    targetNode.path = distance[1];
    targetNode.direction = distance[2];
    // f(n) = g(n) + h(n)
    targetNode.totalDistance = targetNode.distance + targetNode.heuristicDistance;
  }
}

// 获取邻近节点
function getNeighbors(node, grid) {
  let neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  // 右上对角
  if (row > 0 && col < grid[0].length - 1) neighbors.push(grid[row - 1][col + 1]);
  // 左上对角
  if (row > 0 && col > 0) neighbors.push(grid[row - 1][col - 1]);
  // 右下对角
  if (row < grid.length - 1 && col < grid[0].length - 1)
    neighbors.push(grid[row + 1][col + 1]);
  // 左下对角
  if (row < grid.length - 1 && col > 0) neighbors.push(grid[row + 1][col - 1]);

  return neighbors.filter(
    (neighbor) => neighbor.status !== 'visited' && neighbor.status !== 'wall',
  );
}

function getDistance(nodeOne, nodeTwo) {
  let x1 = nodeOne.row;
  let y1 = nodeOne.col;
  let x2 = nodeTwo.row;
  let y2 = nodeTwo.col;
  // 邻居点在其上边
  if (x2 < x1 && y1 === y2) {
    if (nodeOne.direction === 'up') {
      return [1, ['f'], 'up'];
    } else if (nodeOne.direction === 'right') {
      return [2, ['l', 'f'], 'up'];
    } else if (nodeOne.direction === 'left') {
      return [2, ['r', 'f'], 'up'];
    } else if (nodeOne.direction === 'down') {
      return [3, ['r', 'r', 'f'], 'up'];
    } else if (nodeOne.direction === 'up-right') {
      return [1.5, null, 'up'];
    } else if (nodeOne.direction === 'down-right') {
      return [2.5, null, 'up'];
    } else if (nodeOne.direction === 'up-left') {
      return [1.5, null, 'up'];
    } else if (nodeOne.direction === 'down-left') {
      return [2.5, null, 'up'];
    }
  }
  // 邻居点在其下边
  else if (x2 > x1 && y1 === y2) {
    if (nodeOne.direction === 'up') {
      return [3, ['r', 'r', 'f'], 'down'];
    } else if (nodeOne.direction === 'right') {
      return [2, ['r', 'f'], 'down'];
    } else if (nodeOne.direction === 'left') {
      return [2, ['l', 'f'], 'down'];
    } else if (nodeOne.direction === 'down') {
      return [1, ['f'], 'down'];
    } else if (nodeOne.direction === 'up-right') {
      return [2.5, null, 'down'];
    } else if (nodeOne.direction === 'down-right') {
      return [1.5, null, 'down'];
    } else if (nodeOne.direction === 'up-left') {
      return [2.5, null, 'down'];
    } else if (nodeOne.direction === 'down-left') {
      return [1.5, null, 'down'];
    }
  }
  // 邻居点在其左边
  else if (y2 < y1 && x1 === x2) {
    if (nodeOne.direction === 'up') {
      return [2, ['l', 'f'], 'left'];
    } else if (nodeOne.direction === 'right') {
      return [3, ['l', 'l', 'f'], 'left'];
    } else if (nodeOne.direction === 'left') {
      return [1, ['f'], 'left'];
    } else if (nodeOne.direction === 'down') {
      return [2, ['r', 'f'], 'left'];
    } else if (nodeOne.direction === 'up-right') {
      return [2.5, null, 'left'];
    } else if (nodeOne.direction === 'down-right') {
      return [2.5, null, 'left'];
    } else if (nodeOne.direction === 'up-left') {
      return [1.5, null, 'left'];
    } else if (nodeOne.direction === 'down-left') {
      return [1.5, null, 'left'];
    }
  }
  // 邻居点在其右边
  else if (y2 > y1 && x1 === x2) {
    if (nodeOne.direction === 'up') {
      return [2, ['r', 'f'], 'right'];
    } else if (nodeOne.direction === 'right') {
      return [1, ['f'], 'right'];
    } else if (nodeOne.direction === 'left') {
      return [3, ['r', 'r', 'f'], 'right'];
    } else if (nodeOne.direction === 'down') {
      return [2, ['l', 'f'], 'right'];
    } else if (nodeOne.direction === 'up-right') {
      return [1.5, null, 'right'];
    } else if (nodeOne.direction === 'down-right') {
      return [1.5, null, 'right'];
    } else if (nodeOne.direction === 'up-left') {
      return [2.5, null, 'right'];
    } else if (nodeOne.direction === 'down-left') {
      return [2.5, null, 'right'];
    }
  }
  // 左上
  else if (x2 < x1 && y1 > y2) {
    if (nodeOne.direction === 'up') {
      return [1.5, null, 'up-left'];
    } else if (nodeOne.direction === 'right') {
      return [2.5, null, 'up-left'];
    } else if (nodeOne.direction === 'left') {
      return [1.5, null, 'up-left'];
    } else if (nodeOne.direction === 'down') {
      return [2.5, null, 'up-left'];
    } else if (nodeOne.direction === 'up-right') {
      return [2, null, 'up-left'];
    } else if (nodeOne.direction === 'down-right') {
      return [3, null, 'up-left'];
    } else if (nodeOne.direction === 'up-left') {
      return [1, null, 'up-left'];
    } else if (nodeOne.direction === 'down-left') {
      return [2, null, 'up-left'];
    }
  }
  // 右上
  else if (x2 < x1 && y1 < y2) {
    if (nodeOne.direction === 'up') {
      return [1.5, null, 'up-right'];
    } else if (nodeOne.direction === 'right') {
      return [1.5, null, 'up-right'];
    } else if (nodeOne.direction === 'left') {
      return [2.5, null, 'up-right'];
    } else if (nodeOne.direction === 'down') {
      return [2.5, null, 'up-right'];
    } else if (nodeOne.direction === 'up-right') {
      return [1, null, 'up-right'];
    } else if (nodeOne.direction === 'down-right') {
      return [2, null, 'up-right'];
    } else if (nodeOne.direction === 'up-left') {
      return [2, null, 'up-right'];
    } else if (nodeOne.direction === 'down-left') {
      return [3, null, 'up-right'];
    }
  }
  // 左下
  else if (x2 > x1 && y1 > y2) {
    if (nodeOne.direction === 'up') {
      return [2.5, null, 'down-left'];
    } else if (nodeOne.direction === 'right') {
      return [2.5, null, 'down-left'];
    } else if (nodeOne.direction === 'left') {
      return [1.5, null, 'down-left'];
    } else if (nodeOne.direction === 'down') {
      return [1.5, null, 'down-left'];
    } else if (nodeOne.direction === 'up-right') {
      return [3, null, 'down-left'];
    } else if (nodeOne.direction === 'down-right') {
      return [2, null, 'down-left'];
    } else if (nodeOne.direction === 'up-left') {
      return [2, null, 'down-left'];
    } else if (nodeOne.direction === 'down-left') {
      return [1, null, 'down-left'];
    }
  }
  // 右下
  else if (x2 > x1 && y1 < y2) {
    if (nodeOne.direction === 'up') {
      return [2.5, null, 'down-right'];
    } else if (nodeOne.direction === 'right') {
      return [1.5, null, 'down-right'];
    } else if (nodeOne.direction === 'left') {
      return [2.5, null, 'down-right'];
    } else if (nodeOne.direction === 'down') {
      return [1.5, null, 'down-right'];
    } else if (nodeOne.direction === 'up-right') {
      return [2, null, 'down-right'];
    } else if (nodeOne.direction === 'down-right') {
      return [1, null, 'down-right'];
    } else if (nodeOne.direction === 'up-left') {
      return [3, null, 'down-right'];
    } else if (nodeOne.direction === 'down-left') {
      return [2, null, 'down-right'];
    }
  }
}

// 获取曼哈顿距离
function manhattanDistance(nodeOne, nodeTwo) {
  let nodeOneCoordinates = [nodeOne.row, nodeOne.col];
  let nodeTwoCoordinates = [nodeTwo.row, nodeTwo.col];
  let xChange = Math.abs(nodeOneCoordinates[0] - nodeTwoCoordinates[0]);
  let yChange = Math.abs(nodeOneCoordinates[1] - nodeTwoCoordinates[1]);
  return xChange + yChange;
}

// 获取对角距离
function diagonalDistance(nodeOne, nodeTwo) {
  let nodeOneCoordinates = [nodeOne.row, nodeOne.col];
  let nodeTwoCoordinates = [nodeTwo.row, nodeTwo.col];
  let dx = Math.abs(nodeOneCoordinates[0] - nodeTwoCoordinates[0]);
  let dy = Math.abs(nodeOneCoordinates[1] - nodeTwoCoordinates[1]);
  return dx + dy + (Math.sqrt(2) - 2) * Math.min(dx, dy);
}
