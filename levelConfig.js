// 羊了个羊 · 多关卡配置

// 当前关卡索引
let currentLevelIndex = 4;

// 获取当前关卡
function getCurrentLevel() {
  return levels[currentLevelIndex];
}

const levels = [
  {
    // 第1关：30张牌，向右下偏移阵型
    positions: generateLevel1Positions(),
    typeDistribution: [
      { typeId: "type-1", count: 6 },
      { typeId: "type-2", count: 6 },
      { typeId: "type-3", count: 6 },
      { typeId: "type-4", count: 6 },
      { typeId: "type-5", count: 6 },
    ],
  },

  {
    // 第2关：54张牌
    positions: generateLevel2Positions(),
    typeDistribution: [
      { typeId: "type-6", count: 9 },
      { typeId: "type-7", count: 9 },
      { typeId: "type-8", count: 9 },
      { typeId: "type-9", count: 9 },
      { typeId: "type-10", count: 9 },
      { typeId: "type-11", count: 9 },
    ],
  },
  {
    // 第3关：上下两截
    positions: generateLevel3Positions(),
    typeDistribution: [
      { typeId: "type-1", count: 18 },
      { typeId: "type-2", count: 18 },
      { typeId: "type-3", count: 18 },
      { typeId: "type-4", count: 18 },
      { typeId: "type-5", count: 18 },
      { typeId: "type-6", count: 18 },
      { typeId: "type-7", count: 18 },
      { typeId: "type-8", count: 18 },
      { typeId: "type-9", count: 18 },
      { typeId: "type-10", count: 18 },
    ],
  },

  {
    // 第4关：螺旋三层
    positions: generateLevel4Positions(),
    typeDistribution: [
      //   { typeId: "type-11", count: 12 },
      //   { typeId: "type-12", count: 12 },
      //   { typeId: "type-13", count: 12 },
      { typeId: "type-14", count: 12 },
      { typeId: "type-15", count: 12 },
      { typeId: "type-16", count: 12 },
      { typeId: "type-17", count: 12 },
      { typeId: "type-18", count: 12 },
      { typeId: "type-19", count: 12 },
      { typeId: "type-20", count: 12 },
      { typeId: "type-21", count: 12 },
      { typeId: "type-22", count: 12 },
    ],
  },
  {
    // 第5关：上下四排 + 四个小螺旋
    positions: generateLevel5Positions(),
    typeDistribution: [
      { typeId: "type-11", count: 12 },
      { typeId: "type-12", count: 12 },
      { typeId: "type-13", count: 12 },
      { typeId: "type-14", count: 12 },
      { typeId: "type-15", count: 12 },
      { typeId: "type-16", count: 12 },
      { typeId: "type-17", count: 12 },
      { typeId: "type-18", count: 12 },
      { typeId: "type-19", count: 12 },
      { typeId: "type-20", count: 12 },
    ],
  },
];

// 第1关坐标生成函数
function generateLevel1Positions() {
  const positions = [];
  const startX = 220;
  const startY = 450;
  let z = 1; // 从1开始

  for (let layer = 0; layer < 5; layer++) {
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 3; col++) {
        const baseX = startX + layer * 60 + col * 140;
        const baseY = startY + layer * 80 + row * 140;
        positions.push({
          x: Math.floor(baseX),
          y: Math.floor(baseY),
          z: z++,
        });
      }
    }
  }
  return positions;
}

// 第2关：54张牌，三塔布局
function generateLevel2Positions() {
  const positions = [];
  let z = 1;

  // 三座塔的基准坐标
  const towers = [
    { baseX: 100, baseY: 900 }, // 左塔
    { baseX: 340, baseY: 300 }, // 中塔
    { baseX: 600, baseY: 900 }, // 右塔
  ];

  // 每座塔18张牌：底层6张，中层6张，顶层6张
  towers.forEach((tower) => {
    // 底层6张：2行3列，完全可见
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 3; col++) {
        positions.push({
          x: tower.baseX + col * 140,
          y: tower.baseY + row * 140,
          z: z++,
        });
      }
    }
    // 中层6张：完全重叠在底层中间位置，露出一点边缘
    const midX = tower.baseX + 120;
    const midY = tower.baseY + 120;
    for (let i = 0; i < 6; i++) {
      positions.push({
        x: midX + (i % 2) * 140 - 30, // 微微错开，不完全重叠
        y: midY + Math.floor(i / 2) * 140 - 180,
        z: z++,
      });
    }

    // 顶层6张：完全重叠在中层中间，只露一个角
    const topX = midX + 20;
    const topY = midY + 15;
    for (let i = 0; i < 6; i++) {
      positions.push({
        x: topX + (i % 2) * 120,
        y: topY + Math.floor(i / 2) * 160 - 160,
        z: z++,
      });
    }
  });

  return positions;
}

//关卡3 上下两部分
function generateLevel3Positions() {
  const positions = [];
  let z = 1;

  // ===== 上半截：6列叠叠乐，每列20张 =====
  // 牌宽128，高128，每列间隔168（128+40），每张只露26（128*0.2）
  for (let col = 0; col < 6; col++) {
    for (let row = 0; row < 20; row++) {
      positions.push({
        x: Math.floor(50 + col * 168),
        y: Math.floor(50 + row * 26),
        z: z++,
      });
    }
  }

  // ===== 下半截：两层各6列x5行，十字交叉 =====
  // 下层从y=1200开始，行列间隔148（128+20）
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 6; col++) {
      positions.push({
        x: Math.floor(50 + col * 148),
        y: Math.floor(800 + row * 148),
        z: z++,
      });
    }
  }

  // 上层偏移64（128/2）
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 6; col++) {
      positions.push({
        x: Math.floor(50 + col * 148 + 64),
        y: Math.floor(800 + row * 148 + 64),
        z: z++,
      });
    }
  }

  return positions;
}

//关卡4 螺旋内收很多条
function generateLevel4Positions() {
  const positions = [];
  let z = 1;

  // 每一行/列的定义：起点 + 终点 + 这一行/列有多少张牌
  const segments = [
    // 外圈 (15张)
    { startX: 100, startY: 100, endX: 850, endY: 100, count: 12 }, // 上边：从左到右
    { startX: 850, startY: 250, endX: 850, endY: 1470, count: 12 }, // 右边：从上到下
    { startX: 700, startY: 1470, endX: 100, endY: 1470, count: 12 }, // 下边：从右到左
    { startX: 100, startY: 1320, endX: 100, endY: 250, count: 12 }, // 左边：从下到上

    // 中圈 (12张) - 往里缩150
    { startX: 250, startY: 250, endX: 700, endY: 250, count: 9 }, // 上边
    { startX: 700, startY: 400, endX: 700, endY: 1320, count: 9 }, // 右边
    { startX: 550, startY: 1320, endX: 250, endY: 1320, count: 9 }, // 下边
    { startX: 250, startY: 1170, endX: 250, endY: 400, count: 9 }, // 左边

    // 内圈 (9张) - 改成长方形
    { startX: 400, startY: 400, endX: 550, endY: 400, count: 6 }, // 上边
    { startX: 550, startY: 550, endX: 550, endY: 1020, count: 6 }, // 右边（加长）
    { startX: 550, startY: 1170, endX: 400, endY: 1170, count: 6 }, // 下边（加长）
    { startX: 400, startY: 1020, endX: 400, endY: 550, count: 6 }, // 左边
  ];

  segments.forEach((seg) => {
    const dx = seg.endX - seg.startX;
    const dy = seg.endY - seg.startY;

    for (let i = 0; i < seg.count; i++) {
      // 如果是最后一个位置，就用终点坐标（保证完整牌在拐角）
      const t = i === seg.count - 1 ? 1 : i / (seg.count - 1);

      positions.push({
        x: Math.floor(seg.startX + dx * t),
        y: Math.floor(seg.startY + dy * t),
        z: z++,
      });
    }
  });

  return positions;
}
//关卡5 上下4条+4个小螺旋
function generateLevel5Positions() {
  const positions = [];
  let z = 1;

  // ===== 上半部分：两排 =====
  // 第一排：从右到左
  for (let i = 0; i < 12; i++) {
    positions.push({
      x: Math.floor(830 - i * 64), // 从右往左，间距70
      y: 100,
      z: z++,
    });
  }

  // 第二排：从左到右
  for (let i = 0; i < 12; i++) {
    positions.push({
      x: Math.floor(80 + i * 72),
      y: 250,
      z: z++,
    });
  }

  // ===== 下半部分：两排 =====
  // 第三排：从左到右（和第一排方向相反？）
  for (let i = 0; i < 12; i++) {
    positions.push({
      x: Math.floor(80 + i * 72),
      y: 1320,
      z: z++,
    });
  }

  // 第四排：从右到左
  for (let i = 0; i < 12; i++) {
    positions.push({
      x: Math.floor(830 - i * 64),
      y: 1470,
      z: z++,
    });
  }

  // ===== 四个小螺旋（各15张） =====
  // 为了方便主子调整，用起始点+终止点的方式

  // 左上角螺旋：从右下角开始，逆时针
  // 实际是一条连贯的路径，但为了方便写成四段
  const spiralTL = [
    // 左上中心：从(220,560)到(320,560)，3张
    { startX: 220, startY: 560, endX: 320, endY: 560, count: 3 },
    { startX: 280, startY: 700, endX: 150, endY: 700, count: 3 }, // 下边：终点不到顶点(130,700)，留一个牌位
    { startX: 130, startY: 700, endX: 130, endY: 440, count: 4 }, // 左边：终点不到顶点(130,420)
    { startX: 130, startY: 420, endX: 380, endY: 420, count: 4 }, // 上边：终点不到顶点(400,420)
    { startX: 400, startY: 420, endX: 400, endY: 700, count: 4 }, // 右边：终点正好是(400,700)，但这不是任何边的起点？没问题
  ];

  // 右上角螺旋：从左下角开始，顺时针
  const spiralTR = [
    // 右上中心：从(620,560)到(720,560)，3张
    { startX: 620, startY: 560, endX: 720, endY: 560, count: 3 },
    { startX: 660, startY: 700, endX: 790, endY: 700, count: 3 }, // 下边：终点不到顶点(810,700)
    { startX: 810, startY: 700, endX: 810, endY: 440, count: 4 }, // 右边：终点不到顶点(810,420)
    { startX: 810, startY: 420, endX: 580, endY: 420, count: 4 }, // 上边：终点不到顶点(560,420)
    { startX: 560, startY: 420, endX: 560, endY: 700, count: 4 }, // 左边：终点正好(560,700)
  ];

  // 左下角螺旋：从右上角开始，顺时针
  const spiralBL = [
    // 左下中心：从(220,1010)到(320,1010)，3张
    { startX: 220, startY: 1010, endX: 320, endY: 1010, count: 3 },
    { startX: 280, startY: 870, endX: 150, endY: 870, count: 3 }, // 上边：终点不到(130,870)
    { startX: 130, startY: 870, endX: 130, endY: 1130, count: 4 }, // 左边：终点不到(130,1150)
    { startX: 130, startY: 1150, endX: 380, endY: 1150, count: 4 }, // 下边：终点不到(400,1150)
    { startX: 400, startY: 1150, endX: 400, endY: 870, count: 4 }, // 右边：终点正好到(400,870)顶点
  ];

  // 右下角螺旋：从左上角开始，逆时针
  const spiralBR = [
    // 右下中心：从(620,1010)到(720,1010)，3张
    { startX: 620, startY: 1010, endX: 720, endY: 1010, count: 3 },
    { startX: 660, startY: 870, endX: 790, endY: 870, count: 3 }, // 上边：终点不到(810,870)
    { startX: 810, startY: 870, endX: 810, endY: 1130, count: 4 }, // 右边：终点不到(810,1150)
    { startX: 810, startY: 1150, endX: 580, endY: 1150, count: 4 }, // 下边：终点不到(560,1150)
    { startX: 560, startY: 1150, endX: 560, endY: 870, count: 4 }, // 左边：终点正好到(560,870)顶点
  ];

  // 把所有螺旋的牌加进去
  [...spiralTL, ...spiralTR, ...spiralBL, ...spiralBR].forEach((seg) => {
    const dx = seg.endX - seg.startX;
    const dy = seg.endY - seg.startY;

    for (let i = 0; i < seg.count; i++) {
      const t = i === seg.count - 1 ? 1 : i / (seg.count - 1);
      positions.push({
        x: Math.floor(seg.startX + dx * t),
        y: Math.floor(seg.startY + dy * t),
        z: z++,
      });
    }
  });

  return positions;
}
