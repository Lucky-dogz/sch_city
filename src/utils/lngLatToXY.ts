const center = [113.03547, 23.152631]; // 原点的经纬度
const center_coord = [400, 400]; // 原点校园坐标
const _f = 6378137,
  _p = 0.017453292519943;

const center_world = lngLatToXY(center); // 原点世界坐标

// 经纬度转化为世界平面坐标
function lngLatToXY(ll: any[]) {
  let lng = ll[0]; //经度
  let lat = ll[1]; //纬度

  if (lat > 89.999999) {
    lat = 89.999999;
  } else if (lat < -89.999999) {
    lat = -89.999999;
  }
  let c = lat * _p;
  let x = lng * _p * _f;
  let y = (_f / 2) * Math.log((1 + Math.sin(c)) / (1 - Math.sin(c)));
  return [x, y];
}

// 世界平面坐标转化为学校平面坐标
function llToCoord(ll: any[]) {
  let pt = lngLatToXY(ll);
  let dx = pt[0] - center_world[0];
  let dy = pt[1] - center_world[1];
  let row, col;
  row = center_coord[0] - Math.floor(dy);
  col = center_coord[1] + Math.floor(dx);
  return {
    row,
    col,
  };
}

console.log(llToCoord([113.036247, 23.15277]));

export { llToCoord };

// const center = [113.03547, 23.152631];
// let a = lngLatToXY(center);
// let b = lngLatToXY([113.036247, 23.15277]);
// console.log(a[0] - b[0]);
// console.log(a[1] - b[1]);
