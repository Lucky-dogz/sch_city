export interface Build {
  name: string;
  type: string;
  coordinate: {
    row: number;
    col: number;
  };
}

const build_data: Build[] = [
  {
    name: '学生公寓A',
    type: 'dorm',
    coordinate: {
      row: 370,
      col: 481,
    },
  },
  {
    name: '学生公寓B',
    type: 'dorm',
    coordinate: {
      row: 282,
      col: 483,
    },
  },
  {
    name: '学生公寓C',
    type: 'dorm',
    coordinate: {
      row: 220,
      col: 501,
    },
  },
  {
    name: '学生公寓D',
    type: 'dorm',
    coordinate: {
      row: 228,
      col: 500,
    },
  },
  {
    name: '学生公寓E',
    type: 'dorm',
    coordinate: {
      row: 150,
      col: 501,
    },
  },
  {
    name: '学生公寓F',
    type: 'dorm',
    coordinate: {
      row: 196,
      col: 515,
    },
  },
  {
    name: '教工公寓',
    type: 'dorm',
    coordinate: {
      row: 158,
      col: 625,
    },
  },
  {
    name: '学生公寓G',
    type: 'dorm',
    coordinate: {
      row: 130,
      col: 658,
    },
  },
  {
    name: '学生公寓H',
    type: 'dorm',
    coordinate: {
      row: 158,
      col: 658,
    },
  },
  {
    name: '南门保安亭',
    type: 'safe',
    coordinate: {
      row: 640,
      col: 374,
    },
  },
  {
    name: '北门保安亭',
    type: 'safe',
    coordinate: {
      row: 0,
      col: 0,
    },
  },
  {
    name: '篮球场',
    type: 'sport',
    coordinate: {
      row: 0,
      col: 0,
    },
  },
  {
    name: '羽毛球馆',
    type: 'sport',
    coordinate: {
      row: 0,
      col: 0,
    },
  },
  {
    name: '体育馆',
    type: 'sport',
    coordinate: {
      row: 0,
      col: 0,
    },
  },
  {
    name: '网球场',
    type: 'sport',
    coordinate: {
      row: 0,
      col: 0,
    },
  },
  {
    name: '新楼',
    type: 'study',
    coordinate: {
      row: 0,
      col: 0,
    },
  },
  {
    name: '乒乓球馆',
    type: 'sport',
    coordinate: {
      row: 0,
      col: 0,
    },
  },
  {
    name: '操场',
    type: 'sport',
    coordinate: {
      row: 0,
      col: 0,
    },
  },
  {
    name: '综合楼',
    type: 'study',
    coordinate: {
      row: 519,
      col: 238,
    },
  },
  {
    name: '软件学院',
    type: 'study',
    coordinate: {
      row: 615,
      col: 255,
    },
  },
  {
    name: '北斗研究院',
    type: 'study',
    coordinate: {
      row: 442,
      col: 345,
    },
  },
  {
    name: '图书馆',
    type: 'library',
    coordinate: {
      row: 412,
      col: 220,
    },
  },
  {
    name: '会议圆厅',
    type: 'meeting',
    coordinate: {
      row: 415,
      col: 405,
    },
  },
  {
    name: '信息楼',
    type: 'study',
    coordinate: {
      row: 414,
      col: 312,
    },
  },
  {
    name: '教学楼_A',
    type: 'study',
    coordinate: {
      row: 0,
      col: 0,
    },
  },
  {
    name: '教学楼_B',
    type: 'study',
    coordinate: {
      row: 0,
      col: 0,
    },
  },
  {
    name: '教学楼_C',
    type: 'study',
    coordinate: {
      row: 0,
      col: 0,
    },
  },
  {
    name: '停车棚',
    type: 'public',
    coordinate: {
      row: 445,
      col: 415,
    },
  },
  {
    name: '学术活动中心',
    type: 'dorm',
    coordinate: {
      row: 408,
      col: 483,
    },
  },
  {
    name: '学术交流中心A座',
    type: 'dorm',
    coordinate: {
      row: 198,
      col: 668,
    },
  },
  {
    name: '学术交流中心B座',
    type: 'dorm',
    coordinate: {
      row: 392,
      col: 590,
    },
  },
  {
    name: '熹园',
    type: 'food',
    coordinate: {
      row: 385,
      col: 481,
    },
  },
  {
    name: '商业街',
    type: 'play',
    coordinate: {
      row: 290,
      col: 483,
    },
  },
];

const buildNameMap = new Map();

build_data.forEach((obj) => {
  buildNameMap.set(obj.name, 1);
});

const search_build = (keyword: string) => {
  return build_data.filter((item) => {
    // 使用正则表达式进行模糊搜索
    const regex = new RegExp(keyword, 'gi');
    return regex.test(item.name);
  });
};

export { build_data, buildNameMap, search_build };
