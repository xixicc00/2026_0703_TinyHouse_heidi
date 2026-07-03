//let color_palette = ["#482728", "#7E4E60", "#B287A3", "#C0F8D1","#BDCFB5"];
//let basePalette = ["#CDFFF9", "#817F75","#C5D9E2"];
let color_palette;
let basePalette;
let padding = 100;

async function setup() {
  createCanvas(2000, 1400); // 畫布大小：2000 * 1400
  pixelDensity(1); // 鎖定 1:1 解析度

  let color_rand = random();
  // features setting
  if (color_rand < 0.4) {
    color_palette = ["#6F1A07", "#817F75", "#B3B5BB", "#C5D9E2", "#2B2118"];
    basePalette = ["#B3B6B7"];
  } else if (color_rand < 0.7) {
    color_palette = ["#B68F40", "#B6CCA1", "#D7FCD4", "#30011E"];
    basePalette = ["#78ade5", "#465365"];
  } else {
    color_palette = [
      "#AACDEF",
      "#9DADBE",
      "#EDDBB3",
      "#DBF4A7",
      "#DBF4A7",
      "#DFDCD2",
    ];
    basePalette = ["#78ade5", "#A5668B"];
  }

  background(random(basePalette));
  colorMode(HSB);

  let xsum = 0;
  let ysum = 0;
  let yCount = int(random(30, 100));

  for (let i = 0; i < 40; i++) {
    let R = 4;
    let xSpan = R + 2;
    let ySpan = R + 2;
    let xCount = int(random(30, 60));
    let x = xsum;
    let y = ysum;
    await sleep(10);

    RJ_rect(x, y, xCount, yCount, xSpan, ySpan, R);

    xsum = xsum + xCount * xSpan;

    if (xsum > width) {
      ysum = ysum + yCount * ySpan;
      yCount = int(random(30, 100));
      xsum = 0;
      await sleep(10);
    }
  }

  noLoop();
}

function draw() {}

// 繪製矩陣函式（已修正 push/pop 錯誤）
function RJ_rect(_x, _y, _xCount, _yCount, _xSpan, _ySpan, _R) {
  let mainClr = random(color_palette);
  let fade_scale = random();

  let mainHue = hue(mainClr);
  let mainSat = saturation(mainClr);
  let mainBri = brightness(mainClr);

  let lightClr = color(mainHue, mainSat - 10, mainBri + 50);
  let waveScl = random();

  for (let i = 0; i < _xCount; i++) {
    let px = i * _xSpan + _x;
    for (let j = 0; j < _yCount; j++) {
      let py = j * _ySpan + _y;
      let fade_rate = j / _yCount;
      fade_rate = map(fade_rate, 0, 1, 0, fade_scale);

      if (random() > fade_rate) {
        push(); // ✨ 這裡開啟唯一的 push，保護裡面所有的座標轉換
        translate(px, py);

        // 1. 畫圓圈
        if (waveScl < 0.1) {
          fill(abs(sin(px / 10)) < 0.3 ? lightClr : mainClr);
        } else {
          fill(abs(sin(py / 10)) < 0.3 ? lightClr : mainClr);
        }
        noStroke();
        let r = _R * random(0.8, 1.5) + random(0.6, 0.8);
        circle(0, 0, r);

        // 2. 用線條繪製 XX 材質
        if (random() < 0.05) {
          noFill();
          stroke(mainClr);
          strokeWeight(2);
          line(-r, -r, r, r);
          line(-r, r, r, -r);
        }

        // 3. 用弧線繪製毛茸茸材質
        if (random() < 0.01) {
          noFill();
          stroke(random(color_palette));
          strokeWeight(2);
          push();
          rotate(random(TWO_PI));
          let arcW = r * 2 * random(0.8, 2);
          let arcH = r * 2 * random(0.8, 2);
          arc(-random(r), random(r), arcW, arcH, 0, PI * 1.5);
          pop();
        }

        // 4. 橢圓形
        if (random() < 0.001) {
          noFill();
          stroke(random(color_palette));
          strokeWeight(2);
          push();
          rotate(random(TWO_PI));
          ellipse(0, 0, 80, 40); // 修正：2D 模式下 ellipse 帶 4 個參數即可
          pop();
        }

        pop(); // ✨ 所有的材質畫完後，才在這裡做對應的 pop()
      }
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ✨ 新增：按鍵下載功能
function keyPressed() {
  if (key === "s" || key === "S") {
    saveCanvas("my_sketch", "png");
  }
}
