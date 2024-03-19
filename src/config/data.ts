import beidou from '/beidou.jpeg';

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
      timeLimit: '06:40-22:30（周六日23:30）',
      photo: [beidou],
      tips: ['女生宿舍', '6层', '一楼提供贩卖机'],
      brief: '距离食堂最近，非常方便，宿管阿姨人很nice😄',
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
      timeLimit: '06:40-22:30（周六日23:30）',
      photo: [beidou],
      tips: ['女生宿舍', '6层', '一楼提供贩卖机'],
      brief: '距离食堂近，非常方便，宿管阿姨人很nice😄',
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
      timeLimit: '06:40-22:30（周六日23:30）',
      photo: [beidou],
      tips: ['女生宿舍', '6层', '一楼提供贩卖机'],
      brief: '距离食堂和商业街近，非常方便，宿管阿姨人很nice😄',
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
      timeLimit: '06:40-22:30（周六日23:30）',
      photo: [beidou],
      tips: ['女生宿舍', '6层', '一楼提供贩卖机'],
      brief: '距离食堂和商业街近，非常方便，宿管阿姨人很nice😄',
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
      timeLimit: '06:40-22:30（周六日23:30）',
      photo: [beidou],
      tips: ['男生宿舍', '6层', '一楼提供贩卖机', '美团优选'],
      brief: '宿管阿姨人很nice😄',
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
      timeLimit: '06:40-22:30（周六日23:30）',
      photo: [beidou],
      tips: ['女生宿舍', '6层', '一楼提供贩卖机', '小猫出没'],
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
      timeLimit: '06:40-22:30（周六日23:30）',
      photo: [beidou],
      tips: ['菜鸟驿站', '6层', '小猫出没'],
      brief: '一楼是菜鸟驿站，可以寄收快递，有顺丰，中午和傍晚人最多😄',
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
      timeLimit: '06:40-22:30（周六日23:30）',
      photo: [beidou],
      tips: ['男女混宿', '6层', '一楼提供贩卖机', '小猫出没'],
      brief: '一楼是外卖存放点，宿管阿姨人很nice😄',
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
      timeLimit: '06:40-22:30（周六日23:30）',
      photo: [beidou],
      tips: ['6层', '一楼提供贩卖机', '小猫出没'],
      brief: '附近有许多小猫，闲暇时可以来撸猫，外卖需要去G座一楼拿，宿管阿姨人很nice😄',
    },
  },
  {
    name: '东南门保安亭',
    type: 'safe',
    coordinate: {
      row: 640,
      col: 374,
    },
    info: {
      timeLimit: '08:00-22:00',
      photo: [beidou],
      tips: ['保安亭'],
      brief: '学校正门，可前往阳光在线广场或者搭公交，阿叔人很nice😄',
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
      tips: ['保安亭'],
      brief: '学校北门，离宿舍区域比较近，建议回学校可以选择北门下车',
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
      tips: ['运动'],
      brief: '',
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
      tips: ['运动'],
      brief: '夏天很闷热，里面也有跆拳道设施',
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
      tips: ['大型活动', '运动'],
      brief:
        '经常有篮球、网球、羽毛球比赛进行，体测也是在这里，一些活动比如音乐节、毕业典礼都在此处',
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
      tips: ['运动'],
      brief: '',
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
      tips: ['教学楼'],
      brief: '新建的教学楼，比较远',
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
      tips: ['运动'],
      brief: '楼上是看台，可以观察操场和散步、赏月',
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
      tips: ['运动'],
      brief: '可以踢足球',
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
      tips: ['教学'],
      brief: '',
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
      tips: ['行政办公'],
      brief: '',
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
      tips: ['行政办公'],
      brief: '一楼有自习室',
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
      tips: ['自习', '阅读'],
      brief:
        '一楼有打印机，可以打印各项证明如绩点、在校证明等，负一楼有电脑可以使用，靠墙的桌位有插头，不建议占位',
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
      tips: ['开会'],
      brief: '',
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
      tips: ['wifi'],
      brief: '机房',
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
      tips: ['上课'],
      brief: '教学楼A区',
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
      tips: ['上课'],
      brief: '教学楼B区',
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
      tips: ['上课'],
      brief: '教学楼C区',
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
      tips: ['停车'],
      brief: '停车场，比较小',
    },
  },
  {
    name: '学术活动中心',
    type: 'activity',
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
    type: 'activity',
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
    type: 'activity',
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
      timeLimit: '07:00-22:00',
      photo: [beidou],
      tips: ['美食'],
      brief: '一二楼为校园内部服务餐饮、三楼为外包餐饮，价格都适中',
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
      tips: ['日常', '购物', '生活用品'],
      brief: '可以购买日常生活用品、打印、拍照、水果小吃等等，经常会有活动举行',
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
