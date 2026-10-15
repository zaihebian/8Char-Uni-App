<h3 align="center" style="margin: 30px 0 30px;font-weight: bold;font-size:40px;">八字排盘工具</h3>

[![star](https://gitee.com/yxbug/8Char-H5/badge/star.svg?theme=dark)](https://gitee.com/yxbug/8Char-H5/stargazers)
[![fork](https://gitee.com/yxbug/8Char-H5/badge/fork.svg?theme=dark)](https://gitee.com/yxbug/8Char-H5/members)
[![stars](https://img.shields.io/github/stars/axbug/8Char-H5?style=flat-square&logo=GitHub)](https://github.com/axbug/8Char-H5)
[![forks](https://img.shields.io/github/forks/axbug/8Char-H5?style=flat-square&logo=GitHub)](https://github.com/axbug/8Char-H5)
[![issues](https://img.shields.io/github/issues/axbug/8Char-H5?style=flat-square&logo=GitHub)](https://github.com/axbug/8Char-H5/issues)
[![Website](https://img.shields.io/badge/site-blog.yxbug.cn-blue?style=flat-square)](https://blog.yxbug.cn)
[![release](https://img.shields.io/github/v/release/axbug/8Char-H5?style=flat-square)](https://gitee.com/axbug/8Char-H5/releases)
[许可证：GPL-3.0](LICENSE)

## 项目说明
本项目基于 **Uni-APP** 框架开发的 **八字排盘工具** ，可根据已知时间、四柱进行排盘！

 - 网站首页提供排盘入口，结果页包含基本命盘、专业细盘和可复制/下载的排盘摘要。
 - 排盘数据包含四柱、十神、藏干、纳音、星运、空亡、神煞、天罡称骨、五行数据、大运流年、古籍参考等信息。

本项目基于 **Uni-APP** 开发，理论上可以将本项目打包发布到iOS、Android、Web、以及各种小程序（微信/支付宝/百度/头条/飞书/QQ/快手/钉钉/淘宝）、快应用等多个平台。

本项目主要发布到 **H5** 平台，**未对其他平台进行发布测试** ，若其他平台存在差异，请提交issues并备注问题、截图、平台、机型、复现过程等，若您有更好的建议和想法请提交issues，万分感谢！

## 授权与商业使用

本仓库代码按 [GPL-3.0](LICENSE) 发布。GPL-3.0 允许商业使用、修改与再分发；分发修改版本时仍须遵守 GPL-3.0 的源码、许可证及版权声明要求。此前 README 中“仅供学习研究”“禁止商用”的表述与仓库许可证冲突，现已移除。

本项目参考了上游 [8Char-H5](https://github.com/axbug/8Char-H5) 及其他开源项目。上游作者、第三方库、图片、图标和字体的版权与许可证仍分别适用；本仓库的说明不会改变这些权利。商业部署者应保留依法需要保留的署名与许可证，不应把上游作品标为自己的独占作品。

排盘、基础解读和知识内容均免费。用户可自行复制或下载排盘摘要；本站不提供在线 AI 解读或支付功能，也不会代用户消耗 AI token。

## 参考来源
非常感谢各位前辈的开源项目，对本项目参考的来源表示由衷的感谢！！！

| 网站/项目       | 链接                                        |
|-------------|-------------------------------------------|
| uniapp      | 	https://uniapp.dcloud.net.cn/            |
| vk-uview-ui | 	https://gitee.com/vk-uni/vk-uview-ui     |
| lunar       | 	https://gitee.com/6tail/lunar-javascript |
| …           | 	致敬各位大佬                                   |

## 安装
```shell
yarn install
```

## 运行&发布
```shell
yarn run dev:%PLATFORM%
yarn run build:%PLATFORM%
```

``%PLATFORM%`` 可取值如下：

|值|平台|
|---|---|
|app-plus|app平台生成打包资源（支持npm run build:app-plus，可用于持续集成。不支持run，运行调试仍需在HBuilderX中操作）|
|h5|H5|
|mp-alipay|支付宝小程序|
|mp-baidu|百度小程序|
|mp-weixin|微信小程序|
|mp-toutiao|字节跳动小程序|
|mp-lark|飞书小程序|
|mp-qq|qq 小程序|
|mp-360|360 小程序|
|mp-kuaishou|快手小程序|
|mp-jd|京东小程序|
|mp-xhs|小红书小程序|
|quickapp-webview|快应用(webview)|
|quickapp-webview-union|快应用联盟|
|quickapp-webview-huawei|快应用华为|

可以自定义更多条件编译平台，比如钉钉小程序，参考[package.json文档](https://uniapp.dcloud.io/collocation/package)。

## 关于项目
预览地址：[https://app.yxbug.cn/app/8char/](https://app.yxbug.cn/app/8char/)

作者博客：[https://blog.yxbug.cn/](https://blog.yxbug.cn/)
