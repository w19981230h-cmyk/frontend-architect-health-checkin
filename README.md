# AI患者运营管理

此仓库包含完整患者管理系统及其所有导航页面，包括数据看板最新稿、数据看板更新版、任务管理、患者管理、方案与内容、运营管理、AI医助、系统管理和服务管理。

## 公开访问

- 完整系统：https://w19981230h-cmyk.github.io/frontend-architect-health-checkin/
- 数据看板更新版：https://w19981230h-cmyk.github.io/frontend-architect-health-checkin/dashboard-updated.html

`dashboard-updated.html` 对应本地「数据看板更新版」副本的入口，复用与主项目一致的资源。系统导航内也可切换新旧看板。

## 发布

推送 main 后通过 GitHub Actions 校验模拟数据并发布所有静态页面。数据为演示数据；GitHub Pages 提供静态页面预览，不运行本地预览服务器的文件写入接口。

本地 `sites-publish` 是原 Sites 发布工程，主应用源码在本仓库。公开预览统一使用 GitHub Pages。
