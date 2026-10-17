const fs = require("fs");
const path = require("path");
const Jimp = require("jimp");

const ROOT = path.resolve(__dirname, "..");
const OUTPUT_SIZE = 800;
const INNER_SIZE = 720;

const tenGods = [
  ["bijian", 0, 0, 225, 200],
  ["jiecai", 220, 0, 205, 200],
  ["shishen", 420, 0, 190, 200],
  ["shangguan", 605, 0, 215, 200],
  ["zhengcai", 825, 0, 175, 200],
  ["piancai", 0, 200, 225, 200],
  ["zhengguan", 245, 200, 175, 200],
  ["qisha", 400, 200, 220, 200],
  ["zhengyin", 615, 200, 195, 200],
  ["pianyin", 800, 200, 200, 200],
];

function ensureDirectory(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function removeSmallEdgeComponents(image) {
  const { width, height, data } = image.bitmap;
  const visited = new Uint8Array(width * height);
  const components = [];
  const alphaAt = (index) => data[index * 4 + 3];

  for (let start = 0; start < width * height; start += 1) {
    if (visited[start] || alphaAt(start) < 16) continue;
    const stack = [start];
    const pixels = [];
    let touchesEdge = false;
    visited[start] = 1;

    while (stack.length) {
      const index = stack.pop();
      pixels.push(index);
      const x = index % width;
      const y = Math.floor(index / width);
      if (x <= 1 || y <= 1 || x >= width - 2 || y >= height - 2) {
        touchesEdge = true;
      }
      const neighbors = [
        x > 0 ? index - 1 : -1,
        x < width - 1 ? index + 1 : -1,
        y > 0 ? index - width : -1,
        y < height - 1 ? index + width : -1,
      ];
      for (const neighbor of neighbors) {
        if (neighbor >= 0 && !visited[neighbor] && alphaAt(neighbor) >= 16) {
          visited[neighbor] = 1;
          stack.push(neighbor);
        }
      }
    }
    components.push({ pixels, touchesEdge });
  }

  const largest = Math.max(...components.map(({ pixels }) => pixels.length), 0);
  for (const component of components) {
    if (!component.touchesEdge || component.pixels.length >= largest * 0.3) continue;
    for (const index of component.pixels) data[index * 4 + 3] = 0;
  }
  return image;
}

function fitOnTransparentCanvas(image, size = OUTPUT_SIZE, inner = INNER_SIZE) {
  removeSmallEdgeComponents(image);
  image.autocrop();
  const scale = Math.min(inner / image.bitmap.width, inner / image.bitmap.height);
  image.resize(
    Math.max(1, Math.round(image.bitmap.width * scale)),
    Math.max(1, Math.round(image.bitmap.height * scale)),
    Jimp.RESIZE_BICUBIC,
  );
  const canvas = new Jimp(size, size, 0x00000000);
  canvas.composite(
    image,
    Math.round((size - image.bitmap.width) / 2),
    Math.round((size - image.bitmap.height) / 2),
  );
  return canvas;
}

async function writeImage(image, filePath) {
  ensureDirectory(filePath);
  await image.writeAsync(filePath);
}

async function extractTenGods() {
  const sprite = await Jimp.read(
    path.join(ROOT, "src/static/icon/ten-gods/sprite.png"),
  );
  for (const [name, x, y, width, height] of tenGods) {
    const portrait = fitOnTransparentCanvas(
      sprite.clone().crop(x, y, width, height),
    );
    await Promise.all([
      writeImage(
        portrait.clone(),
        path.join(ROOT, `src/static/icon/ten-gods/full/${name}.png`),
      ),
      writeImage(
        portrait.clone(),
        path.join(ROOT, `public/learn/assets/images/ten-gods/${name}.png`),
      ),
    ]);
  }
}

async function extractShensha() {
  const sprite = await Jimp.read(
    path.join(ROOT, "src/static/icon/shensha/sprite.png"),
  );
  for (let index = 0; index < 16; index += 1) {
    const column = index % 4;
    const row = Math.floor(index / 4);
    const left = Math.round((column * sprite.bitmap.width) / 4);
    const top = Math.round((row * sprite.bitmap.height) / 4);
    const right = Math.round(((column + 1) * sprite.bitmap.width) / 4);
    const bottom = Math.round(((row + 1) * sprite.bitmap.height) / 4);
    const icon = fitOnTransparentCanvas(
      sprite.clone().crop(left, top, right - left, bottom - top),
    );
    await writeImage(
      icon,
      path.join(ROOT, `src/static/icon/shensha/individual/${index}.png`),
    );
  }
}

Promise.all([extractTenGods(), extractShensha()]).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
