// 羊了个羊 · 多关卡配置

// 第1关坐标生成函数
function generateLevel1Positions() {
  const positions = [];
  const startX = 50;
  const startY = 150;
  let z = 1; // 从1开始

  for (let layer = 0; layer < 5; layer++) {
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 3; col++) {
        const baseX = startX + layer * 30 + col * 60;
        const baseY = startY + layer * 30 + row * 60;
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

// // 第2关：54张牌，螺旋上升阵型
// function generateLevel2Positions() {
//   const positions = [];
//   const centerX = 170;
//   const centerY = 200;
//   let z = 1;

//   // 6层螺旋，每层9张，共54张
//   for (let layer = 0; layer < 6; layer++) {
//     for (let i = 0; i < 9; i++) {
//       const angle = (i / 9) * Math.PI * 2 + layer * 0.5; // 每层旋转角度
//       const radius = 50 + layer * 30;
//       const x = centerX + Math.cos(angle) * radius * 0.9;
//       const y = centerY + Math.sin(angle) * radius * 0.8 + layer * 15;

//       positions.push({
//         x: Math.floor(x),
//         y: Math.floor(y),
//         z: z++,
//       });
//     }
//   }
//   return positions;
// }
// 第2关：54张牌，三塔布局
function generateLevel2Positions() {
  const positions = [];
  let z = 1;

  // 三座塔的基准坐标
  const towers = [
    { baseX: 20, baseY: 300 }, // 左塔
    { baseX: 120, baseY: 100 }, // 中塔
    { baseX: 230, baseY: 300 }, // 右塔
  ];

  // 每座塔18张牌：底层6张，中层6张，顶层6张
  towers.forEach((tower) => {
    // 底层6张：2行3列，完全可见
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 3; col++) {
        positions.push({
          x: tower.baseX + col * 55,
          y: tower.baseY + row * 60,
          z: z++,
        });
      }
    }
    // 中层6张：完全重叠在底层中间位置，露出一点边缘
    const midX = tower.baseX + 55;
    const midY = tower.baseY + 30;
    for (let i = 0; i < 6; i++) {
      positions.push({
        x: midX + (i % 2) * 60 - 30, // 微微错开，不完全重叠
        y: midY + Math.floor(i / 2) * 60 - 60,
        z: z++,
      });
    }

    // 顶层6张：完全重叠在中层中间，只露一个角
    const topX = midX + 20;
    const topY = midY + 15;
    for (let i = 0; i < 6; i++) {
      positions.push({
        x: topX + (i % 2) * 40 - 40,
        y: topY + Math.floor(i / 2) * 50 - 50,
        z: z++,
      });
    }
  });

  return positions;
}

// 第三关（新加）：108张牌，蜂窝状复杂阵型
function generateLevel3Positions() {
  const positions = [];
  const centerX = 170;
  const centerY = 220;
  let z = 1;

  // 6层蜂窝，每层牌数：6, 12, 18, 24, 24, 24 = 108张
  const layerConfigs = [
    { radius: 0, count: 6 }, // 中心一圈6张
    { radius: 1, count: 12 }, // 第二圈12张
    { radius: 2, count: 18 }, // 第三圈18张
    { radius: 3, count: 24 }, // 第四圈24张
    { radius: 4, count: 24 }, // 第五圈24张
    { radius: 5, count: 24 }, // 第六圈24张
  ];

  layerConfigs.forEach((layer, layerIndex) => {
    const angleStep = (Math.PI * 2) / layer.count;
    const baseRadius = 60 + layer.radius * 45;

    for (let i = 0; i < layer.count; i++) {
      const angle = i * angleStep + layerIndex * 0.3; // 每层微调角度，错开排列
      const x = centerX + Math.cos(angle) * baseRadius * 0.6 + layerIndex * 1;
      const y = centerY + Math.sin(angle) * baseRadius * 0.8 + layerIndex * 6; // 垂直压扁一点

      positions.push({
        x: Math.floor(x),
        y: Math.floor(y),
        z: z++,
      });
    }
  });

  return positions;
}

// 第4关：144张牌，菱形阵型
function generateLevel4Positions() {
  const positions = [];
  const centerX = 200;
  const centerY = 250;
  let z = 1;

  for (let row = -7; row <= 7; row++) {
    let rowWidth = 15 - Math.abs(row);
    // 中间行（row=0）从15改成14，凑成168
    if (row === 0) rowWidth = 14;

    const startX = centerX - (rowWidth - 1) * 15;
    const y = centerY + row * 30;

    for (let col = 0; col < rowWidth; col++) {
      const x = startX + col * 30;
      positions.push({
        x: Math.floor(x),
        y: Math.floor(y),
        z: z++,
      });
    }
  }
  return positions;
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

  //   {
  //     // 第3关：108张牌，蜂窝复杂阵型
  //     positions: generateLevel3Positions(),
  //     typeDistribution: [
  //       { typeId: "type-1", count: 18 },
  //       { typeId: "type-2", count: 18 },
  //       { typeId: "type-3", count: 18 },
  //       { typeId: "type-4", count: 18 },
  //       { typeId: "type-5", count: 18 },
  //       { typeId: "type-6", count: 18 },
  //     ],
  //   },
  //   {
  //     // 第4关：168张牌，菱形阵型
  //     positions: generateLevel4Positions(),
  //     typeDistribution: [
  //       { typeId: "type-1", count: 21 },
  //       { typeId: "type-2", count: 21 },
  //       { typeId: "type-3", count: 21 },
  //       { typeId: "type-4", count: 21 },
  //       { typeId: "type-5", count: 21 },
  //       { typeId: "type-6", count: 21 },
  //       { typeId: "type-7", count: 21 },
  //       { typeId: "type-8", count: 21 },
  //     ],
  //   },
];

// 当前关卡索引
let currentLevelIndex = 1;

// 获取当前关卡
function getCurrentLevel() {
  return levels[currentLevelIndex];
}
