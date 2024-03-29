const center = [113.03547, 23.152631]; // 原点的wgs84经纬度
// const center = [113.04189511265, 23.158959101663]; // 原点的BD09经纬度
const center_coord = [400, 400]; // 原点校园坐标
const _f = 6378137; // WGS84椭球体的长半轴的近似值
const _p = 0.017453292519943; // 弧度转换因子，约为 π / 180。
const center_world = lngLatToXY(center); // 原点wgs84墨卡托
// const center_world = [12584503.328149, 2633989.4922906]; // 原点BD09墨卡托
// const center_world = [12583903.125527, 2634297.5332968];
// 经纬度转化为墨卡托平面坐标
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

// wgs84墨卡托转为学校平面坐标
function llToCoord2(ll: any[]) {
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

// BD09墨卡托转为学校平面坐标
function llToCoord(ll: any[]) {
  let dx = ll[0] - center_world[0];
  let dy = ll[1] - center_world[1];
  let row, col;
  row = center_coord[0] - Math.floor(dy);
  col = center_coord[1] + Math.floor(dx);
  return {
    row,
    col,
  };
}

export { llToCoord, llToCoord2 };
