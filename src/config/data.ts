export interface Build {
  name: string;
  type: 'dorm' | 'safe' | 'study' | 'sport' | 'library' | 'meeting' | 'public' | 'play' | 'food'; // prettier-ignore
  id?: number;
  position?: THREE.Vector3;
  element?: any;
  coordinate: {
    row: number;
    col: number;
  };
  info: {
    timeLimit?: string;
    photo?: string;
    tags?: string[];
    brief?: string;
    count?: number;
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
      photo: 'dorm',
      count: 4,
      tags: ['女生宿舍', '6层', '一楼提供贩卖机'],
      brief:
        '宿舍类型有3人间、4人间和5人间，每间宿舍均配备上床下桌（床为0.9mX1.9m)、独立卫生间、独立阳台、空调。（每栋宿舍楼下都会有慵懒的宿舍“守护神”，上下台阶小心脚下噢！）\n距离食堂最近，非常方便，宿管阿姨人很nice😄',
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
      photo: 'dorm',
      count: 4,
      tags: ['女生宿舍', '6层', '一楼提供贩卖机'],
      brief:
        '宿舍类型有3人间、4人间和5人间，每间宿舍均配备上床下桌（床为0.9mX1.9m)、独立卫生间、独立阳台、空调。（每栋宿舍楼下都会有慵懒的宿舍“守护神”，上下台阶小心脚下噢！）\n距离食堂近，非常方便，宿管阿姨人很nice😄',
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
      photo: 'dorm',
      count: 4,
      tags: ['女生宿舍', '6层', '一楼提供贩卖机'],
      brief:
        '宿舍类型有3人间、4人间和5人间，每间宿舍均配备上床下桌（床为0.9mX1.9m)、独立卫生间、独立阳台、空调。（每栋宿舍楼下都会有慵懒的宿舍“守护神”，上下台阶小心脚下噢！）\n距离食堂和商业街近，非常方便，宿管阿姨人很nice😄',
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
      photo: 'dorm',
      count: 4,
      tags: ['女生宿舍', '6层', '一楼提供贩卖机'],
      brief:
        '宿舍类型有3人间、4人间和5人间，每间宿舍均配备上床下桌（床为0.9mX1.9m)、独立卫生间、独立阳台、空调。（每栋宿舍楼下都会有慵懒的宿舍“守护神”，上下台阶小心脚下噢！）\n距离食堂和商业街近，非常方便，宿管阿姨人很nice😄',
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
      photo: 'dorm',
      count: 4,
      tags: ['男生宿舍', '6层', '一楼提供贩卖机', '美团优选'],
      brief:
        '宿舍类型有3人间、4人间和5人间，每间宿舍均配备上床下桌（床为0.9mX1.9m)、独立卫生间、独立阳台、空调。（每栋宿舍楼下都会有慵懒的宿舍“守护神”，上下台阶小心脚下噢！）\n宿管阿姨人很nice😄',
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
      photo: 'dorm',
      count: 4,
      tags: ['女生宿舍', '6层', '一楼提供贩卖机', '小猫出没'],
      brief:
        '宿舍类型有3人间、4人间和5人间，每间宿舍均配备上床下桌（床为0.9mX1.9m)、独立卫生间、独立阳台、空调。（每栋宿舍楼下都会有慵懒的宿舍“守护神”，上下台阶小心脚下噢！）\n外卖需要去G座一楼拿，宿管阿姨人很nice😄',
    },
  },
  {
    name: '25号楼菜鸟驿站',
    type: 'dorm',
    coordinate: {
      row: 158,
      col: 625,
    },
    info: {
      timeLimit: '06:40-22:30（周六日23:30）',
      photo: 'express',
      count: 2,
      tags: ['菜鸟驿站', '6层', '小猫出没'],
      brief:
        '一楼是菜鸟驿站，可以寄收快递，有顺丰，中午和傍晚人最多😄\n地址为：广东省佛山市南海区狮山镇华南师范大学南海校区菜鸟驿站。\n菜鸟驿站可接收除京东、百世、德邦等以外的快递，具体情况可根据快递员发送的信息哟！\n信件（中国邮政）一般送至学生活动中心109办公室。',
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
      photo: 'dorm',
      count: 4,
      tags: ['男女混宿', '6层', '一楼提供贩卖机', '小猫出没'],
      brief:
        '宿舍类型有3人间、4人间和5人间，每间宿舍均配备上床下桌（床为0.9mX1.9m)、独立卫生间、独立阳台、空调。（每栋宿舍楼下都会有慵懒的宿舍“守护神”，上下台阶小心脚下噢！）\n一楼是外卖存放点，宿管阿姨人很nice😄',
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
      photo: 'dorm',
      count: 4,
      tags: ['6层', '一楼提供贩卖机', '小猫出没'],
      brief:
        '宿舍类型有3人间、4人间和5人间，每间宿舍均配备上床下桌（床为0.9mX1.9m)、独立卫生间、独立阳台、空调。（每栋宿舍楼下都会有慵懒的宿舍“守护神”，上下台阶小心脚下噢！）\n附近有许多小猫，闲暇时可以来撸猫，外卖需要去G座一楼拿，宿管阿姨人很nice😄',
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
      photo: 'resa',
      tags: ['保安亭'],
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
      photo: 'resa',
      tags: ['保安亭'],
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
      photo: 'resa',
      tags: ['运动'],
      brief: '篮球场，天气好的话许多比赛在这里进行，若下雨会到体育馆内进行',
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
      photo: 'badminton',
      count: 2,
      tags: ['运动'],
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
      photo: 'sport',
      count: 2,
      tags: ['大型活动', '运动'],
      brief:
        '体育馆内设有篮球场、排球场、羽毛球馆、健美操室、散打室，满足同学们多样的运动需求。同时，体育馆也会举办许多精彩纷呈的文艺活动。\n经常有篮球、网球、羽毛球比赛进行，体测也是在这里，一些活动比如音乐节、毕业典礼都在此处',
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
      photo: 'resa',
      tags: ['运动'],
      brief: '网球场',
    },
  },
  {
    name: '工学部教学楼（在建）',
    type: 'study',
    coordinate: {
      row: 192,
      col: 191,
    },
    info: {
      timeLimit: '08:00-22:00',
      photo: 'resa',
      tags: ['教学楼'],
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
      photo: 'pingpong',
      count: 1,
      tags: ['运动'],
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
      photo: 'playground',
      count: 1,
      tags: ['运动'],
      brief:
        '校区运动场为400米标准运动场，内部为足球场，跑道周围配备锻炼器材，供同学们进行必要的体育运动。',
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
      photo: 'comprehensive',
      count: 1,
      tags: ['教学'],
      brief:
        '城市文化学院院楼就坐落在综合楼之中，院楼设置多媒体课室、多媒体实验室、文化大讲堂、教工之家等，是学生上课、办理事务、开展相关创意文化活动的地方，同时也是学院各位老师的办公区。',
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
      photo: 'soft',
      count: 1,
      tags: ['行政办公'],
      brief: '软件学院办公楼',
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
      photo: 'beidou',
      count: 1,
      tags: ['行政办公'],
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
      photo: 'library',
      count: 4,
      tags: ['自习', '阅读'],
      brief:
        '图书馆共有6层，内设有空调，刷卡或刷脸入馆。负一楼配备电脑、咖啡屋，一楼设有图书馆总服务台，提供借还书等服务，二、三、四、五楼藏有多种类型书目，同学们可自由借阅，同时馆内配备研讨室可供同学们使用，具体可关注华南师大图书馆公众号。\n一楼有打印机，可以打印各项证明如绩点、在校证明等，负一楼有电脑可以使用，靠墙的桌位有插头，不建议占位',
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
      photo: 'resa',
      tags: ['开会'],
      brief: '开会摸鱼的好去处，各种大型会议都在此处进行，夏天空调很冷',
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
      photo: 'resa',
      tags: ['wifi'],
      brief:
        '信息楼与C座教学楼相连，位于熹园后方，设有大型阶梯室和计算机实验室等，是级会、讲座以及开展与计算机有关课程的教学楼。',
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
      photo: 'class',
      count: 2,
      tags: ['上课'],
      brief:
        '教学楼A区\n教学楼呈U字型，A、B、C三座连接，以下图为例，从左至右分别是B栋教学楼、A栋教学楼、C栋教学楼。教学楼环绕的空地为康有为广场。（注意上课别走错教室！！！！）',
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
      photo: 'class',
      count: 2,
      tags: ['上课'],
      brief:
        '教学楼B区\n教学楼呈U字型，A、B、C三座连接，以下图为例，从左至右分别是B栋教学楼、A栋教学楼、C栋教学楼。教学楼环绕的空地为康有为广场。（注意上课别走错教室！！！！）',
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
      photo: 'class',
      count: 2,
      tags: ['上课'],
      brief:
        '教学楼C区\n教学楼呈U字型，A、B、C三座连接，以下图为例，从左至右分别是B栋教学楼、A栋教学楼、C栋教学楼。教学楼环绕的空地为康有为广场。（注意上课别走错教室！！！！）',
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
      photo: 'resa',
      tags: ['停车'],
      brief: '停车场，比较小',
    },
  },
  {
    name: '学术活动中心',
    type: 'public',
    coordinate: {
      row: 408,
      col: 483,
    },
    info: {
      timeLimit: '08:00-22:00',
      photo: 'activity',
      count: 2,
      tags: ['5层', '小猫出没'],
      brief:
        '学生活动中心为勤工助学管理中心、校青年志愿者协会、校团委、校学生会等校级学生组织的驻扎地，不定期举办一些精彩活动，可以留意相关信息',
    },
  },
  {
    name: '学术交流中心A座',
    type: 'public',
    coordinate: {
      row: 198,
      col: 668,
    },
    info: {
      timeLimit: '08:00-22:00',
      photo: 'resa',
      tags: ['6层', '一楼提供贩卖机', '小猫出没'],
      brief: '外卖需要去G座一楼拿，宿管阿姨人很nice😄',
    },
  },
  {
    name: '学术交流中心B座',
    type: 'public',
    coordinate: {
      row: 392,
      col: 590,
    },
    info: {
      timeLimit: '08:00-22:00',
      photo: 'resa',
      tags: ['6层', '一楼提供贩卖机', '小猫出没'],
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
      timeLimit: '07:00-21:00',
      photo: 'restaurant',
      count: 10,
      tags: ['中式小炒', '饺子馄饨', '猪肚鸡', '广式烧腊', '麻辣烫', '铁板烧'],
      brief:
        '总共有三楼，一二楼为校园内部服务餐饮、三楼为外包餐饮。\n一楼菜品多样，早餐提供肠粉、炒粉、面食、粥、豆浆等；午晚餐提供铁板烧、土豆粉、螺狮粉、秋冬滋补类、卤味类、拉面、饺子、补汤等；甜品类有糖水、龟苓膏等。同时设有西饼屋，提供新鲜面包、饮料和雪糕以及一些小零食。\n二楼有中式小炒、猪脚饭和广式烧腊。\n三楼有麻辣香锅、自选小炒、潮汕粉面等等外面的餐饮。',
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
      photo: 'shopping',
      count: 7,
      tags: ['日常', '购物', '生活用品'],
      brief:
        '商业街共有3层，一楼设有美食坊、理发店、文具店、水果店、姆斯汉堡；二楼设有清心堂、校园生活超市、打印店；三楼设有创业吧，是学生可选择的休闲娱乐场所之一。',
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
