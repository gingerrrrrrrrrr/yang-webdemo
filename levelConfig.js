// 羊了个羊 · 多关卡配置

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

// // 第三关（新加）：108张牌，蜂窝状复杂阵型
// function generateLevel3Positions() {
//   const positions = [];
//   const centerX = 170;
//   const centerY = 220;
//   let z = 1;

//   // 6层蜂窝，每层牌数：6, 12, 18, 24, 24, 24 = 108张
//   const layerConfigs = [
//     { radius: 0, count: 6 }, // 中心一圈6张
//     { radius: 1, count: 12 }, // 第二圈12张
//     { radius: 2, count: 18 }, // 第三圈18张
//     { radius: 3, count: 24 }, // 第四圈24张
//     { radius: 4, count: 24 }, // 第五圈24张
//     { radius: 5, count: 24 }, // 第六圈24张
//   ];

//   layerConfigs.forEach((layer, layerIndex) => {
//     const angleStep = (Math.PI * 2) / layer.count;
//     const baseRadius = 60 + layer.radius * 45;

//     for (let i = 0; i < layer.count; i++) {
//       const angle = i * angleStep + layerIndex * 0.3; // 每层微调角度，错开排列
//       const x = centerX + Math.cos(angle) * baseRadius * 0.6 + layerIndex * 1;
//       const y = centerY + Math.sin(angle) * baseRadius * 0.8 + layerIndex * 6; // 垂直压扁一点

//       positions.push({
//         x: Math.floor(x),
//         y: Math.floor(y),
//         z: z++,
//       });
//     }
//   });

//   return positions;
// }

// // 第4关：144张牌，菱形阵型
// function generateLevel4Positions() {
//   const positions = [];
//   const centerX = 200;
//   const centerY = 250;
//   let z = 1;

//   for (let row = -7; row <= 7; row++) {
//     let rowWidth = 15 - Math.abs(row);
//     // 中间行（row=0）从15改成14，凑成168
//     if (row === 0) rowWidth = 14;

//     const startX = centerX - (rowWidth - 1) * 15;
//     const y = centerY + row * 30;

//     for (let col = 0; col < rowWidth; col++) {
//       const x = startX + col * 30;
//       positions.push({
//         x: Math.floor(x),
//         y: Math.floor(y),
//         z: z++,
//       });
//     }
//   }
//   return positions;
// }

//关卡3 上下两部分
function generateLeve3Positions() {
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
    positions: generateLeve3Positions(),
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
let currentLevelIndex = 2;

// 获取当前关卡
function getCurrentLevel() {
  return levels[currentLevelIndex];
}
