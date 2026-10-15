// Production API for BaZi calculation
export const APP_API = "https://api.app.yxbug.cn/api";

export const Post = (url, param, host) => {
  return Request(url, "POST", param, host);
};

export const Get = (url, param, host) => {
  return Request(url, "GET", param, host);
};

export const Request = async (url, method, param, host) => {
  const response = await uni.request({
    url: host + url,
    data: param,
    method,
    timeout: 20000,
  });
  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw new Error(response.data?.msg || "排盘服务暂时不可用，请稍后重试。");
  }
  return response.data?.data;
};
