import beidou from '../../public/beidou.jpeg';

export interface Build {
  name: string;
  type: string;
  id?: number;
  position?: THREE.Vector3;
  element?: any;
  coordinate: {
    row: number;
    col: number;
  };
  info: {
    timeLimit?: string;
    photo?: string[];
    tips?: string[];
    brief?: string;
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
    info: {
      timeLimit: '08:00-22:00',
      photo: [beidou],
      tips: ['女生宿舍', '6层', '一楼提供贩卖机', '小猫出没'],
      brief: '外卖需要去G座一楼拿，宿管阿姨人很nice😄',
    },
  },
  {
    name: '学生公寓B',
    type: 'dorm',
    coordinate: {
      row: 282,
      col: 483,
    },
    info: {
      timeLimit: '08:00-22:00',
      photo: [beidou],
      tips: ['女生宿舍', '6层', '一楼提供贩卖机', '小猫出没'],
      brief: '外卖需要去G座一楼拿，宿管阿姨人很nice😄',
    },
  },
  {
    name: '学生公寓C',
    type: 'dorm',
    coordinate: {
      row: 220,
      col: 501,
    },
    info: {
      timeLimit: '08:00-22:00',
      photo: [beidou],
      tips: ['女生宿舍', '6层', '一楼提供贩卖机', '小猫出没'],
      brief: '外卖需要去G座一楼拿，宿管阿姨人很nice😄',
    },
  },
  {
    name: '学生公寓D',
    type: 'dorm',
    coordinate: {
      row: 228,
      col: 500,
    },
    info: {
      timeLimit: '08:00-22:00',
      photo: [beidou],
      tips: ['女生宿舍', '6层', '一楼提供贩卖机', '小猫出没'],
      brief: '外卖需要去G座一楼拿，宿管阿姨人很nice😄',
    },
  },
  {
    name: '学生公寓E',
    type: 'dorm',
    coordinate: {
      row: 150,
      col: 501,
    },
    info: {
      timeLimit: '08:00-22:00',
      photo: [beidou],
      tips: ['6层', '一楼提供贩卖机', '小猫出没'],
      brief: '外卖需要去G座一楼拿，宿管阿姨人很nice😄',
    },
  },
  {
    name: '学生公寓F',
    type: 'dorm',
    coordinate: {
      row: 196,
      col: 515,
    },
    info: {
      timeLimit: '08:00-22:00',
      photo: [beidou],
      tips: ['6层', '一楼提供贩卖机', '小猫出没'],
      brief: '外卖需要去G座一楼拿，宿管阿姨人很nice😄',
    },
  },
  {
    name: '教工公寓(25号楼)/菜鸟驿站',
    type: 'dorm',
    coordinate: {
      row: 158,
      col: 625,
    },
    info: {
      timeLimit: '08:00-22:00',
      photo: [beidou],
      tips: ['6层', '一楼提供贩卖机', '小猫出没'],
      brief: '外卖需要去G座一楼拿，宿管阿姨人很nice😄',
    },
  },
  {
    name: '学生公寓G',
    type: 'dorm',
    coordinate: {
      row: 130,
      col: 658,
    },
    info: {
      timeLimit: '08:00-22:00',
      photo: [beidou],
      tips: ['6层', '一楼提供贩卖机', '小猫出没'],
      brief: '外卖需要去G座一楼拿，宿管阿姨人很nice😄',
    },
  },
  {
    name: '学生公寓H',
    type: 'dorm',
    coordinate: {
      row: 158,
      col: 658,
    },
    info: {
      timeLimit: '08:00-22:00',
      photo: [beidou],
      tips: ['6层', '一楼提供贩卖机', '小猫出没'],
      brief: '外卖需要去G座一楼拿，宿管阿姨人很nice😄',
    },
  },
  {
    name: '南门保安亭',
    type: 'safe',
    coordinate: {
      row: 640,
      col: 374,
    },
    info: {
      timeLimit: '08:00-22:00',
      photo: [beidou],
      tips: ['6层', '一楼提供贩卖机', '小猫出没'],
      brief: '外卖需要去G座一楼拿，宿管阿姨人很nice😄',
    },
  },
  {
    name: '北门保安亭',
    type: 'safe',
    coordinate: {
      row: 118,
      col: 417,
    },
    info: {
      timeLimit: '08:00-22:00',
      photo: [beidou],
      tips: ['6层', '一楼提供贩卖机', '小猫出没'],
      brief: '外卖需要去G座一楼拿，宿管阿姨人很nice😄',
    },
  },
  {
    name: '篮球场',
    type: 'sport',
    coordinate: {
      row: 209,
      col: 362,
    },
    info: {
      timeLimit: '08:00-22:00',
      photo: [beidou],
      tips: ['6层', '一楼提供贩卖机', '小猫出没'],
      brief: '外卖需要去G座一楼拿，宿管阿姨人很nice😄',
    },
  },
  {
    name: '羽毛球馆',
    type: 'sport',
    coordinate: {
      row: 124,
      col: 388,
    },
    info: {
      timeLimit: '08:00-22:00',
      photo: [beidou],
      tips: ['6层', '一楼提供贩卖机', '小猫出没'],
      brief: '外卖需要去G座一楼拿，宿管阿姨人很nice😄',
    },
  },
  {
    name: '体育馆',
    type: 'sport',
    coordinate: {
      row: 207,
      col: 362,
    },
    info: {
      timeLimit: '08:00-22:00',
      photo: [beidou],
      tips: ['6层', '一楼提供贩卖机', '小猫出没'],
      brief: '外卖需要去G座一楼拿，宿管阿姨人很nice😄',
    },
  },
  {
    name: '网球场',
    type: 'sport',
    coordinate: {
      row: 155,
      col: 193,
    },
    info: {
      timeLimit: '08:00-22:00',
      photo: [beidou],
      tips: ['6层', '一楼提供贩卖机', '小猫出没'],
      brief: '外卖需要去G座一楼拿，宿管阿姨人很nice😄',
    },
  },
  {
    name: '工学部教学楼',
    type: 'study',
    coordinate: {
      row: 192,
      col: 191,
    },
    info: {
      timeLimit: '08:00-22:00',
      photo: [beidou],
      tips: ['6层', '一楼提供贩卖机', '小猫出没'],
      brief: '外卖需要去G座一楼拿，宿管阿姨人很nice😄',
    },
  },
  {
    name: '乒乓球馆',
    type: 'sport',
    coordinate: {
      row: 234,
      col: 218,
    },
    info: {
      timeLimit: '08:00-22:00',
      photo: [beidou],
      tips: ['6层', '一楼提供贩卖机', '小猫出没'],
      brief: '外卖需要去G座一楼拿，宿管阿姨人很nice😄',
    },
  },
  {
    name: '操场',
    type: 'sport',
    coordinate: {
      row: 206,
      col: 326,
    },
    info: {
      timeLimit: '08:00-22:00',
      photo: [beidou],
      tips: ['6层', '一楼提供贩卖机', '小猫出没'],
      brief: '外卖需要去G座一楼拿，宿管阿姨人很nice😄',
    },
  },
  {
    name: '综合楼',
    type: 'study',
    coordinate: {
      row: 519,
      col: 238,
    },
    info: {
      timeLimit: '08:00-22:00',
      photo: [beidou],
      tips: ['6层', '一楼提供贩卖机', '小猫出没'],
      brief: '外卖需要去G座一楼拿，宿管阿姨人很nice😄',
    },
  },
  {
    name: '软件学院',
    type: 'study',
    coordinate: {
      row: 615,
      col: 255,
    },
    info: {
      timeLimit: '08:00-22:00',
      photo: [beidou],
      tips: ['6层', '一楼提供贩卖机', '小猫出没'],
      brief: '外卖需要去G座一楼拿，宿管阿姨人很nice😄',
    },
  },
  {
    name: '北斗研究院',
    type: 'study',
    coordinate: {
      row: 442,
      col: 345,
    },
    info: {
      timeLimit: '08:00-22:00',
      photo: [beidou],
      tips: ['6层', '一楼提供贩卖机', '小猫出没'],
      brief: '外卖需要去G座一楼拿，宿管阿姨人很nice😄',
    },
  },
  {
    name: '图书馆',
    type: 'library',
    coordinate: {
      row: 412,
      col: 220,
    },
    info: {
      timeLimit: '08:00-22:00',
      photo: [beidou],
      tips: ['6层', '一楼提供贩卖机', '小猫出没'],
      brief: '外卖需要去G座一楼拿，宿管阿姨人很nice😄',
    },
  },
  {
    name: '会议圆厅',
    type: 'meeting',
    coordinate: {
      row: 415,
      col: 405,
    },
    info: {
      timeLimit: '08:00-22:00',
      photo: [beidou],
      tips: ['6层', '一楼提供贩卖机', '小猫出没'],
      brief: '外卖需要去G座一楼拿，宿管阿姨人很nice😄',
    },
  },
  {
    name: '信息楼',
    type: 'study',
    coordinate: {
      row: 414,
      col: 312,
    },
    info: {
      timeLimit: '08:00-22:00',
      photo: [beidou],
      tips: ['6层', '一楼提供贩卖机', '小猫出没'],
      brief: '外卖需要去G座一楼拿，宿管阿姨人很nice😄',
    },
  },
  {
    name: '教学楼_A',
    type: 'study',
    coordinate: {
      row: 310,
      col: 278,
    },
    info: {
      timeLimit: '08:00-22:00',
      photo: [beidou],
      tips: ['6层', '一楼提供贩卖机', '小猫出没'],
      brief: '外卖需要去G座一楼拿，宿管阿姨人很nice😄',
    },
  },
  {
    name: '教学楼_B',
    type: 'study',
    coordinate: {
      row: 345,
      col: 276,
    },
    info: {
      timeLimit: '08:00-22:00',
      photo: [beidou],
      tips: ['6层', '一楼提供贩卖机', '小猫出没'],
      brief: '外卖需要去G座一楼拿，宿管阿姨人很nice😄',
    },
  },
  {
    name: '教学楼_C',
    type: 'study',
    coordinate: {
      row: 345,
      col: 278,
    },
    info: {
      timeLimit: '08:00-22:00',
      photo: [beidou],
      tips: ['6层', '一楼提供贩卖机', '小猫出没'],
      brief: '外卖需要去G座一楼拿，宿管阿姨人很nice😄',
    },
  },
  {
    name: '停车棚',
    type: 'public',
    coordinate: {
      row: 445,
      col: 415,
    },
    info: {
      timeLimit: '08:00-22:00',
      photo: [beidou],
      tips: ['6层', '一楼提供贩卖机', '小猫出没'],
      brief: '外卖需要去G座一楼拿，宿管阿姨人很nice😄',
    },
  },
  {
    name: '学术活动中心',
    type: 'dorm',
    coordinate: {
      row: 408,
      col: 483,
    },
    info: {
      timeLimit: '08:00-22:00',
      photo: [beidou],
      tips: ['6层', '一楼提供贩卖机', '小猫出没'],
      brief: '外卖需要去G座一楼拿，宿管阿姨人很nice😄',
    },
  },
  {
    name: '学术交流中心A座',
    type: 'dorm',
    coordinate: {
      row: 198,
      col: 668,
    },
    info: {
      timeLimit: '08:00-22:00',
      photo: [beidou],
      tips: ['6层', '一楼提供贩卖机', '小猫出没'],
      brief: '外卖需要去G座一楼拿，宿管阿姨人很nice😄',
    },
  },
  {
    name: '学术交流中心B座',
    type: 'dorm',
    coordinate: {
      row: 392,
      col: 590,
    },
    info: {
      timeLimit: '08:00-22:00',
      photo: [beidou],
      tips: ['6层', '一楼提供贩卖机', '小猫出没'],
      brief: '外卖需要去G座一楼拿，宿管阿姨人很nice😄',
    },
  },
  {
    name: '熹园',
    type: 'food',
    coordinate: {
      row: 385,
      col: 481,
    },
    info: {
      timeLimit: '08:00-22:00',
      photo: [beidou],
      tips: ['6层', '一楼提供贩卖机', '小猫出没'],
      brief: '外卖需要去G座一楼拿，宿管阿姨人很nice😄',
    },
  },
  {
    name: '商业街',
    type: 'play',
    coordinate: {
      row: 290,
      col: 483,
    },
    info: {
      timeLimit: '08:00-22:00',
      photo: [beidou],
      tips: ['6层', '一楼提供贩卖机', '小猫出没'],
      brief: '外卖需要去G座一楼拿，宿管阿姨人很nice😄',
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
