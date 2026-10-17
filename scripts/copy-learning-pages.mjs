import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join, relative } from "node:path";

const output = join(process.cwd(), "dist", "build", "h5");
const source = join(process.cwd(), "public", "learn");
const sourceOnly = process.argv.includes("--source-only");

if (!existsSync(source) || (!sourceOnly && !existsSync(output))) {
  throw new Error("H5 build output or learning pages are missing.");
}

if (!sourceOnly) {
  mkdirSync(join(output, "learn"), { recursive: true });
  cpSync(source, join(output, "learn"), { recursive: true });
  cpSync(join(process.cwd(), "public", "robots.txt"), join(output, "robots.txt"));
}

// Render shared navigation at build time so every knowledge page remains crawlable
// without JavaScript, while navigation has one source of truth.
const mainLinks = [
  ["/", "免费排盘"],
  ["/learn/", "国学知识"],
  ["/learn/about.html", "关于本站"],
];
const topicLinks = [
  ["/learn/", "知识首页"],
  ["/learn/basics/", "基础概念"],
  ["/learn/ten-gods/", "十神关系"],
  ["/learn/shensha/", "神煞知识"],
  ["/learn/geju/", "格局目录"],
];
const footer = `<footer class="site-footer"><div class="wrap"><div><h4>国学经典</h4><p>了解传统概念，也保留独立思考。</p></div><div class="footer-links"><a href="/learn/about.html">关于本站</a><a href="/learn/privacy.html">隐私政策</a><a href="https://github.com/zaihebian/8Char-Uni-App/issues" target="_blank" rel="noopener">反馈建议</a></div><div class="copy">© <span id="yr">${new Date().getFullYear()}</span> 国学经典。内容仅供传统文化学习与参考。</div></div></footer>`;

function renderPages(directory, learnRoot) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      renderPages(path, learnRoot);
      continue;
    }
    if (!entry.name.endsWith(".html")) continue;
    const route =
      "/learn/" + relative(learnRoot, path).replaceAll("\\", "/");
    const isArticle = !route.endsWith("/index.html");
    const activeMain = route.endsWith("/about.html")
      ? "/learn/about.html"
      : "/learn/";
    const renderLink = ([href, label], active) =>
      `<a class="navlink${active ? " active" : ""}" href="${href}"${active ? ' aria-current="page"' : ""}>${label}</a>`;
    const header = `<header class="site-header"><nav class="nav" aria-label="网站导航"><a class="brand" href="/">国学经典<small>中华古籍｜传统文化｜互动体验</small></a><button class="nav-toggle" aria-label="展开网站栏目" aria-expanded="false" aria-controls="site-links">浏览栏目 ☰</button><div class="links" id="site-links">${mainLinks.map((link) => renderLink(link, link[0] === activeMain)).join("")}</div></nav></header><nav class="topic-nav wrap" aria-label="知识分类">${topicLinks.map((link) => renderLink(link, link[0] === "/learn/" ? route === "/learn/index.html" : route.startsWith(link[0]))).join("")}</nav>`;
    let html = readFileSync(path, "utf8");
    html = html
      .replace(
        /<header class="site-header">[\s\S]*?<\/header>(?:<nav class="topic-nav wrap"[\s\S]*?<\/nav>)?/,
        header,
      )
      .replace(/<footer class="site-footer">[\s\S]*?<\/footer>/, footer)
      .replace(
        "<body>",
        `<body class="knowledge-page${isArticle ? " is-article" : ""}">`,
      );
    writeFileSync(path, html);
  }
}
const target = sourceOnly ? source : join(output, "learn");
renderPages(target, target);
console.log(
  sourceOnly
    ? "Synchronized navigation in source learning pages."
    : "Copied learning pages and robots.txt into H5 output.",
);
