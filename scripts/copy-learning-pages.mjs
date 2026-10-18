import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join, relative } from "node:path";
import { editorialFor } from "./learning-editorial.mjs";
import { expansionFor } from "./learning-expansions.mjs";

const output = join(process.cwd(), "dist", "build", "h5");
const source = join(process.cwd(), "public", "learn");
const shenshaAssetSource = join(process.cwd(), "src", "static", "icon", "shensha", "individual");
const shenshaAssetTarget = join(source, "assets", "images", "shensha");
const sourceOnly = process.argv.includes("--source-only");
const siteOrigin = "https://coinslotclub.online";
const adsenseScript = '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9743802431901928" crossorigin="anonymous"></script>';

if (!existsSync(source) || (!sourceOnly && !existsSync(output))) {
  throw new Error("H5 build output or learning pages are missing.");
}

if (!sourceOnly) {
  mkdirSync(join(output, "learn"), { recursive: true });
  cpSync(source, join(output, "learn"), { recursive: true });
  cpSync(join(process.cwd(), "public", "robots.txt"), join(output, "robots.txt"));
  cpSync(join(process.cwd(), "public", "ads.txt"), join(output, "ads.txt"));
}

// Keep the original 800px transparent shensha portraits available to the
// static knowledge pages. The H5 build already contains these source assets;
// copying them here gives the article pages one stable, crawlable URL.
if (existsSync(shenshaAssetSource)) {
  mkdirSync(shenshaAssetTarget, { recursive: true });
  cpSync(shenshaAssetSource, shenshaAssetTarget, { recursive: true });
  if (!sourceOnly) {
    cpSync(shenshaAssetTarget, join(output, "learn", "assets", "images", "shensha"), { recursive: true });
  }
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
const updatedAt = "2026-10-18";

const shenshaImageByArticle = {
  "fuxing.html": 7,
  "huagai.html": 8,
  "kongwang.html": 13,
  "sanqi.html": 6,
  "shi-e-da-bai.html": 13,
  "sifei.html": 12,
  "taiji.html": 3,
  "taohua.html": 10,
  "tiande-yuede.html": 5,
  "tiangong.html": 7,
  "tianluo-diwang.html": 14,
  "tianyi.html": 2,
  "wenzhang.html": 1,
  "yangren.html": 11,
  "yima.html": 9,
};

function publicRoute(filePath, learnRoot) {
  const relativePath = relative(learnRoot, filePath).replaceAll("\\", "/");
  if (relativePath === "index.html") return "/learn/";
  return "/learn/" + relativePath.replace(/index\.html$/, "");
}

function renderPages(directory, learnRoot, routes) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      renderPages(path, learnRoot, routes);
      continue;
    }
    if (!entry.name.endsWith(".html")) continue;
    const route = "/learn/" + relative(learnRoot, path).replaceAll("\\", "/");
    const canonicalRoute = publicRoute(path, learnRoot);
    routes.push(canonicalRoute);
    const isArticle = !route.endsWith("/index.html");
    const activeMain = route.endsWith("/about.html")
      ? "/learn/about.html"
      : "/learn/";
    const renderLink = ([href, label], active) =>
      `<a class="navlink${active ? " active" : ""}" href="${href}"${active ? ' aria-current="page"' : ""}>${label}</a>`;
    const header = `<header class="site-header"><nav class="nav" aria-label="网站导航"><a class="brand" href="/">国学经典<small>中华古籍｜传统文化｜互动体验</small></a><button class="nav-toggle" aria-label="展开网站栏目" aria-expanded="false" aria-controls="site-links">浏览栏目 ☰</button><div class="links" id="site-links">${mainLinks.map((link) => renderLink(link, link[0] === activeMain)).join("")}</div></nav></header><nav class="topic-nav wrap" aria-label="知识分类">${topicLinks.map((link) => renderLink(link, link[0] === "/learn/" ? route === "/learn/index.html" : route.startsWith(link[0]))).join("")}</nav>`;
    let html = readFileSync(path, "utf8");
    if (relative(learnRoot, path).startsWith("shensha/") && shenshaImageByArticle[entry.name]) {
      const imageIndex = shenshaImageByArticle[entry.name];
      const articleTitle = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]
        ?.replace(/<[^>]+>/g, "")
        .trim() || "神煞";
      const portrait = `<figure class="shensha-portrait"><img src="/learn/assets/images/shensha/${imageIndex}.png" width="800" height="800" loading="lazy" decoding="async" alt="${articleTitle}神煞小像"><figcaption>${articleTitle} · 神煞意象</figcaption></figure>`;
      html = html.replace(/<figure class="svgfig">[\s\S]*?<\/figure>/i, portrait);
    }
    if (!sourceOnly && !html.includes("pagead2.googlesyndication.com/pagead/js/adsbygoogle.js")) {
      html = html.replace("</head>", `${adsenseScript}\n</head>`);
    }
    if (!sourceOnly && !html.includes('rel="canonical"')) {
      html = html.replace(
        "</head>",
        `<link rel="canonical" href="${siteOrigin}${canonicalRoute}">\n</head>`,
      );
    }
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
    if (isArticle && !route.endsWith("/about.html") && !route.endsWith("/privacy.html")) {
      const heading = html.match(/<(?:h1|h2)[^>]*>([\s\S]*?)<\/(?:h1|h2)>/i)?.[1]
        ?.replace(/<[^>]+>/g, "")
        .trim() || "传统文化概念";
      const relativeArticlePath = relative(learnRoot, path).replaceAll("\\", "/");
      const editorial = editorialFor(relativeArticlePath, heading);
      const expansion = expansionFor(relativeArticlePath);
      const editorialMeta = `<aside class="editorial-meta" aria-label="文章资料信息"><div><strong>作者</strong><span>白文涛</span></div><div><strong>参考</strong><a href="/learn/editorial.html">${editorial.source}</a></div><div><strong>更新</strong><time datetime="${updatedAt}">${updatedAt}</time></div></aside><div class="editorial-note"><strong>白文涛的阅读提示</strong><p>${editorial.focus}</p><p>${editorial.guide}</p><p class="editorial-link"><a href="/learn/editorial.html">查看编校方法与完整资料说明 →</a></p></div>`;
      const expansionBlock = `<section class="author-expansion" aria-label="白文涛补充解读"><h2>白文涛补充解读</h2><p>${expansion.specific}</p><h3>把它放回实际阅读</h3><p>${expansion.exercise}</p><p>${expansion.context}</p></section>`;
      if (!html.includes("class=\"editorial-meta\"")) {
        html = html.replace(/(<(?:h1|h2)[^>]*>[\s\S]*?<\/(?:h1|h2)>)/i, `$1${editorialMeta}`);
      }
      if (!html.includes("class=\"author-expansion\"")) {
        html = html.includes('<div class="relbox">')
          ? html.replace('<div class="relbox">', `${expansionBlock}<div class="relbox">`)
          : html.replace("</section>", `${expansionBlock}</section>`);
      }
      html = html
        .replace(/<meta name="author"[^>]*>\s*/gi, "")
        .replace("</head>", `<meta name="author" content="白文涛"><meta name="dateModified" content="${updatedAt}">\n</head>`)
        .replace(/"author":\{"@type":"Organization","name":"国学经典"\}/g, `"author":{"@type":"Person","name":"白文涛","url":"${siteOrigin}/learn/editorial.html"}`)
        .replace(/("@type":"Article",)/g, `$1"dateModified":"${updatedAt}",`);
    }
    writeFileSync(path, html);
  }
}
const target = sourceOnly ? source : join(output, "learn");
const routes = [];
renderPages(target, target, routes);
if (!sourceOnly) {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${["/", ...routes]
    .sort()
    .map((route) => `  <url><loc>${siteOrigin}${route}</loc></url>`)
    .join("\n")}\n</urlset>\n`;
  writeFileSync(join(output, "sitemap.xml"), sitemap);
}
console.log(
  sourceOnly
    ? "Synchronized navigation in source learning pages."
    : "Copied learning pages, robots.txt, and ads.txt into H5 output.",
);
