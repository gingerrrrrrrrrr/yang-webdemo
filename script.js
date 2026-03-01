// 羊了个羊 · 核心逻辑

// 牌的基本尺寸
const CARD_WIDTH = 128;
const CARD_HEIGHT = 128;

// 卡槽配置（加在文件前面，CARD_WIDTH/HEIGHT 下面）
const SLOT_COUNT = 7; // 卡槽数量
const SLOT_START_X = 55; // 卡槽起始 X 坐标
const SLOT_START_Y = 1700; // 卡槽起始 Y 坐标（画布高700，留出底部空间）
const SLOT_SPACING = 140; // 卡槽间距（比牌宽稍大）

// 图片缓存
const imageCache = {};

// 存放所有牌的数组
let allCards = [];
// 存储卡槽里牌的 id，按放入顺序
let slotOrder = [];

// 获取 canvas 和绘图上下文
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const overlay = document.getElementById("gameOverlay");
const overlayMessage = document.getElementById("overlayMessage");

const overlayButton = document.getElementById("overlayButton");

// 预加载图片
cardTypeLibrary.forEach((type) => {
  const img = new Image();
  img.src = "images/" + type.imageFile;
  imageCache[type.imageFile] = img;
});

// const overlayResetBtn = document.querySelector(".reset-in-overlay");
// overlayResetBtn.addEventListener("click", () => {
//   resetGame();
// });
overlayButton.addEventListener("click", () => {
  if (overlayButton.textContent === "下一关") {
    // 切换到下一关
    currentLevelIndex++;
    resetGame();
  } else if (overlayButton.textContent === "再玩一遍") {
    // 重置当前关卡
    resetGame();
  } else {
    // 其他情况（恭喜通关）回到第一关
    currentLevelIndex = 0;
    resetGame();
  }
});

// 点击画布
canvas.addEventListener("click", function (event) {
  // 获取点击位置相对于 canvas 的坐标
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width; // canvas 实际像素和显示宽度的比例
  const scaleY = canvas.height / rect.height;

  const mouseX = (event.clientX - rect.left) * scaleX;
  const mouseY = (event.clientY - rect.top) * scaleY;

  // 遍历所有牌（从上层往下找，先找最上面的）
  // 只找还在牌堆里的牌（state 是 onBoardVisible 或 onBoardHidden）
  const deckCards = allCards.filter(
    (card) => card.state === "onBoardVisible" || card.state === "onBoardHidden",
  );

  // 按 z 从大到小排序（上层优先）
  const sortedFromTop = [...deckCards].sort((a, b) => b.z - a.z);

  let hitCard = null; // 记录点中的牌

  for (let card of sortedFromTop) {
    // 检查点击是否落在牌矩形内
    if (
      mouseX >= card.x &&
      mouseX <= card.x + CARD_WIDTH &&
      mouseY >= card.y &&
      mouseY <= card.y + CARD_HEIGHT
    ) {
      hitCard = card;
      break; // 只点最上面那张
    }
  }
  // 根据点中的牌的状态输出不同信息
  if (hitCard) {
    if (hitCard.state === "onBoardVisible") {
      console.log("✅ 点击了可见牌：", hitCard);

      // 1. 找出当前在卡槽里的所有牌（按放入顺序）
      const slotCards = allCards.filter((card) => card.state === "inSlot");
      // 2. 如果卡槽没满（小于7张）
      if (slotCards.length < SLOT_COUNT) {
        // 3. 把这张牌的状态改成 inSlot
        hitCard.state = "inSlot";
        slotOrder.push(hitCard.id); // 记录顺序
        // 重新计算所有卡槽牌的位置
        slotOrder.forEach((cardId, index) => {
          const card = allCards.find((c) => c.id === cardId);
          if (card) {
            card.x = SLOT_START_X + index * SLOT_SPACING;
            card.y = SLOT_START_Y;
          }
        });

        // 移入后检查消除
        const eliminated = checkAndEliminate();

        if (eliminated) {
          console.log("✨ 消除了三张牌！");
        }
        checkGameOver();

        // 重新计算遮盖状态
        updateCoverStatus();
        // 重新渲染
        renderBoard();
        // --- 新增结束 ---
      } else {
        // console.log("⚠️ 卡槽已满，不能再移入");
      }
    } else if (hitCard.state === "onBoardHidden") {
      console.log("❌ 点击了被盖住的牌（无效）：", hitCard);
    }
  } else {
    console.log("⚪ 点击了空白处");
  }
});

// 执行生成
generateDeck();

//以下为函数定义

// 洗牌函数（复制一份过来，因为 levelConfig.js 里的函数这边不能用）
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// 生成牌堆
function generateDeck() {
  const levelConfig = getCurrentLevel(); // 获取当前关卡

  // 1. 从类型分布创建临时牌库（把类型ID按count重复）
  let tempDeck = [];
  levelConfig.typeDistribution.forEach((item) => {
    for (let i = 0; i < item.count; i++) {
      tempDeck.push(item.typeId);
    }
  });

  // 2. 打乱临时牌库
  tempDeck = shuffle(tempDeck);

  // 3. 检查数量是否匹配
  if (tempDeck.length !== levelConfig.positions.length) {
    console.error(
      "救命！牌库数量(",
      tempDeck.length,
      ")和位置数量(",
      levelConfig.positions.length,
      ")对不上！",
    );
    return;
  }

  // 4. 遍历位置，生成每一张牌
  allCards = [];
  levelConfig.positions.forEach((pos, index) => {
    const typeId = tempDeck[index];

    // 从类型库找到对应的类型信息
    const typeInfo = cardTypeLibrary.find((t) => t.typeId === typeId);

    if (!typeInfo) {
      console.error("找不到类型：", typeId);
      return;
    }

    allCards.push({
      id: `card-${index + 1}`, // 从1开始
      typeId: typeId,
      //   displayChar: typeInfo.displayChar, // 从类型库复制过来
      imageFile: typeInfo.imageFile, // 从 displayChar 改成 imageFile
      x: pos.x,
      y: pos.y,
      z: pos.z,
      state: "onBoardHidden", // 初始都是被遮盖的
    });
  });

  console.log("牌堆生成完成！共", allCards.length, "张牌");
  console.log("前3张牌示例：", allCards.slice(0, 3));

  // 生成完牌后，更新遮盖状态
  updateCoverStatus();
  // 调用渲染
  renderBoard();
}

// 渲染所有牌
function renderBoard() {
  // 1. 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawSlots(); // 先画卡槽背景（在最底层）

  // 2. 先把牌按 z 值排序（从小到大，先画底层）
  const sortedCards = [...allCards].sort((a, b) => a.z - b.z);

  // 3. 遍历画每一张牌
  sortedCards.forEach((card) => {
    // 只画还在牌堆里的牌（state 不是 inSlot 也不是 eliminated）
    // 但我们现在还没有 inSlot 和 eliminated，所以暂时全画
    drawCard(card);
  });
}

// 画单张牌
function drawCard(card) {
  // 设置阴影（模糊一点，稍微右下偏移）
  ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;

  // 底色
  ctx.fillStyle = "#fff"; // 白色背景

  // 创建渐变（只影响这一次 fillRect）
  const gradient = ctx.createLinearGradient(
    card.x,
    card.y,
    card.x + CARD_WIDTH,
    card.y + CARD_HEIGHT,
  );
  gradient.addColorStop(0, "#ffffff"); // 左上亮
  gradient.addColorStop(1, "#dcdcdc"); // 右下暗
  ctx.fillStyle = gradient; // 设置渐变填充

  //   ctx.fillRect(card.x, card.y, CARD_WIDTH, CARD_HEIGHT);
  roundRect(ctx, card.x, card.y, CARD_WIDTH, CARD_HEIGHT, 10);
  ctx.fill();
  // 关掉阴影（免得文字也有阴影）
  ctx.shadowColor = "transparent";
  //边框
  //   ctx.strokeStyle = "#9694a1";
  //   ctx.lineWidth = 2;
  //   ctx.strokeRect(card.x, card.y, CARD_WIDTH, CARD_HEIGHT);

  // 画表情文字
  //   ctx.font = "56px Arial";
  //   ctx.fillStyle = "#464545";
  //   ctx.textAlign = "center";
  //   ctx.textBaseline = "middle";
  //   ctx.fillText(
  //     card.displayChar,
  //     card.x + CARD_WIDTH / 2,
  //     card.y + CARD_HEIGHT / 2,
  //   );

  //   // 计算缩放后的尺寸（原尺寸的70%）
  //   const imgWidth = CARD_WIDTH * 0.7;
  //   const imgHeight = CARD_HEIGHT * 0.7;

  //   // 计算居中位置
  //   const imgX = card.x + (CARD_WIDTH - imgWidth) / 2;
  //   const imgY = card.y + (CARD_HEIGHT - imgHeight) / 2;

  // 画图片
  //   const img = new Image();
  //   img.src = "images/" + card.imageFile;
  //   ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);

  // 从缓存取图片
  const img = imageCache[card.imageFile];
  if (img) {
    // 计算缩放后的尺寸（原尺寸的70%）
    const imgWidth = CARD_WIDTH * 0.7;
    const imgHeight = CARD_HEIGHT * 0.7;

    // 计算居中位置
    const imgX = card.x + (CARD_WIDTH - imgWidth) / 2;
    const imgY = card.y + (CARD_HEIGHT - imgHeight) / 2;

    // 画图片
    ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);
  }

  // 新增：如果是被盖住的牌，盖一层半透明灰
  if (card.state === "onBoardHidden") {
    ctx.fillStyle = "rgba(130, 130, 138, 0.6)"; // 半透明灰
    // ctx.fillRect(card.x, card.y, CARD_WIDTH, CARD_HEIGHT);
    roundRect(ctx, card.x, card.y, CARD_WIDTH, CARD_HEIGHT, 10);
    ctx.fill();
  }
}

// 画卡槽背景（只画空槽位）
function drawSlots() {
  for (let i = 0; i < SLOT_COUNT; i++) {
    const slotX = SLOT_START_X + i * SLOT_SPACING;

    // 创建凹陷渐变（左上暗，右下亮）
    const gradient = ctx.createLinearGradient(
      slotX,
      SLOT_START_Y,
      slotX + CARD_WIDTH,
      SLOT_START_Y + CARD_HEIGHT,
    );
    gradient.addColorStop(0, "#e5e5e5"); // 左上暗
    gradient.addColorStop(1, "#ffffff"); // 右下亮

    // 画槽位背景（凹陷感）
    ctx.fillStyle = gradient;
    // 画槽位背景（浅灰色圆角矩形）
    // ctx.fillStyle = "rgba(200, 200, 200, 0.3)";
    ctx.strokeStyle = "#999";
    ctx.lineWidth = 2;

    // ctx.beginPath();
    // ctx.roundRect(slotX, SLOT_START_Y, CARD_WIDTH, CARD_HEIGHT, 8);
    roundRect(ctx, slotX, SLOT_START_Y, CARD_WIDTH, CARD_HEIGHT, 10);
    ctx.fill();
    ctx.stroke();
  }
  // 不画牌！牌已经在 renderBoard 里被 allCards 遍历画过了
}

// 更新所有牌的遮盖状态
function updateCoverStatus() {
  // 找出所有在牌堆的牌
  const deckCards = allCards.filter(
    (card) => card.state === "onBoardHidden" || card.state === "onBoardVisible",
  );

  // 按 z 从小到大排序（从低到高）
  const sortedFromBottom = [...deckCards].sort((a, b) => a.z - b.z);

  // 遍历每一张牌（从低到高）
  for (let i = 0; i < sortedFromBottom.length; i++) {
    const lowerCard = sortedFromBottom[i];

    // 假设它可见
    let isVisible = true;

    // 检查所有比它高的牌（j > i）
    for (let j = i + 1; j < sortedFromBottom.length; j++) {
      const higherCard = sortedFromBottom[j];

      // 如果有一张更高的牌和它重叠，它就不可见
      if (isOverlap(higherCard, lowerCard)) {
        isVisible = false;
        break; // 找到一张盖住的就不用继续了
      }
    }

    // 设置状态（初始全是 hidden，所以只改可见的）
    if (isVisible) {
      lowerCard.state = "onBoardVisible";
    }
    // 否则保持 hidden（不用动）
  }
}

// 判断两张牌是否重叠
function isOverlap(cardA, cardB) {
  // cardA 和 cardB 的矩形是否相交
  return !(
    cardA.x + CARD_WIDTH <= cardB.x || // A 在 B 左边
    cardA.x >= cardB.x + CARD_WIDTH || // A 在 B 右边
    cardA.y + CARD_HEIGHT <= cardB.y || // A 在 B 上边
    cardA.y >= cardB.y + CARD_HEIGHT
  ); // A 在 B 下边
}

// 画圆角矩形的工具函数（微信小游戏兼容版）
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// 检查并消除卡槽里的三连
function checkAndEliminate() {
  // 1. 找出所有在卡槽里的牌
  const slotCards = allCards.filter((card) => card.state === "inSlot");

  // 2. 按类型分组
  const typeGroups = {};
  slotCards.forEach((card) => {
    if (!typeGroups[card.typeId]) {
      typeGroups[card.typeId] = [];
    }
    typeGroups[card.typeId].push(card);
  });

  // 3. 检查每种类型，如果有≥3张就消除
  let eliminated = false;

  for (let typeId in typeGroups) {
    const cards = typeGroups[typeId];

    // 只要满3张就消除一组（这里简单处理：有3张消3张，有6张消6张）
    while (cards.length >= 3) {
      // 取出前3张（按放入顺序）
      const toEliminate = cards.splice(0, 3);

      // 消除后，从 slotOrder 里删除被消除牌的 id
      toEliminate.forEach((card) => {
        const orderIndex = slotOrder.findIndex((id) => id === card.id);
        if (orderIndex !== -1) {
          slotOrder.splice(orderIndex, 1); // 从顺序数组里删除
        }

        // 再从 allCards 里删除
        const index = allCards.findIndex((c) => c.id === card.id);
        if (index !== -1) {
          allCards.splice(index, 1);
        }
      });
      // 重新排列剩下的卡槽牌
      slotOrder.forEach((cardId, index) => {
        const card = allCards.find((c) => c.id === cardId);
        if (card) {
          card.x = SLOT_START_X + index * SLOT_SPACING;
          card.y = SLOT_START_Y;
        }
      });

      eliminated = true;
    }
  }

  return eliminated;
}

// 切换关卡
function loadLevel(index) {
  if (index >= 0 && index < levels.length) {
    currentLevelIndex = index;
    generateDeck(); // 重新生成牌堆
    // renderBoard();   // 重新渲染
    console.log(`切换到第 ${index + 1} 关`);
  } else {
    console.log("无效的关卡索引");
  }
}

// 检查游戏是否结束
function checkGameOver() {
  // 统计牌堆里的牌（visible 和 hidden）
  const deckCards = allCards.filter(
    (card) => card.state === "onBoardVisible" || card.state === "onBoardHidden",
  );

  // 统计卡槽里的牌
  const slotCards = allCards.filter((card) => card.state === "inSlot");

  // 输的条件：卡槽满 7 张
  if (slotCards.length >= 7) {
    console.log("💔 游戏结束：卡槽已满");
    overlayMessage.textContent = "栏位满了";
    overlayMessage.className = "lose";
    overlayButton.textContent = "再玩一遍";
    overlay.classList.remove("hidden");
    // resetBtn.classList.remove("hidden");
    return true;
  }

  // 赢的条件：牌堆空 且 卡槽空
  if (deckCards.length === 0 && slotCards.length === 0) {
    if (currentLevelIndex === levels.length - 1) {
      console.log("🎉 游戏结束：所有牌消除完毕");
      // overlayMessage.textContent = "你赢了";
      // overlayMessage.className = "win";

      // // 判断是不是最后一关
      // if (currentLevelIndex === levels.length - 1) {
      //   overlayButton.textContent = "🎉 你通关辣！🎉";
      // } else {
      //   overlayButton.textContent = "下一关";
      // }

      // 最后一关通关
      overlayMessage.textContent = "🎉 你通关辣！🎉";
      overlayMessage.className = "win";
      overlayButton.textContent = "回第一关";
    } else {
      // 普通过关
      overlayMessage.textContent = "过关啦";
      overlayMessage.className = "win";
      overlayButton.textContent = "下一关";
    }

    overlay.classList.remove("hidden");
    // resetBtn.classList.remove("hidden");
    return true;
  }

  return false;
}

// 重置游戏
function resetGame() {
  // 1. 清空所有牌
  allCards = [];

  // 2. 清空卡槽顺序记录
  slotOrder = [];
  overlay.classList.add("hidden");
  //   resetBtn.classList.add("hidden"); // 隐藏按钮

  // 3. 重新生成牌堆（使用当前关卡）
  generateDeck();

  // 4. 重新渲染（generateDeck 里已经调了 renderBoard，所以这步可省）
  // renderBoard();

  console.log("游戏已重置");
}

// 动画工具：等待指定毫秒
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 播放点击动画（缩放）
async function playClickAnimation(card) {
  // 记录原尺寸
  const originalWidth = CARD_WIDTH;
  const originalHeight = CARD_HEIGHT;
  const originalX = card.x;
  const originalY = card.y;

  // 计算缩小后的尺寸和位置（以牌中心为基准）
  const scale = 0.9;
  const scaledWidth = originalWidth * scale;
  const scaledHeight = originalHeight * scale;
  const scaledX = originalX + (originalWidth - scaledWidth) / 2;
  const scaledY = originalY + (originalHeight - scaledHeight) / 2;

  // 临时修改牌的尺寸和位置（缩小）
  card.animWidth = scaledWidth;
  card.animHeight = scaledHeight;
  card.animX = scaledX;
  card.animY = scaledY;

  // 重绘
  renderBoard();
  await sleep(80); // 停留 80ms

  // 恢复原尺寸（放大）
  card.animWidth = originalWidth;
  card.animHeight = originalHeight;
  card.animX = originalX;
  card.animY = originalY;

  // 重绘
  renderBoard();
  await sleep(50); // 再停一下
}
