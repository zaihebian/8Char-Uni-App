// 白话渊海 —— 站点通用脚本（极轻量，无第三方依赖）
(function () {
  // 移动端导航展开/收起
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav .links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', links.classList.contains('open') ? 'true' : 'false');
    });
    // 点击链接后自动收起
    links.addEventListener('click', function (e) {
      if (e.target.classList.contains('navlink')) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
  // 页脚年份
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();
})();
