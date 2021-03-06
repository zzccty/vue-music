# vue-music

> vue2.x + vue-router + vuex + jsonp + es6 + webpack 抓取 QQ 音乐真实数据的移动端音乐 WebApp

# 技术栈

【前端】

- `Vue`：用于构建用户界面的 MVVM 框架
- `vue-router`：为单页面应用提供的路由系统，使用了 `Lazy Loading Routes` 技术来实现异步加载优化性能
- `vuex`：Vue 集中状态管理，在多个组件共享某些状态时非常便捷
- `vue-lazyload`：实现图片懒加载，节省用户流量，优化页面加载速度
- `better-scroll`：解决移动端各种滚动场景需求的插件，使移动端滑动体验更加流畅
- `Sass`：css 预编译处理器
- `ES6`：ECMAScript 新一代语法，模块化、解构赋值、Promise、Class 等方法非常好用

【后端】

- `Node.js`: 利用 Express 搭建一个本地测试服务器
- `jsonp`: 服务端通讯。 用于抓取 qq 音乐数据
- `axios`: 服务端通讯。 结合我们的 Node.js 代理后端请求,抓取我们 qq 音乐数据

【自动化构建工具】

- `webpack`: 项目编译打包工具
- `vue-cl3`: Vue 脚手架工具, 可快速搭建项目
- `eslint`: 代码风格检查工具, 规范代码格式
- `vConsole`: 移动端调试工具, 在移动端输出日志

## 收获

1. 总结出一套适用于 Vue 项目的通用组件
2. 总结了一套常用的 Sass mixin 库
3. 总结了一套常用的 JS 工具函数库
4. 学会了如何在 Vue 中优雅的操作 Dom 来完成优秀的用户交互体验

## TODO

1. 歌曲数据全部来自 QQ 音乐，接口改变了可能就要修改 `jsonp` 和 `axios` 代码
2. 由于项目的应用级状态不多（10 个左右），所以就没有将 `action`、`mutation`、和 `getters` 分割到单独的文件。但这样架构并不便于维护

## 项目演示地址

:yum: 项目演示地址：[移动端音乐 WebApp](http://www.yeelei.top/music)，或者可以扫描二维码访问：

![](./doc/erweima.png)

## 实现页面

主要页面: 推荐页,歌单详情页, 歌手页, 歌手详情页, 播放器内核页, 排行页, 搜索页, 添加歌曲页, 个人中心页

核心页面: 播放器内核页

**组件树**

```
<app> ................... 根组件
  <my-player> ........... 全局的播放器内核组件
  <my-header> ........... 头部组件
  <my-tab> .............. 导航栏组件
  <router-view> ......... 路由
    <recommend> ......... 推荐页
    <singer> ............ 歌手页
    <rank> .............. 排行页
    <search> ............ 搜索页
```

**推荐页**

上部分是一个轮播图组件, 是一个基础组件,所以封装在 `base` 目录下, 使用了第三方库 `better-scroll` 辅助实现, 使用 `jsonp` 抓取了 qq 音乐数据

下部分是一个歌单推荐列表, 使用了 `axios` + `Node.js` 代理后端请求, 绕过 qq 音乐官方主机限制(伪造了 headers), 从而顺利的抓取了 qq 音乐的接口数据

歌单推荐列表图片, 使用了 `vue-lazyload`, 优化了页面加载速度

为了更好的提高用户体验, 当数据未请求到时, 加入了基础组件 `loading` 组件

**推荐页 -> 歌单详情页**

由于歌手的状态多且杂，这里使用 `vuex` 集中管理歌手状态

这个组件更加注重 UX，做了很多类原生 APP 动画，如下拉图片放大、跟随推动、ios 渐进增强的高斯模糊效果 `backdrop-filter` 等

**歌手页**

左右联动是这个组件的难点

左侧是一个歌手列表, 使用 `jsonp` 抓取 qq 音乐歌手数据并进行重组 JSON 数据结构, 以获取我们所需要的数据格式

列表图片使用懒加载技术 `vue-lazyload`，优化页面加载速度

右侧是一个字母列表，与左侧歌手列表联动，滚动固定标题实现

**歌手页 -> 歌手详情页**

复用歌单详情页，只改变传入的参数，数据同样爬取自 QQ 音乐

**播放器内核页**

核心组件。用 `vuex` 管理各种播放时状态，播放、暂停等功能调用 [audio API](http://www.w3school.com.cn/tags/html_ref_audio_video_dom.asp)

播放器可以最大化和最小化

中部唱片动画使用第三方 JS 动画库 `create-keyframe-animation` 实现

底部操作区图标使用 `iconfonts`

抽象了一个横向进度条组件和一个圆形进度条组件。横向进度条可以拖动小球和点击进度条来改变播放进度，圆形进度条组件使用 `SVG <circle>` 元素

播放模式有：顺序播放、单曲循环、随机播放，原理是调整歌单列表数组

歌词的爬取利用 `axios` 代理后端请求，伪造 `headers` 来实现，先将歌词 jsonp 格式转换为 json 格式，再使用第三方库 [`js-base64`](https://github.com/dankogai/js-base64) 进行 Base64 解码操作，最后再使用第三方库 [`lyric-parser`](https://github.com/ustbhuangyi/lyric-parser)对歌词进行格式化

实现了侧滑显示歌词、歌词跟随进度条高亮等交互效果

增加了当前播放列表组件，可在其中加入/删除歌曲

**排行页**

普通组件，获取数据通过 `jsonp` 获取数据, 渲染页面

**排行页 -> 歌单详情页**

复用歌单详情页，和歌手详情页类似

**搜索页**

抓数据，写组件，另外，根据抓取的数据特征，做了上拉刷新的功能

考虑到数据量大且频繁的问题，对请求做了节流处理

考虑到移动端键盘占屏的问题，对滚动前的 `input` 做了 `blur()` 操作

对搜索历史进行了 `localstorage` 缓存，清空搜索历史时使用了改装过的 `confirm` 组件

支持将搜索的歌曲添加到播放列表

**个人中心页**

将 `localstorage` 中 “我的收藏” 和 “最近播放” 中的数据渲染到界面上

**其他**

此应用的全部数据来自 QQ 音乐，推荐页的歌单列表及歌词是利用 `axios` 结合 `node.js` 代理后端请求抓取的。

全局通用的应用级状态使用 `vuex` 集中管理

全局引入 `fastclick` 库，消除 click 移动浏览器 300ms 延迟

页面是响应式的，适配常见的移动端屏幕，采用 `px` + `flex` 布局

## 注意

此音乐播放器数据全部来自 QQ 音乐，接口改变了就需要修改 jsonp 和 axios 代码

## 安装与运行

```
git clone https://github.com/YeeLei/vue-music.git

cd vue-music

npm install //安装依赖

npm run serve //服务端运行 访问 http://localhost:8080

npm run build  //项目打包
```
