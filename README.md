#TODO
批量导入gitlab中的规则
Service mock

# Http Trick

页面开发一般分为三个阶段

* 新页面开发
* bug查找修复
* 增加新功能

在二、三阶段中常会使用代理工具\(如: charlse\)实现下面功能

* 将js代理到本地
* mock接口数据等等
* 让app不使用js、css缓存

在实际使用过程中，现有的工具使用起来繁琐。另外，项目是以团队为单位协作开发的，每个人都需要单独配置规则很麻烦。

所以我们开发了一个操作简单的proxy，点一点鼠标就能满足debug、新功能的需要；项目的请求处理规则可以在团队之间共享。

## 特点

1. 以项目为单位请求处理规则共享
2. host配置
3. 图形化界面配置请求处理规则
4. 支持web socket mock
5. 简单易用

## 安装
npm i -g zan-proxy

## 运行
zan-proxy