// The former hosted AI feature is retired. Never call a paid model from this route.
module.exports = function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(410).json({message: '本站不再提供在线 AI 解读。请在结果页复制或下载排盘摘要。'});
};
